/**
 *
 * @classdesc Extend this class to create a custom Genome type.
 * @class GenomeBase
 * @param {Array|Number|undefined} genome - An array of genes or a number indicating the length of the genome.
 * @extends {Array}
 *
 * @example
 * // Extend this class to create a new Genome type.
 * const MyGenome = function(){};
 * MyGenome.prototype = GenomeBase.prototype;
 * MyGenome.prototype.constructor = GenomeBase.prototype.constructor;
 * MyGenome.prototype.getRandomGeneValue = function() {
 *   return "Gene";
 * }
 * MyGenome.Mutations = Object.assign({}, GenomeBase.Mutations, {
 *   // Assign some unique mutations.
 * }
 *
 * // The new genome behaves.
 * let genome = new MyGenome(4) //=> ["Gene", "Gene", "Gene", "Gene"]
 *
 * genome.mutate({mutation: "duplication", params: {rate: 1}})
 * genome //=> ["Gene", "Gene", "Gene", "Gene", "Gene", "Gene", "Gene", "Gene"]
 * genome.size //=> 8
 *
 * genome.mutate({mutation: "deletion", params: {rate: 1}})
 * genome //=> []
 * genome.size //=> 0
 *
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
   * Override this method to create a gene type.
   *
   * @abstract
   * @returns any
   * @memberof GenomeBase
   * @example
   * // Extend in your own class to create a genome.
   * const DNAGenome = function(){};
   * DNAGenome.prototype = GenomeBase.prototype;
   * DNAGenome.prototype.getRandomGeneValue = function() {
   *   return (Math.random()>0.5) ? "AT": "CG";
   * }
   */
  getRandomGeneValue() {
    console.error("Not implemented.");
    return null;
  }

  /**
   * The size of the genome.
   *
   * Setting size equivalent to setting length, but new positions are automatically populated with gene values.
   *
   * @type {integer}
   * @memberof GenomeBase
   * @example
   * let genome = new GenomeBase()
   * // Size is equivalent with length.
   * genome.size === genome.length //=> true
   * // But, increasing the size fills the genome with random values.
   * genome.size = 1
   * genome.length //=> 1
   * typeof genome[0] === typeof genome.getRandomGeneValue() //=> true
   *
   */
  get size() {
    return this.length;
  }

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
   * @example
   * let genome = new GenomeBase()
   * genome.toRandom(4)
   * // Equivalent to
   * genome[4] = genome.getRandomGeneValue()
   * typeof genome[4] === typeof genome.toRandom(4)[4] //=> true
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
   * @example
   * let genome = new GenomeBase(4)
   * genome.fillRandom(1, 3)
   * // Equivalent to
   * genome[1] = genome.getRandomGeneValue()
   * genome[2] = genome.getRandomGeneValue()
   * genome[3] = genome.getRandomGeneValue()
   * @example
   * let genome = new GenomeBase(4)
   * genome.fillRandom(2)
   * // Equivalent to
   * genome[2] = genome.getRandomGeneValue()
   * genome[3] = genome.getRandomGeneValue()
   * @example
   * let genome = new GenomeBase(4)
   * genome.fillRandom(undefined, 2)
   * // Equivalent to
   * genome[0] = genome.getRandomGeneValue()
   * genome[1] = genome.getRandomGeneValue()
   * genome[2] = genome.getRandomGeneValue()
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
   * @example
   * let genome = new GenomeBase(4)
   * genome.selection(1).length //=> 4
   * genome.selection(0).length //=> 0
   * genome.selection(1) //=> [0, 1, 2, 3]
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
   * @type Object
   * @property {module:Representation#MutationMethod} methodName
   * @memberof GenomeBase
   * @example
   * // Add new mutations by settings them as static methods of static object Mutations.
   * GenomeBase.Mutations["addbugs"] = function(genome, selection, params) {
   *   genome[selection[0]] = "bug"
   * }
   * let genome = new GenomeBase()
   * genome.mutations.addbugs instanceof Function //=> true
   */
  get mutations() {
    return this.constructor.Mutations;
  }

  /**
   * Apply mutations to genome.
   *
   * @param {Object|Array} options - Options specifying a single mutation or an array of options as a pipeline of mutations.
   * @param {String|Function} options.name - Mutation name or function.
   * @param {Object} options.params - Parameters for the mutation.
   * @param {GenomeBase~requestMutationDetails} callback - Callback passed the mutation outcomes.
   * @returns {this} this | this.copy() - Returns the same genome, with mutation or mutation pipeline applied, unless specified.
   * @memberof GenomeBase
   * @example
   * // Mutate is a method of all Genomes.
   * let genome = new GenomeBase()
   * // Mutate the genome, and collect some meta information in a callback.
   * genome.mutate({
   *   name: "substitution",
   *   params: {rate: 0.5}
   * }, function(mutations, genome, mutatedGenome) {
   *   smoothness = genome.howSimilar(mutatedGenome));
   * })
   *
   * // Create a mutation pipeline.
   * genome.mutate([
   *   {
   *     name: "substitution",
   *     params: {rate: 0.1}
   *   },
   *   {
   *     name: "duplication",
   *     params: {rate: 0.05}
   *   }
   * ])
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
   * @param {Array|Array[]} mates - Genomes used in crossover.
   * @param {GenomeBase~requestCrossoverDetails} callback - Callback passed the mutation outcomes.
   * @returns {this} this.copy() | this - Genome created using the genes of this Genome and mates.
   * @memberof GenomeBase
   * @example
   * // Crossover is a method of all Genomes.
   * let genome = new GenomeBase()
   * // Crossover genomes to create a child, and provide a callback to collect meta information.
   * let otherGenomes = [new GenomeBase()]
   * genome.crossover({
   *   crossover: "contiguous",
   *   params: {rate: 1 / (otherGenomes.length + 1)}
   * }, otherGenomes, function(crossovers, parents, child) {
   *   smoothness = genome.howSimilar(child)
   * })
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
   * @param {this[]} parents - Array of parent genomes.
   * @param {this} child - Child Genome.
   */

  /* Helper Methods */
  /**
   * Creates a shallow copy of this genome.
   *
   * @returns {this} - A shallow copy of this genome.
   * @example
   * // Copy is a method of all Genomes
   * let genome = new GenomeBase()
   * let genomeCopy = genome.copy()
   * genomeCopy.isEqual(genome) //=> true
   */
  copy() {
    return this.slice();
  }

  /**
   * Determine if this genome is equal to another.
   *
   * @param {Array} genome - Genome for comparison.
   * @returns boolean - The genomes have the same values at the same positions and are of the same length.
   * @memberof GenomeBase
   * @example
   * // isEqual is a method of all Genomes
   * let genome = new GenomeBase([1, 2, 3])
   * let otherGenome = [1, 2, 3]
   * genome.isEqual(otherGenome) //=> true
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
   * @param {Array} genome - Genome for comparison.
   * @returns {Number} - The percentage of same genes at same gene positions compared to the longest of the two genomes.
   * @memberof GenomeBase
   * @example
   * // howSimilar is a method of all Genomes.
   * let genome = new GenomeBase([1, 2, 3])
   * let otherGenome = [1, 2, 3]
   * genome.howSimilar(otherGenome) //=> 1
   * @example
   * let genome = new GenomeBase([1, 2, 3])
   * let otherGenome = [1, 2, 2, 3]
   * // Total equivalent positions, ([0, 1] => 2)
   * // divided by,                 (/)
   * // max length of genomes.      (4)
   * genome.howSimilar(otherGenome) //=> 0.5
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
 * @module Representation
 */
/**
 * Extend available mutation methods.
 * @function module:Representation#MutationMethod
 * @param {Array} genome - Genome to mutate.
 * @param {integer[]} selection - Genome positions to apply mutation to.
 * @param {Object} params - Mutation parameters.
 * @returns {undefined}
 * @example
 * GenomeBase.Mutations.shrink = function (genome) {
 *   genome.size = genome.size - 1
 * }
 *
 * @example
 * Genome = function() {}
 * BioGenome.prototype = GenomeBase.prototype
 * BioGenome.Mutations = Object.assign({}, GenomeBase.Mutations, {
 *   flip: function (genome, selection) {
 *     selection.forEach(function(genePosition) {
 *       genome[genePosition] = genome[genePosition] === "AT"
 *         ? "CG"
 *         : "AT"
 *     }
 *   }
 * }
 */
/**
 * @module Mutations/Base
 */
GenomeBase.Mutations =  {
  /**
   * Simple deletion.
   * @function module:Mutations/Base.deletion
   * @type module:Representation#MutationMethod
   */
  deletion(genome, selection, rate) {
    let selection = this.selection(rate);
    // Group consecutive selections.
    selection.reverse().forEach(selected => {
      this.splice(selected, 1);
    });
  },
  /**
   * Repeat, in place, contiguously selected gene positions.
   * @function module:Mutations/Base.duplication
   * @type module:Representation#MutationMethod
   */
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
  /**
   * Invert, in place, contiguously selected gene positions.
   * @function module:Mutations/Base.inversion
   * @type module:Representation#MutationMethod
   */
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
  /**
   * Set selected genes to a random value.
   * @function module:Mutations/Base.substitution
   * @type module:Representation#MutationMethod
   */
  substitution(rate) {
    let selection = this.selection(rate);
    selection.forEach(selected => {
      this.toRandom(selected);
    });
  }
}
