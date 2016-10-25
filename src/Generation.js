// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created Janurary 3rd, 2015

import Individual from './Individual';
import getRandomInt from './helpers';

export class Generation {

  constructor(generationJSON) {
    /* Setup Generation using configuration object */
    // private variables
    var generationArray = JSON.parse(generationJSON);
    var individualArray = generationArray['individual'];
    var individualJSON = JSON.stringify(individualArray);

    // public variables
    this.numberOfIndividuals = generationArray['numberOfIndividuals'];
    this.individuals = new Array();

  }
  /* Methods for initialization */
  createIndividuals(amount) {
    if (!amount) amount = this.numberOfIndividuals;
    if (amount < 1) amount = 1;
    for (var i = 0; i < amount; i++) {
      this.individuals.push(new Individual(individualJSON));
    }
  }

  /* The state of the generation */
  get averageFitness() {
    var totalFitness = 0;
    for (var i = 0; i < this.individuals.length; i++) {
      totalFitness += this.individuals[i].fitness;
    }
    return totalFitness / this.individuals.length;
  }

  // Returns the most fit individuals as an array
  findFittest(amount){
    this.sort();
    return this.individuals.reverse().slice(0, amount);
  }
  // Returns the top X% of the most fit individuals as an array
  // Takes in the ratio percentage (e.g. 0.9 for 90 percent)
  findTopPercent(decimal) {
    var fittestAmount = Math.ceil(decimal * this.numberOfIndividuals);
    return this.findFittest(fittestAmount);
  }

  findWeakest(amount) {
    this.sort();
    return this.individuals.slice(0, amount);
  }

  /* Genetic Operators */
  mutate(){
    for (var i = 0; i < this.individuals.length; i++) {
      this.individuals[i].mutate();
    }
  }

  // Given some percentage (in decimal form) of fittest individuals from this generation and some other fit individuals, create a new generation.
  mate(decimalFittest, otherFitIndividuals) {
    // Join the fittest individuals with any others from outside this generation that are chosen to mate.
    var matingPool = this.findTopPercent(decimalFittest).concat(otherFitIndividuals);
    var children = new Array();
    if (matingPool.length > 1) {
      // do it
      for (var session = 0; session < this.numberOfIndividuals; session++) {
        var partnerA = getRandomInt(0, matingPool.length - 1);
        var partnerB;
        // get a random individual to mate with but make sure it is not the current individual.
        do {
          partnerB = getRandomInt(0, matingPool.length - 1);
        } while (partnerA == partnerB)
        var child = matingPool[partnerA].crossover(matingPool[partnerB]);
        children.push(child);
      } // done it
    } else {
      children = matingPool;
    }
    var childGeneration = new Generation(generationJSON);
    childGeneration.individuals = children;
    return childGeneration;
  }

  /* Helpers */
  // Sort by fitness
  sort() {
    this.individuals.sort(this.compareFitness);
  }

  compareFitness(individual1, individual2) {
    return individual1.fitness - individual2.fitness;
  }

  // Prints
  print(sort) {
    if (sort) this.sort();
    this.printIndividuals();
  }

  printIndividuals(individuals) {
    if (!individuals) individuals = this.individuals;
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

  printWeakest(amount) {
    this.printIndividuals(this.findWeakest(amount));
  }

}
