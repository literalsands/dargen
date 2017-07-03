import { Genome } from "./Genome";
import { Epigenome } from "./Epigenome";
import { Phenotype } from "./Phenotype";
import uuid from "node-uuid";
let { v4: getIdentifier } = uuid;

/**
 * Create a new Individual
 *
 * @exports Individual
 * @classdesc The optimization unit. Contains an easily mutated encoded value, the genome, a decoder, the phenotype and the epigenome, and the decoded value, it's traits.
 * @class
 * @param {Individual|Individual~json} [individual] Object containing the individual.
 * @example
 *
 * // Individuals don't have to have any attributes, but that makes them pretty boring.
 * let boring = new Individual()
 *
 * // You can assign values later.
 * boring.phenotype = {personality: "none"}
 *
 * @example
 * // Individuals that are only given a phenotype give themselves a genome and epigenome based off of length of phenotype functions.
 * new Individual({
 *   phenotype: {
 *     color: (r, g, b) => `rgb(${[r, g, b].join(',')})`, // length 3
 *     animal: (g) => ["dog", "monkey", "cat"][Math.floor(g*3)], // length 1
 *     names: [
 *       (g) => ["Angie", "Martha", "John", "Jerry"][Math.floor(g*4)], // length 1
 *       (g) => ["Brown", "Austen", "Hook", "Perry"][Math.floor(g*4)], // length 1
 *     ]
 *   },
 *   // genome: new Genome(6),
 *   // epigenome: new Epigeome(["color", "color", "color", "animal", "names.0", "names.1"])
 * })
 *
 */
export class Individual {
  constructor(options = {}) {
    let phenotype;
    ({
      genome: this.genome = new Genome(1),
      epigenome: this.epigenome,
      parents: this.parents,
      generation: this.generation,
      population: this.population,
      timestamp: this.timestamp = +new Date(),
      identifier: this.identifier = `i-${getIdentifier()}`,
      phenotype
    } = options);

    if (!this.genome instanceof Genome) {
      this.genome = new Genome(this.genome);
    }
    if (phenotype !== undefined) {
      this.phenotype = phenotype;
    }
    if (!this.epigenome instanceof Epigenome) {
      this.epigenome = new Epigenome(this.epigenome);
    }
  }

/**
 * @typedef Individual~json
 * @type {Object}
 * @property {String} [identifier=`i-${getIdentifier()}`] - A unique string for the individual. Automatically populated by UUID or genome.
 * @property {Date|String|Number} [timestamp=new Date()] - A timestamp of when this individual was created.
 * @property {Phenotype|Object} [phenotype] - An object containing functions.
 * @property {Genome|Array} [genome=new Genome()] - An array containing genes.
 * @property {Epigenome|Array} [epigenome] - An array containing strings specifying phenotype functions and corresponding to gene positions.
 * @property {Array} [parents] - An array of parent individual identifiiers.
 * @property {String} [generation] - An optional string specifying the generation in which this individual was created.
 * @property {String} [population] - An optional string specifying the population in which this individual was created.
 */

  /**
   * Phenotype for the individual.
   *
   * @type {Phenotype}
   * @memberof Individual
   */
  get phenotype() {
    return this._phenotype;
  }

  /**
   * Set phenotype, enforce type, and grow genome size to phenotype length.
   *
   * @type {Phenotype|Object}
   * @memberof Individual
   */
  set phenotype(phenotype) {
    if (!(phenotype instanceof Phenotype)) {
      phenotype = new Phenotype(phenotype);
    }
    let phenotype_length = phenotype.length;
    // Create genome minimum for arrays.
    if (this.genome.size < phenotype_length) {
      this.genome.size = phenotype_length;
    }
    this._phenotype = phenotype;
  }

  /* Setup Individual using configuration object */
  // private variables

  /**
   * Return the decoded genome.
   *
   * @readonly
   * @type {Object}
   * @memberof Individual
   *
   * @example
   *
   * // Given an individual of this shape.
   *
   * new Individual(
   *   genome: [0.1, 0.5, 0.4, 0.9, 0.6, 0.24],
   *   epigenome: ["color", "color", "color", "animal", "names.0", "names.1"],
   *   phenotype: {
   *     color: (r, g, b) => `rgb(${[r, g, b].join(',')})`,
   *     animal: (g) => ["dog", "monkey", "cat"][Math.floor(g*3)],
   *     names: [
   *       (g) => ["Angie", "Martha", "John", "Jerry"][Math.floor(g*4)],
   *       (g) => ["Brown", "Austen", "Hook", "Perry"][Math.floor(g*4)],
   *     ]
   *   }
   * )
   * 
   * // The traits are the decoded output.
   * 
   * individual.traits // =>
   * 
   * {
   *   color: "rgb(0.1, 0.5, 0.4)",
   *   // color: `rgb(${[0.1, 0.5, 0.4].join(',')})`,
   *   animal: "cat",
   *   // animal: ["dog", "monkey", "cat"][2],
   *   names: ["John", "Brown"]
   *   // names: [
   *   //   ["Angie", "Martha", "John", "Jerry"][2],
   *   //   ["Brown", "Austen", "Hook", "Perry"][0]
   *   // ]
   * }
   *
   */
  get traits() {
    // this.phenotype.apply(undefined, this.epigenome.compile(this.genome))
    let traits = this._phenotype();
    return traits;
  }

  /**
   * Call function on individual's traits.
   *
   * @param {Function} func
   * @returns any
   * @memberof Individual
   */
  evaluate(func) {
    return func(this.traits);
  }

  /* Genetic operators */

  /**
   * Mutate the individual's genome.
   *
   * Utilizes the individual's `traits.mutate` value.
   *
   * @returns {this}
   * @memberof Individual
   */
  mutate() {
    this.genome.mutate(this.traits.mutate);
    return this;
  }

  /**
   * Creates a new individual using given mates.
   *
   * Utilizes this individual's `traits.crossover` value.
   *
   * @param {...Individual} mates - Individuals to exchange genes with.
   * @returns {this} - A new child Individual using genes from this Individual and mates.
   * @memberof Individual
   */
  crossover(...mates) {
    var childGenome = this.genome.crossover(
      this.traits.crossover,
      ...mates.map(i => i.genome)
    );
    // How do we decide the new generation? This might need to be called again, higher up.
    return new Individual({
      genome: childGenome,
      phenotype: this.phenotype,
      parents: mates.reduce(
        (parents, mate) => {
          parents.push(mate.identifier);
          return parents;
        },
        [this.identifier]
      )
    });
  }
}
