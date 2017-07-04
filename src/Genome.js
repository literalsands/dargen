import { getRandomInt } from "./helpers";
import {GenomeBase} from "./GenomeBase";

/**
 * Creates a new Genome.
 *
 * @exports Genome
 * @classdesc A simple 0 to 1, inclusive, genetic representation.
 * @class
 * @param {Genome|Array|Number|undefined} genome - An array of genes or a number indicating the length of the genome.
 * @extends {GenomeBase}
 * @example
 * // Create a boring Genome
 * let boring = new Genome();
 * boring //=> []
 *
 * @example
 * // Create an Genome with specific genes.
 * let genome = new Genome([0, 0, 0.01, 0.011, 0, 0.8])
 *
 * @example
 * // Create an randomly populated Genome of a certain size from a given alphabet.
 * let genome = new Genome(6)
 * genome.size //=> 6
 * genome.every(function(gene) {
 *   return gene >=0 && gene <=1
 * })
 * //=> true
 *
 * @example
 * // Genome json representation will restore to a deep copy of the object.
 * let genome = new Genome(25)
 * let genomeFromJSON = JSON.parse(JSON.stringify(genome))
 * genome.isEqual(genomeFromJSON) //=> true
 *
 */
export class Genome extends GenomeBase {

  constructor(genes) {
    super(genes);
  }

  /**
   * Returns a random gene value from 0 to 1, inclusive.
   *
   * @returns Number
   * @memberof Genome
   * @example
   * // Returns a random value from 0 to 1.
   * let genome = new Genome()
   * genome.getRandomGeneValue() >= 0 //=> true
   * genome.getRandomGeneValue() <= 1 //=> true
   */
  getRandomGeneValue() {
    return Math.random();
  }
  _spliceAverage(start = 0, extend = this.length, splice, weight = 1) {
    for (
      let i = 0;
      i < extend && start + i < this.length && start + i < splice.length;
      i++
    ) {
      this[start + i] =
        (this[start + i] * weight + splice[start + i] / weight) / (2 + weight);
    }
  }
}

/* Genetic mutation operators. */
/**
 * @module Mutations/Unit
 */
Genome.Mutations = Object.assign({}, GenomeBase.Mutations, {
  /**
   * Apply increment to selected.
   * @function module:Mutations/Unit.increment
   * @type module:Representation#MutationMethod
   * @param {Genome} genome
   * @param {integer[]} selection
   * @param {Object} params
   * @param {Number} params.incrememt
   */
  increment(genome, selection, {increment}) {
    let selection = this.selection(rate);
    selection.forEach(index => {
        if (this[index] <= 0) this[index] += increment;
        else if (this[index] >= 1) this[index] -= increment;
        else {
          this[index] = Math.random() > 0.5
            ? this[index] + increment
            : this[index] - increment;
        }
        if (this[index] < 0) this[index] = 0;
        if (this[index] > 1) this[index] = 1;
      }
    );
  },
  /**
   * Apply decrement to selected.
   * @function module:Mutations/Unit.decrement
   * @type module:Representation#MutationMethod
   * @param {Genome} genome
   * @param {integer[]} selection
   * @param {Object} params
   * @param {Number} params.decrement
   */
  decrement(genome, selection, {decrement}) {
    let selection = this.selection(rate);
    selection.forEach(index => {
        if (this[index] <= 0) this[index] += increment;
        else if (this[index] >= 1) this[index] -= increment;
        else {
          this[index] = Math.random() > 0.5
            ? this[index] + increment
            : this[index] - increment;
        }
        if (this[index] < 0) this[index] = 0;
        if (this[index] > 1) this[index] = 1;
      }
    );
  }
})
