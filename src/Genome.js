import { getRandomInt } from "./helpers";

/**
 * Creates a new Genome.
 *
 * @export
 * @class Genome
 * @param {Genome|Array|Number|undefined} genome - An array of genes or a number indicating the length of the genome.
 * @extends {Array}
 */
export class Genome extends Array {
  constructor(genes) {
    if (Number.isSafeInteger(genes) && genes >= 0) {
      super();
      this.size = genes;
    } else if (Array.isArray(genes)) {
      super(...genes);
    } else {
      super();
    }
  }

  // Override this for different gene types.
  /**
   * Returns a random valid gene value.
   *
   * @returns Number
   * @memberof Genome
   */
  getRandomGeneValue() {
    return Math.random();
  }

  /**
   * Size is the same as length.
   *
   * @memberof Genome
   */
  get size() {
    return this.length;
  }

  /**
   * Setting size equivalent to setting length, but new positions are automatically populated with gene values.
   *
   * @memberof Genome
   */
  set size(length) {
    let start = this.length;
    this.length = length;
    if (start < length) {
      this.fillRandom(start, length - 1);
    }
  }

  /**
   * Sets a gene position to a random value.
   *
   * @param {integer} index
   * @returns Genome - Genome with position filled by a random gene value.
   * @memberof Genome
   */
  toRandom(index) {
    this[index] = this.getRandomGeneValue();
    return this;
  }

  /**
   * Set gene values form start to stop to random values.
   *
   * @param {integer} [start=0]
   * @param {integer} [stop=this.length - 1]
   * @returns Genome - Genome with positions filled by random gene values.
   * @memberof Genome
   */
  fillRandom(start = 0, stop = this.length - 1) {
    for (let i = start; i < stop + 1; i++) {
      this.toRandom(i);
    }
    return this;
  }

