/**
 * Creates a new Genome.
 *
 * @exports GenomeBase
 * @private
 * @class GenomeBase
 * @param {GenomeBase|Array|Number|undefined} genome - An array of genes or a number indicating the length of the genome.
 * @extends {Array}
 */
export class GenomeBase extends Array {

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

  /**
   * Override this to create a gene type.
   *
   * @abstract
   * @returns any
   * @memberof GenomeBase
   */
  getRandomGeneValue() {
    console.error("Not implemented.");
    return undefined;
  }

  /**
   * The size of the genome.
   *
   * @type {integer}
   * @memberof GenomeBase
   */
  get size() {
    return this.length;
  }

  /**
   * Setting size equivalent to setting length, but new positions are automatically populated with gene values.
   *
   * @type {integer}
   * @memberof GenomeBase
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
   * @returns {this} - Genome with position filled by a random gene value.
   * @memberof GenomeBase
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
   * @returns {this} - Genome with positions filled by random gene values.
   * @memberof GenomeBase
   */
  fillRandom(start = 0, stop = this.length - 1) {
    for (let i = start; i < stop + 1; i++) {
      this.toRandom(i);
    }
    return this;
  }

  /**
   *  Select genes at a certain rate.
   *
   * @param {number} rate
   * @returns integer[] - An array of selected gene positions.
   * @memberof GenomeBase
   */
  selection(rate) {
    return this.reduce((selection, gene, i) => {
      if (Math.random() <= rate) {
        selection.push(i);
      }
      return selection;
    }, []);
  }

  /**
   * Returns Genome.Mutations.
   *
   * @readonly
   * @memberof GenomeBase
   */
  get mutations() {
    return this.constructor.Mutations;
  }

  /**
   * Apply mutations to genome.
   *
   * @param {Object|Array} options - Options specifying a single mutation or an array of options as a pipeline of mutations.
   * @param {String|Function} options.mutation - Mutation name or function.
   * @param {Object} options.params - Parameters for the mutation.
   * @param {GenomeBase~requestMutationDetails} callback - Callback passed the mutation outcomes.
   * @returns {this} this | this.copy() - Returns the same genome, with mutation or mutation pipeline applied, unless specified.
   * @memberof GenomeBase
   */
  mutate(options, callback) {
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
  }

  /**
   * @callback GenomeBase~requestMutationDetails
   * @param {Array} mutations - Captured mutations from mutation pipeline.
   * @param {Array} mutations[].mutation - Mutation applied.
   * @param {Array} mutations[].selection - Positions mutation options were applied to.
   * @param {Array} mutations[].params - Mutation options applied.
   * @param {Genome} genome - Pre-mutation Genome shallow copy.
   * @param {Genome} mutated - Mutated Genome shallow copy.
   */

  /**
   * Create a new Genome by selecting genes from multiple parents.
   *
   * @param {Object|Array} options - Options specifying a single crossover mechanism or an array of options as a pipeline of crossover mechanisms.
   * @param {Genome|Array|Genome[]|Array[]} mates - Genomes used in crossover.
   * @param {GenomeBase~requestCrossoverDetails} callback - Callback passed the mutation outcomes.
   * @returns {this} this.copy() | this - Genome created using the genes of this Genome and mates.
   * @memberof GenomeBase
   */
  crossover(options, mates, callback) {
    // Random chance any particular gene is from either parent.
    // Splice, Pivot Splice
    // Genes retain position or not.
    // Splice or average splice.
    // Crossover is sectional or uniform.
    let {
      crossover = 1 - 1 / mates.length,
      modify = false,
      average = false
    } = options;
    let child = modify ? this : this.copy();
    // Retrieve a selection of gene indexes that will be changed.
    let selection = child.selection(crossover);
    // Set that gene equally from all parents.
    selection.forEach(selected => {
      let geneMate = mates[Math.floor(Math.random() * mates.length)];
      // If mate doesn't contain gene length, abort.
      let cross = geneMate.length > selected
        ? geneMate[selected]
        : child[selected];
      child.splice(selected, 1, cross);
    });
    return child;
  }
  /**
   * @callback GenomeBase~requestCrossoverDetails
   * @param {Array} crossovers - Captured mutations from mutation pipeline.
   * @param {Array} crossovers[].crossover - Crossover options applied.
   * @param {Array} crossovers[].selection - Positions crossover options were applied to.
   * @param {Array} crossovers[].parent_selection - Parents chosen for each crossover position.
   * @param {Genome[]} parents - Array of parent genomes.
   * @param {Genome} child - Child Genome.
   */

  /* Helper Methods */
  /**
   * Creates a shallow copy of this genome.
   *
   * @returns {this} - A shallow copy of this genome.
   * @memberof GenomeBase
   */
  copy() {
    return this.slice();
  }

  /**
   * Determine if this genome is equal to another.
   *
   * @param {Genome|Array} genome - Genome for comparison.
   * @returns boolean - The genomes have the same values at the same positions and are of the same length.
   * @memberof GenomeBase
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
   * @returns {Number} - The percentage of same genes at same gene positions compared to the longest of the two genomes.
   * @memberof GenomeBase
   */
  howSimilar(genome) {
    return (
      this.reduce((n, v, i) => (this[i] === genome[i] ? n + 1 : n), 0) /
      (this.length > genome.length ? this.length : genome.length)
    );
  }
}

/* Genetic mutation operators. */
/**
 * Extend available mutation methods.
 * @function MutationMethod
 * @param {Genome|Array} genome - Genome to mutate.
 * @param {integer[]} selection - Genome positions to apply mutation to.
 * @param {Object} params - Mutation parameters.
 * @returns {undefined}
 */
GenomeBase.Mutations =  {
  deletion(genome, selection, rate) {
    let selection = this.selection(rate);
    // Group consecutive selections.
    selection.reverse().forEach(selected => {
      this.splice(selected, 1);
    });
  },
  // Repeat, in place, contiguously selected.
  duplication(rate) {
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
  },
  // Invert, in place, contiguously selected.
  inversion(rate) {
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
  },
  // Set selected to a random value.
  substitution(rate) {
    let selection = this.selection(rate);
    selection.forEach(selected => {
      this.toRandom(selected);
    });
  }
}
