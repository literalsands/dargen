import { getRandomInt } from "./helpers";
import {GenomeBase} from "./GenomeBase";

/**
 * Creates a new Genome.
 *
 * @export
 * @class Genome
 * @param {Genome|Array|Number|undefined} genome - An array of genes or a number indicating the length of the genome.
 * @extends {GenomeBase}
 */
export class Genome extends GenomeBase {

  constructor(genes) {
    super(genes);
  }

  /**
   * Returns a random valid gene value.
   *
   * @returns Number
   * @memberof Genome
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
Genome.Mutations = Object.assign({}, GenomeBase.Mutations, {
  // Apply increment or decrement randomly to selected.
  incrementation(rate, increment) {
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