import flatten from "flat";
let { unflatten } = flatten;

/**
 * Creates a new phenotype.
 *
 * @exports Phenotype
 * @classdesc Simple, configurable decoder representation.  Contains useful methods and abstractions for interacting with Objects and Arrays filled with functions.
 * @class
 * @param {Phenotype|object|function} - An arbitrary object containing functions or a function.
 * @returns {Phenotype} - Returns the new Phenotype.
 */
export class Phenotype {
  constructor(phenotype = {}) {
    this.representation = phenotype;
  }
  /**
   * Set the arbitrary object containing functions, or set the single function.
   *
   * The representation is flattened.
   *
   * @type {object|function}
   * @memberof Phenotype
   */
  set representation(phenotype) {
    this._representation =
      phenotype instanceof Function
        ? phenotype
        : phenotype instanceof Object ? flatten(phenotype) : {}; // TODO Not fail so silently?
  }

  get representation() {
    return this._representation || {};
  }
  /**
   * Get the flattened names of functions.
   *
   * @readonly
   * @type {string[]}
   * @memberof Phenotype
   */
  get names() {
    return Object.keys(this.representation).filter(
      key => this.representation[key] instanceof Function
    );
  }
  /**
   * Get the combined length of all functions.
   *
   * @readonly
   * @type {integer}
   * @memberof Phenotype
   */
  get length() {
    return this.representation instanceof Function
      ? this.representation.length
      : Object.values(this.lengths).reduce((sum, length) => sum + length, 0);
  }
  /**
   * Get the length of every function.
   *
   * @readonly
   * @type {integer[]}
   * @memberof Phenotype
   */
  get lengths() {
    return this.names.reduce(
      (lengths, name) =>
        Object.assign(
          lengths,
          this.representation[name] instanceof Function
            ? { [name]: this.representation[name].length }
            : {}
        ),
      {}
    );
  }
  /**
   * Apply an Object of name keys and argument values to the representation.
   *
   * @param {object} [thisArg] - `this` parameter for function.
   * @param {object|array} funcArgs - Object of argument values.
   * @returns {object} - Decoded phenotype, or traits.
   * @memberof Phenotype
   */
  apply(thisArg, funcArgs) {
    if (funcArgs === undefined) {
      funcArgs = thisArg;
      thisArg = undefined;
    }
    return this.representation instanceof Function
      ? this.representation.apply(
          thisArg,
          Array.isArray(funcArgs) ? funcArgs : [funcArgs]
        )
      : unflatten(
          Object.assign(
            {},
            this.representation,
            Object.keys(funcArgs).reduce(
              (representation, name) =>
                Object.assign(
                  representation,
                  this.representation[name] instanceof Function
                    ? {
                        [name]: this.representation[name].apply(
                          thisArg,
                          funcArgs[name]
                        )
                      }
                    : {}
                ),
              {}
            )
          )
        );
  }

  /**
   * Bind `this` and an Object of name keys and argument values to the representation.
   *
   * @param {object} thisArg - `this` parameter for function.
   * @param {object|array} funcArgs - Object of argument values.
   * @returns {object} - Bound phenotype.
   * @memberof Phenotype
   */
  bind(thisArg, funcArgs) {
    return this.representation instanceof Function
      ? this.representation.bind(
          thisArg,
          ...(Array.isArray(funcArgs) ? funcArgs : [funcArgs])
        )
      : unflatten(
          Object.keys(this.representation).reduce(
            (representation, name) =>
              Object.assign(
                representation,
                this.representation[name] instanceof Function
                  ? {
                      [name]: this.representation[name].bind(
                        thisArg,
                        // If given arguments map, and that arguments map contains an entry for this function.
                        ...((funcArgs && funcArgs[name]) || [])
                      )
                    }
                  : {}
              ),
            {}
          )
        );
  }
}
