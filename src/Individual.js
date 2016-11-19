// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created December 5th, 2014

import { Genome } from './Genome';
import uuid from 'node-uuid';
let { v4: getIdentifier } = uuid;

export class Individual {

  constructor (options = {}) {
    let phenotype;
    ({
      genome: this.genome = new Genome(1),
      parents: this.parents,
      // generation: this.generation
      // population: this.population
      timestamp: this.timestamp = new Date(),
      identifier: this.identifier = `i-${getIdentifier()}`,
      phenotype,
    } = options);

    if (!this.genome instanceof Genome) {
      this.genome = new Genome(this.genome);
    }
    if (!this.timestamp instanceof Date) {
      this.timestamp = new Date(this.timestamp);
    }
    if (phenotype !== undefined) {
      this.phenotype = phenotype;
    }
  }

  // It looks like a Phenotype runner could be its own object or factory.
  _phenotype_array(arr, array_index=0) {
    // Return corresponding array value and increment counter.
    return arr[Math.floor(arr.length * this.genome[array_index])];
  }
  _phenotype_function(func, array_total = this._phenotype_number_of_arrays) {
    // Call function with Genome. Supply when array genes stop.
    let ret = func(this.genome, array_total);
    return ret;
  }
  _phenotype_object(obj, array_index=0) {
    var ret = {};
    for (let key in obj) {
      ret[key] = this._phenotype_node(obj[key], array_index);
      if (Array.isArray(obj[key])) { array_index += 1; }
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
  _phenotype() {return this._phenotype_node(this._phenotype_manifest, 0);}
  // Standard phenotype is just Genome.
  _phenotype_manifest(o) {return o;}
  _phenotype_count_arrays (value, arrays = 0) {
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

  set phenotype (phenotype) {
    let arrays = this._phenotype_count_arrays(phenotype);
    // Create genome minimum for arrays.
    if (this.genome.size < arrays) {
      this.genome.size = arrays;
    }
    this._phenotype_manifest = phenotype;
  }

  get phenotype() {
    return this._phenotype_manifest;
  }

  /* Setup Individual using configuration object */
  // private variables

  get traits() {
    let traits = this._phenotype();
    return traits;
  }

  evaluate(func) {
    return func(this.traits);
  }

  /* Genetic operators */

  mutate() {
    this.genome.mutate(this.traits.mutate);
    return this;
  }

  crossover(...mates) {
    var childGenome = this.genome.crossover(this.traits.crossover, ...mates.map(i=>i.genome));
    // How do we decide the new generation? This might need to be called again, higher up.
    return new Individual({
      genome: childGenome,
      phenotype: this.phenotype,
      parents: mates.reduce((parents, mate) => {
        parents.push(mate.identifier);
        return parents;
      }, [this.identifier]),
    });
  }

}

