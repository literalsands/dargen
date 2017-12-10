/**
 * @module PhenotypeHelpers
 */
/**
 * Chooses an element from an array.
 * Use with 0 to 1 genomes.
 *
 * @function choose
 * @namespace PhenotypeHelpers
 * @param {Array} choices - Array to make choice from.
 * @returns {Function}
 */
export function choose(arr) {
  if (!Array.isArray(arr)) throw TypeError("choose takes argument array");
  return function(unit) {
    return unit === 1
      ? arr[arr.length - 1]
      : arr[Math.floor(unit * arr.length)];
  };
}
/**
 * Sets a desired 'length' for the function.
 * This is just the starting size if using duplication and/or removal.
 *
 * @function arity
 * @namespace PhenotypeHelpers
 * @param {integer} arity - Desired length or arity of the function.
 * @param {Function} func - Function to set the length on.
 * @returns {Function}
 */
export function arity(length, func) {
  if (!(typeof length === "number" && func instanceof Function))
    throw TypeError("arity takes arguments number and function");
  Object.defineProperty(func, "length", { value: length });
  return func;
}
