import { getRandomInt } from "./helpers";
import { GenomeBase } from "./GenomeBase";

/**
 * Creates a new Unit Vector Genome.
 *
 * @exports UnitVectorGenome
 * @classdesc A vector of 0 to 1, inclusive, genetic representation. Three dimensional by default.
 * @class
 * @param {UnitVectorGenome|Number[]|Number|undefined} genome - An array of genes or a number indicating the length of the genome.
 * @extends {GenomeBase}
 * @example
 */
export class UnitVectorGenome extends GenomeBase {
  constructor(genes, dimension) {
    super(genes);
    if (Number.isSafeInteger(genes) && genes >= 0) {
      super();
      this.dimension = dimension;
      this.size = genes;
    } else if (Array.isArray(genes)) {
      super(genes);
      this.dimension = genes[0].length;
    } else {
      super();
      this.dimension = dimension;
    }
  }

  /**
   * Returns a random gene value from 0 to 1, inclusive.
   *
   * @returns Number
   * @memberof UnitVectorGenome
   * @example
   * // Returns a random value from 0 to 1.
   * let genome = new UnitVectorGenome()
   * genome.getRandomGeneValue() >= 0 //=> true
   * genome.getRandomGeneValue() <= 1 //=> true
   */
  getRandomGeneValue() {
    return Array.from(new Array(this.dimension), () => Math.random());
  }

  copy() {
    return new UnitVectorGenome(this.map((g) => g.slice()), this.dimension)
  }

  set dimension(dimension=3) {
    if (!Number.isSafeInteger(dimension))
      throw new TypeError("Dimension must be a positve integer");
    this._dimension = dimension;
    // TODO: Clip or lengthen array to dimension.
  }

  get dimension() {
    return this._dimension;
  }
}

/* Genetic mutation operators. */
/**
 * @module Mutations/Unit
 */
UnitVectorGenome.Mutations = Object.assign({}, GenomeBase.Mutations, {
  /**
   * Apply increment to selected.
   * @function module:Mutations/UnitVector.rotate
   * @type {module:Representation#MutationMethod}
   * @param {Genome} genome
   * @param {integer[]} selection
   * @param {Object} params
   * @param {Number[]} params.direction
   * @param {Number} params.rotations
   */
  rotate(
    genome,
    selection,
    { direction = genome.getRandomGeneValue(), rotations = 1 }
  ) {
    for (let i=0; i<selection.length; i++) {
      for (let d = Math.min(direction.length, genome[i].length) - 1; d > -1; d--) {
        genome[i][d] = (genome[i][d] + direction[d] * rotations) % 1;
      }
    }
  }
});
