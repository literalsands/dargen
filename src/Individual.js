import { Genome } from "./Genome";
import flatten from "flat";
import uuid from "node-uuid";
let { unflatten } = flatten;
let { v4: getIdentifier } = uuid;

/**
 * Create a new Individual
 *
 * @export
 * @class Individual
 *
 * @param {Individual|Object} [individual] Object containing the individual.
 * @param {String} [individual.identifier=`i-${getIdentifier()}`] - A unique string for the individual. Automatically populated by UUID or genome.
 * @param {Date|String|Number} [individual.timestamp=new Date()] - A timestamp of when this individual was created.
 * @param {Phenotype|Object} [individual.phenotype] - An object containing functions.
 * @param {Genome|Array} [individual.genome=new Genome()] - An array containing genes.
 * @param {Epigenome|Array} [individual.epigenome] - An array containing strings specifying phenotype functions and corresponding to gene positions.
 * @param {Array} [individual.parents] - An array of parent individual identifiiers.
 * @param {String} [individual.generation] - An optional string specifying the generation in which this individual was created.
 * @param {String} [individual.population] - An optional string specifying the population in which this individual was created.
 *
 * @returns {Individual} Returns the new Individual.
 *
 * @example
 *
// Individuals don't have to have any attributes, but that makes them pretty boring.
new Individual()

// Individuals that are only given a phenotype give themselves a genome and epigenome.
new Individual({
  phenotype: {
    color: (r, g, b) => `rgb(${[r, g, b].join(',')})`,
    animal: (g) => ["dog", "monkey", "cat"][Math.floor(g*3)],
    names: [
      (g) => ["Angie", "Martha", "John", "Jerry"][Math.floor(g*4)],
      (g) => ["Brown", "Austen", "Hook", "Perry"][Math.floor(g*4)],
    ]
  },
  // genome: new Genome(6),
  // epigenome: ["color", "color", "color", "animal", "names.0", "names.1"]
})
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

  // It looks like a Phenotype runner could be its own object or factory.
  _phenotype_array(arr, array_index = 0) {
    // Return corresponding array value and increment counter.
    let gene = this.genome[array_index];
    if (gene < 1) return arr[Math.floor(arr.length * gene)];
    else return arr[arr.length - 1];
  }
  _phenotype_function(func, array_total = this._phenotype_number_of_arrays) {
    // Call function with Genome. Supply when array genes stop.
    let ret = func(this.genome, array_total);
    return ret;
  }
  _phenotype_object(obj, array_index = 0) {
    var ret = {};
    for (let key in obj) {
      ret[key] = this._phenotype_node(obj[key], array_index);
      if (Array.isArray(obj[key])) {
        array_index += 1;
      }
    }
    return ret;
  }
  _phenotype_node(value, array_index) {
    if (Array.isArray(value)) {
      return this._phenotype_array(value, array_index);
    } else if (value instanceof Function) {
      return this._phenotype_function(value, array_index);
    } else if (value instanceof Object) {
      return this._phenotype_object(value);
    } else {
      return value;
    }
  }
  _phenotype() {
    return this._phenotype_node(this._phenotype_manifest, 0);
  }
  // Standard phenotype is just Genome.
  _phenotype_manifest(o) {
    return o;
  }
  _phenotype_count_arrays(value, arrays = 0) {
    if (Array.isArray(value)) {
      return 1;
    } else if (value instanceof Object) {
      for (let key in value) {
        arrays += this._phenotype_count_arrays(value[key]);
      }
      return arrays;
    }
    return 0;
  }

  /**
   * Enforce compatibility with established phenotype.
   *
   * @memberof Individual
   */
  set phenotype(phenotype) {
    let arrays = this._phenotype_count_arrays(phenotype);
    // Create genome minimum for arrays.
    if (this.genome.size < arrays) {
      this.genome.size = arrays;
    }
    this._phenotype_manifest = phenotype;
  }

  /**
   * Return the established phenotype.
   *
   * @readonly
   * @memberof Individual
   */
  get phenotype() {
    return this._phenotype_manifest;
  }

  /* Setup Individual using configuration object */
  // private variables

  /**
   * Return the decoded genome.
   *
   * @readonly
   * @memberof Individual
   *
   * @example
   *
// Given an individual of this shape.

new Individual(
  genome: [0.1, 0.5, 0.4, 0.9, 0.6, 0.24],
  epigenome: ["color", "color", "color", "animal", "names.0", "names.1"],
  phenotype: {
    color: (r, g, b) => `rgb(${[r, g, b].join(',')})`,
    animal: (g) => ["dog", "monkey", "cat"][Math.floor(g*3)],
    names: [
      (g) => ["Angie", "Martha", "John", "Jerry"][Math.floor(g*4)],
      (g) => ["Brown", "Austen", "Hook", "Perry"][Math.floor(g*4)],
    ]
  }
)

// The traits are the decoded output.

individual.traits

{
  color: "rgb(0.1, 0.5, 0.4)",
  // color: `rgb(${[0.1, 0.5, 0.4].join(',')})`,
  animal: "cat",
  // animal: ["dog", "monkey", "cat"][2],
  names: ["John", "Brown"]
  // names: [
  //   ["Angie", "Martha", "John", "Jerry"][2],
  //   ["Brown", "Austen", "Hook", "Perry"][0]
  // ]
}
   *
   */
  get traits() {
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
   * @returns Individual
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
   * @returns Individual - A new child Individual using genes from this Individual and mates.
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

// How are genes expressed?
// i.e. What genes are passed to what functions, and in what order?
export class Epigenome extends Array {
  constructor(epigenome) {
    super(...epigenome);
  }

  mutate() {}

  crossover() {}
}