  /**
   *  Randomly increment or decrement value at a gene position.
   *
   * @param {integer} index
   * @param {number} increment
   * @memberof Genome
   */
  increment(index, increment) {
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

  /**
   *  Select genes at a certain rate.
   *
   * @param {number} rate
   * @returns integer[] - An array of selected gene positions.
   * @memberof Genome
   */
  selection(rate) {
    return this.reduce((selection, gene, i) => {
      if (Math.random() <= rate) {
        selection.push(i);
      }
      return selection;
    }, []);
  }

  /* Genetic mutation operators. */

  _deletion(rate) {
    let selection = this.selection(rate);
    // Group consecutive selections.
    selection.reverse().forEach(selected => {
      this.splice(selected, 1);
    });
  }

  // Repeat, in place, contiguously selected.
  _duplication(rate) {
    let selection = this.selection(rate),
      groupedSelection = selection.reduce(
        (groups, selected) => {
          let currentGroup = groups[groups.length - 1];
          if (currentGroup[currentGroup.length - 1] === selected - 1) {
            currentGroup.push(selected);
          } else {
            groups.push([selected]);
          }
          return groups;
        },
        [[]]
      );
    groupedSelection.reverse().forEach(group => {
      this.splice(group[0], 0, ...group.map(i => this[i]));
    });
  }

  // Invert, in place, contiguously selected.
  _inversion(rate) {
    let selection = this.selection(rate),
      groupedSelection = selection.reduce(
        (groups, selected) => {
          let currentGroup = groups[groups.length - 1];
          if (currentGroup[currentGroup.length - 1] === selected - 1) {
            currentGroup.push(selected);
          } else {
            if (currentGroup.length === 1) {
              currentGroup[0] = selected;
            } else {
              groups.push([selected]);
            }
          }
          return groups;
        },
        [[]]
      );
    groupedSelection.forEach(group => {
      this.splice(group[0], group.length, ...group.reverse().map(i => this[i]));
    });
  }

  // Set selected to a random value.
  _substitution(rate) {
    let selection = this.selection(rate);
    selection.forEach(selected => {
      this.toRandom(selected);
    });
  }

  // Apply increment or decrement randomly to selected.
  _incrementation(rate, increment) {
    let selection = this.selection(rate);
    selection.forEach(selected => {
      this.increment(selected, increment);
    });
  }

  /**
   * Apply mutations to genome.
   *
   * @param {Object|Array} options - Options specifying a single mutation or an array of options as a pipeline of mutations.
   * @returns Genome - Returns the same genome, with mutation or mutation pipeline applied, unless specified.
   * @memberof Genome
   */
  mutate(options) {
    let {
      deletion = 0,
      duplication = 0,
      inversion = 0,
      incrementation = 0,
      increment = 0,
      substitution = 0.0,
      modify = true,
      upper = Infinity,
      lower = 1
    } = options || {};
    let genome = modify ? this : this.copy();
    // Chance to duplicate something.
    // Duplication limitations.
    genome._duplication(duplication);
    // Chance to inverse a section.
    // Inverse limitations.
    genome._inversion(inversion);
    // Chance for substitution.
    // Substitution limitations.
    genome._substitution(substitution);
    // Chance for deletion.
    // Deletion limitations.
    genome._deletion(deletion);
    // Chance for incrementation.
    // Amount to increment.
    genome._incrementation(incrementation, increment);
    // Truncate the genome to the max size.
    if (Number.isFinite(upper) && genome.size > upper) {
      genome.size = upper;
    }
    // Increase the genome to the minimum size.
    if (Number.isFinite(lower) && genome.size < lower) {
      genome.size = lower;
    }
    return genome;
  } // end mutate

  // Random chance any particular gene is from either parent.
  // Splice, Pivot Splice
  // Genes retain position or not.
  // Splice or average splice.
  // Crossover is sectional or uniform.
  /**
   *
   *
   * @param {Object|Array} options - Options specifying a single crossover mechanism or an array of options as a pipeline of crossover mechanisms.
   * @param {...Genome|...Array} mates - Genomes used in crossover.
   * @returns Genome - Genome created using the genes of this Genome and mates.
   * @memberof Genome
   */
  crossover(options, ...mates) {
    let {
      crossover = 1 - 1 / mates.length,
      modify = false,
      average = false
    } = options;
    let child = modify ? this : this.slice();
    // Retrieve a selection of gene indexes that will be changed.
    let selection = child.selection(crossover);
    // Set that gene equally from all parents.
    selection.forEach(selected => {
      let geneMate = mates[Math.floor(Math.random() * mates.length)];
      // If mate doesn't contain gene length, abort.
      let cross = geneMate.length > selected
        ? geneMate[selected]
        : child[selected];
      if (average) {
        child.spliceAverage(selected, 1, cross, 0.5);
      } else {
        child.splice(selected, 1, cross);
      }
    });
    return child;
  } // end crossover

  spliceAverage(start = 0, extend = this.length, splice, weight = 1) {
    for (
      let i = 0;
      i < extend && start + i < this.length && start + i < splice.length;
      i++
    ) {
      this[start + i] =
        (this[start + i] * weight + splice[start + i] / weight) / (2 + weight);
    }
  }

  /* Helper Methods */
  /**
   * Creates a shallow copy of this genome.
   *
   * @returns Genome - A shallow copy of this genome.
   * @memberof Genome
   */
  copy() {
    return this.slice();
  }

  /**
   * Determine if this genome is equal to another.
   *
   * @param {Genome|Array} genome - Genome for comparison.
   * @returns boolean - The genomes have the same values at the same positions and are of the same length.
   * @memberof Genome
   */
  isEqual(genome) {
    if (this.length !== genome.length) {
      return false;
    }
    return this.every((value, index) => genome[index] === value);
  }

  /**
   * Find the percentage of shared genes.
   *
   * @param {Genome|Array} genome - Genome for comparison.
   * @returns Number - The percentage of same genes at same gene positions compared to the longest of the two genomes.
   * @memberof Genome
   */
  howSimilar(genome) {
    return (
      this.reduce((n, v, i) => (this[i] === genome[i] ? n + 1 : n), 0) /
      (this.length > genome.length ? this.length : genome.length)
    );
  }
}
