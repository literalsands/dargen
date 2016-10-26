// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created December 5th, 2014

import { Generation } from './Generation';

export class Population {

  constructor(populationJSON) {
    /* Setup Population using configuration object */
    // private variables
    var populationArray = JSON.parse(populationJSON);
    var generationArray = populationArray['generation'];
    var generationJSON = JSON.stringify(generationArray);

    // public variables
    this.numberOfGenerations = populationArray['numberOfGenerations'];
    this.parentGeneration = new Generation(generationJSON);
    this.childGeneration;

    /* Initialization */
    this.createPopulation();
  }

  /* Methods for initialization */
  createPopulation() {
    var topPercent = 0.10;
    this.parentGeneration.createIndividuals();
    var fittest = this.parentGeneration.findTopPercent(topPercent);
    // e.g. the top ten percent of the entire population will mate with the top 90 percent
    // of the current child generation to create the next child generation.
    this.childGeneration = this.parentGeneration.mate(1 - topPercent, fittest);
    this.childGeneration.mutate;
  }

  mate() {
    var topPercent = 0.10;
    var fittest = this.findTopPercent(topPercent);
    // The old parent generation is now forgotten (except the fittest members which were captured above).
    // The old children are now the new parents.
    this.parentGeneration = this.childGeneration;
    // e.g. the top ten percent of the entire population will mate with the top 90 percent
    // of the current child generation to create the next child generation.
    this.childGeneration = this.childGeneration.mate(1 - topPercent, fittest);
    this.childGeneration.mutate;
  }

  /* Genetic Operators */
  // If iterations are false or zero then it defaults to the amount of iterations in the config file.
  evolve(iterations) {
    if(!iterations) iterations = this.numberOfGenerations;
    for (var i = 0; i < iterations; i++) {
      this.mate();
    }
  }

  /* The state of the population */
  // Returns the most fit individuals in the population as an array
  findFittest(amount) {
    var bothGenerationsOfIndividuals = this.childGeneration.individuals.concat(this.parentGeneration.individuals);
    bothGenerationsOfIndividuals.sort(this.childGeneration.compareFitness);
    return bothGenerationsOfIndividuals.reverse().slice(0, amount);
  }

  // Returns the top X% of the most fit individuals in the population as an array
  // Takes in the ratio percentage (e.g. 0.9 for 90 percent)
  findTopPercent(decimal) {
    var fittestAmount = Math.ceil(decimal * (this.childGeneration.numberOfIndividuals + this.parentGeneration.numberOfIndividuals));
    return this.findFittest(fittestAmount);
  }

  /* Helpers */
  // Prints
  print() {
    this.printIndividuals();
  }

  printIndividuals(individuals) {
    for (var i = 0; i < individuals.length; i++) {
      individuals[i].print();
    }
  }

  printFittest(amount) {
    this.printIndividuals(this.findFittest(amount));
  }

  printTopPercent(decimal) {
    this.printIndividuals(this.findTopPercent(decimal));
  }

  // TODO: Print out a description of the current state of the population.
  stats() {

  }

}

