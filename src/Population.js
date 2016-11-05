// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created December 5th, 2014

import { Generation } from './Generation';
import uuid from 'node-uuid';
let { v4: getIdentifier } = uuid;

// Holds information about an entire population of individuals.
export class Population {

  constructor(options) {
    ({
      phenotype: this.phenotype,
      size: this.size,
      individuals: this.individuals,
      identifier: this.identifier = `p-${getIdentifier()}`
    } = options);
    /* Setup Population using configuration object */
    // public variables
    // e.g. the top ten percent of the entire population will mate with the top 90 percent
    // of the current child generation to create the next child generation.
  }

  // Deeply copy the population.
  fossilize() {
  }

  /* Genetic Operators */
  // If iterations are false or zero then it defaults to the amount of iterations in the config file.
  evolve(options, iterations) {
    generation = new Generation(options, this);
    for (let i = 0; i < iterations; i++) {
      generation.next();
    }
    return this;
  }

  // Find a specific type of individual.
  // Get stats on the population, centering around whether we have converged or not.
  stats() {
    // Spread for genes.
    // Spread for traits.
  }
}

