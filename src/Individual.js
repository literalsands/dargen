import { Genome } from "./Genome";
import { GenomeBase } from "./GenomeBase";
import { Epigenome } from "./Epigenome";
import { Phenotype } from "./Phenotype";
import uuid from "node-uuid";
let { v4: getIdentifier } = uuid;

const DefaultPhenotype = new Phenotype(function() {
  return this.genome;
})
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
      genome: this.genome,
      epigenome: this.epigenome,
      parents: this.parents,
      generation: this.generation,
      population: this.population,
      timestamp: this.timestamp = +new Date(),
      identifier: this.identifier = `i-${getIdentifier()}`,
      phenotype
    } = options);
    this.phenotype = phenotype;
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
   * Set phenotype, enforce type, and grow genome size to phenotype length.
   *
   * @type {Phenotype|Object}
   * @memberof Individual
   * @example
   * // The phenotype is converted into a phenotype if it isn't already.
   * let individual = new Individual()
   * individual.phenotype = {name: "Green"}
   * individual.phenotype instanceof Phenotype //=> true
   *
   * @example
   * // Setting the phenotype can change the genome and epigenome if they aren't already set.
   * let individual = new Individual()
   * individual.phenotype = {name: (color) => "Rainbow"}
   * individual.phenotype.length //=> 1
   * individual.genome.length //=> 1
   * individual.epigenome.length //=> 1
   * individual.epigenome[0] //=> "name"
   *
   * @example
   * let individual = new Individual({genome: [0, 1, 0.5]})
   * individual.traits //=> [0, 1, 0.5]
   *
   */
  get phenotype() {
    return this._phenotype;
  }

  set phenotype(phenotype) {
    // Set phenotype to be a Phenotype object.
    this._phenotype =
      phenotype instanceof Phenotype
      ? phenotype
      : phenotype !== undefined
      ? new Phenotype(phenotype)
      : DefaultPhenotype;
    // Set default genome and epigenome based off of phenotype.
    this._default_genome = new Genome();
    this._default_genome.size = this._phenotype.length;
    let epigenome = Object.entries(
      this._phenotype.lengths
    ).reduce((epigenome, [name, length]) => {
      epigenome.length += length
      return epigenome.fill(name, epigenome.length-length);
    }, []
    );
    this._default_epigenome = new Epigenome(epigenome, this._phenotype.names);
  }

  get epigenome() {
    return this._epigenome instanceof Epigenome
      ? this._epigenome
      : this._default_epigenome;
  }

  set epigenome(epigenome) {
    this._epigenome =
      epigenome instanceof Epigenome
        ? epigenome
        : Array.isArray(epigenome) ? new Epigenome(epigenome) : undefined;
  }

  get genome() {
    return this._genome instanceof GenomeBase
      ? this._genome
      : this._default_genome;
  }

  set genome(genome) {
    this._genome =
      genome instanceof Genome
        ? genome
        : Array.isArray(genome) ? new Genome(genome) : undefined;
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
    let traits = this.phenotype.apply(
      this,
      this.epigenome.compile(this.genome)
    );
    return traits;
  }

  /* Genetic operators */

  /**
   * Mutate the individual's genome.
   *
   * Utilizes the individual's `traits.mutate` value.
   *
   * @returns {this}
   * @memberof Individual
   *
   * @example
   * let individual = new Individual();
   * individual.mutate()
   * @example
   * // Influence mutations through phenotype mutate.
   * let individual = new Individual({
   *   phenotype: {
   *     mutation: {
   *       name: "incrementation",
   *       params: {
   *         // Genome determines the increment.
   *         increment: (v) => v * 0.1
   *         rate: 0.1
   *       }
   *     }
   *   }
   * });
   * individual.mutate()
   */
  mutate() {
    this.epigenome.mutate(this.traits.mutate, (options) => {
      this.genome.mutate(options)
    });
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
   *
   * @example
   * let individual = new Individual();
   * let mates = [new Individual()];
   * individual.crossover(...mates)
   * @example
   * // Influence crossover through phenotype crossover.
   * let individual = new Individual({
   *   phenotype: {
   *     crossover: {
   *       name: "contiguous",
   *       params: {rate: 0.3}
   *     }
   *   }
   * });
   * let mates = [new Individual()];
   * individual.crossover(...mates)
   */
  crossover(...mates) {
    var childGenome = this.genome.crossover(
      this.traits.crossover,
      mates.map(i => i.genome)
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
