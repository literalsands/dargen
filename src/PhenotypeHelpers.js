/**
 * @module PhenotypeHelpers
 */
const PhenotypeHelpers = {
  /**
   * Chooses an element from an array.
   * Use with 0 to 1 genomes.
   *
   * @function choose
   * @memberof PhenotypeHelpers
   * @param {Array} choices - Array to make choice from.
   * @returns {Function}
   */
  choose: function(arr) {
    if (!Array.isArray(arr)) throw TypeError("choose takes argument array");
    return function(unit) {
      return unit === 1
        ? arr[arr.length - 1]
        : arr[Math.floor(unit * arr.length)];
    };
  },
  /**
   * Sets a desired 'length' for the function.
   * This is just the starting size if using duplication and/or removal.
   *
   * @function arity
   * @memberof PhenotypeHelpers
   * @param {integer} arity - Desired length or arity of the function.
   * @param {Function} func - Function to set the length on.
   * @returns {Function}
   */
  arity: function(length, func) {
    if (!(typeof length === "number" && func instanceof Function)) throw TypeError("arity takes arguments number and function")
    Object.defineProperty(func, "length", {value: length});
    return func;
  }
};

export default PhenotypeHelpers;
