import flatten from "flat";
let { unflatten } = flatten;

/**
 * Creates a new phenotype.
 *
 * @exports Phenotype
 * @classdesc Simple, configurable decoder representation.  Contains useful methods and abstractions for interacting with Objects and Arrays filled with functions.
 * @class
 * @param {Phenotype} - An arbitrary object containing functions.
 * @returns {Phenotype} - Returns the new Phenotype.
 */
export class Phenotype {
  constructor(phenotype = {}) {
    this.representation = phenotype;
  }
  /**
   * Set the arbitrary object containing functions.
   *
   * @type {object}
   * @memberof Phenotype
   */
  set representation(phenotype) {
    this._representation = flatten(phenotype);
  }
  /**
   * Representation as a flattened object.
   *
   * @type {object}
   * @memberof Phenotype
   */
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
    return Object.values(this.lengths).reduce((sum, length) => sum + length, 0);
  }
  /**
   * Get the length of every function.
   *
   * @readonly
   * @type {integer[]}
   * @memberof Phenotype
   */
  get lengths() {
    return this.names.reduce((lengths, name) =>
      Object.assign(
        lengths,
        this.representation[name] instanceof Function
          ? { [name]: this.representation[name].length }
          : {}
      )
    , {});
  }
  /**
   * Apply an Object of name keys and argument values to the representation.
   *
   * @param {object} [thisArg] - `this` parameter for function.
   * @param {object} funcArgs - Object of argument values.
   * @returns {object} - Decoded phenotype, or traits.
   * @memberof Phenotype
   */
  apply(thisArg, funcArgs) {
    if (funcArgs === undefined) {
      funcArgs = thisArg;
      thisArg = undefined;
    }
    return unflatten(
      Object.assign(
        {},
        this.representation,
        Object.keys(funcArgs).reduce(
          (repr, name) =>
            Object.assign(
              repr,
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
}
