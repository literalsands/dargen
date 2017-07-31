/**
 * @module PhenotypeHelpers
 */
const PhenotypeHelpers = {
  /**
   * Chooses an element from an array.
   * Use with 0 to 1 genomes.
   *
   * @function module:PhenotypeHelpers/choose
   * @param {array} - Array to make choice from.
   * @returns {function}
   */
  choose: function(arr) {
    if (!Array.isArray(arr)) throw TypeError("Argument is not an Array");
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
   * @function module:PhenotypeHelpers/dynamic
   * @param {integer} - Length or arity of the function.
   * @param {function} - Function to set the length on.
   * @returns {function}
   */
  dynamic: function(length, func) {}
};
export default PhenotypeHelpers;
