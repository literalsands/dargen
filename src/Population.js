import { Generation } from './Generation';
import { Individual } from './Individual';
import uuid from 'node-uuid';
let { v4: getIdentifier } = uuid;

/**
 * Holds information about an entire population of individuals.
 *
 * Takes prototype individual and creates a population with the same phenotype and options.
 *
 * @exports Phenotype
 * @param {Population|Object} population - Population parameters.
 * @param {String} [population.identifier=`p-${getIdentifier()}`] - A unique string for the population. Automatically populated by UUID.
 * @param {Date|String|Number} [population.timestamp=new Date()] - A timestamp of when this individual was created.
 * @param {Phenotype|Object} [population.phenotype] - An object containing functions.
 * @param {Individual[]|Object[]} [population.individuals] - An array of Individuals in the population.
 * @class Population
 */
export class Population {

  constructor(population) {
    ({
      phenotype: this.phenotype,
      size: this.size,
      individuals: this.individuals = [],
      identifier: this.identifier = `p-${getIdentifier()}`
    } = population);
    /* Setup Population using configuration object */
    // public variables
    // e.g. the top ten percent of the entire population will mate with the top 90 percent
    // of the current child generation to create the next child generation.
    while (this.individuals.length < this.size) {
      this.individuals.push(new Individual({
        phenotype: this.phenotype
      }));
    }
  }

  /**
   * Deeply copy the population.
   *
   * @returns Population - Frozen, deep copy of current population.
   * @memberof Population
   */
  fossilize() {
  }

  /**
   * Create next generation.
   * If iterations are false or zero then it defaults to the amount of iterations in the config file.
   *
   * @param {any} [options={fitness:(()=>0)}] - Options for evolution.
   * @param {number} [iterations=1] - Number of Generations to create.
   * @returns Population
   * @memberof Population
   */
  evolve(options = {fitness:(()=>0)}, iterations=1) {
    let generation = new Generation(options, this);
    for (let i = 0; i < iterations; i++) {
      this.individuals = generation.next();
    }
    return this;
  }

  // Find a specific type of individual.
  // Get stats on the population, centering around whether we have converged or not.
  /**
   * Stub function that could return some interesting statistics on the current population of individuals.
   *
   * @returns Object
   * @memberof Population
   */
  stats() {
    // Spread for genes.
    // Spread for traits.
  }
}

