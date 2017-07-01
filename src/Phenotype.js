import flatten from "flat";
let { unflatten } = flatten;

/**
 * Simple, configurable decoder representation.
 * Contains useful methods and abstractions for interacting with Objects and Arrays filled with functions.
 *
 * @exports Phenotype
 * @class Phenotype
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
   * @memberof Phenotype
   */
  set representation(phenotype) {
    this._representation = flatten(phenotype);
  }
  /**
   * Representation as a flattened object.
   *
   * @memberof Phenotype
   */
  get representation() {
    return this._representation;
  }
  /**
   * Get the flattened names of functions.
   *
   * @readonly
   * @memberof Phenotype
   */
  get names() {
    return this.representation.keys().filter((key) => this.representation[key] instanceof Function);
  }
  /**
   * Get the combined length of all functions.
   *
   * @readonly
   * @memberof Phenotype
   */
  get length() {
    return this.lengths.values().reduce((sum, length) => (sum + length), 0);
  }
  /**
   * Get the length of every function.
   *
   * @readonly
   * @memberof Phenotype
   */
  get lengths() {
    return this.names.reduce((lengths, name) => Object.assign(lengths, {[name]: this.representation[name].length}));
  }
  /**
   * Apply an Object of name keys and argument values to the representation.
   *
   * @param {Object} thisArg - `this` parameter for function.
   * @param {Object} funcArgs - Object of argument values.
   * @returns {Object} - Decoded phenotype, or traits.
   * @memberof Phenotype
   */
  apply(thisArg, funcArgs) {
    return unflatten(Object.assign({},
      this.representation,
      this.funcArgs.keys().reduce((repr, name) => Object.assign(repr, {[name]: this.representation[name].apply(thisArg, funcArgs[name])}), {})
    ));
  }
}