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
   * @type {Object}
   * @memberof Phenotype
   */
  set representation(phenotype) {
    this._representation = flatten(phenotype);
  }
  /**
   * Representation as a flattened object.
   *
   * @type {Object}
   * @memberof Phenotype
   */
  get representation() {
    return this._representation;
  }
  /**
   * Get the flattened names of functions.
   *
   * @readonly
   * @type {string[]}
   * @memberof Phenotype
   */
  get names() {
    return this.representation.keys().filter((key) => this.representation[key] instanceof Function);
  }
  /**
   * Get the combined length of all functions.
   *
   * @readonly
   * @type {integer}
   * @memberof Phenotype
   */
  get length() {
    return this.lengths.values().reduce((sum, length) => (sum + length), 0);
  }
  /**
   * Get the length of every function.
   *
   * @readonly
   * @type {integer[]}
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
