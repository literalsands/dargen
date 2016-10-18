(function() {
  "use strict";
  // GENETIC EXPERIENCE MANAGEMENT
  // by Paul Prae
  // First created December 5th, 2014
  // TODO: Unit Test thoroughly
  // TODO: A Generation should probably be its own class
  // TODO: Learn how to override methods properly
  // TODO: Figure out how to set things up so there are methods that alter 'this' object's properties versus those of an object that is passed in.

  var Individual = require('./Individual');
  var defaultPossibleTraits = ["red", "blue", "yellow", "green", "turquoise", "purple", "orange", "brown", "black", "white"];
  var defaultDesiredTraits = ["turquoise", "purple"];
  var defaultNumberOfIndividuals = 12;
  var defaultNumberOfTraits = 12;
  var defaultChanceOfMutation = 0.09;

  class Population {
    constructor(numberOfIndividuals = defaultNumberOfIndividuals,
      numberOfTraits = defaultNumberOfTraits,
      possibleTraits = defaultPossibleTraits,
      desiredTraits = defaultDesiredTraits) {
      // PROPERTIES
      this.numberOfIndividuals = numberOfIndividuals;
      this.numberOfTraits = numberOfTraits;
      this.possibleTraits = possibleTraits;
      this.desiredTraits = desiredTraits;
      this.lastGeneration = [];
      this.currentGeneration = this.newGeneration();
    }

    newGeneration(numberOfIndividuals = defaultNumberOfIndividuals,
      numberOfTraits = defaultNumberOfTraits,
      possibleTraits = defaultPossibleTraits) {

      var generation = [];

      for (var i = 0; i < this.numberOfIndividuals; i++) {
        var individual = new Individual(this.numberOfTraits, this.possibleTraits);
        generation.push(individual);
      }

      return generation;

    }

    // GENETIC OPERATORS
    //TODO: test more
    // TODO: make work right
    evolve(desiredTraits = this.desiredTraits, generation = this.currentGeneration) {

      this.lastGeneration = this.currentGeneration;
      var mostFitParent = this.findAMostFitIndividual(generation);
      var selection = this.selectFitMembers(generation.length, generation);
      var nextGeneration = [];
      var indexOfUnfitChild = null;

      nextGeneration = this.crossoverGeneration(selection);
      nextGeneration = this.mutateGeneration(defaultChanceOfMutation, nextGeneration);

      indexOfUnfitChild = this.findIndexOfALeastFitIndividual(nextGeneration);
      nextGeneration[indexOfUnfitChild] = mostFitParent;
      this.currentGeneration = nextGeneration;

      return nextGeneration;

    }

    evolveFromSelection(selection) {
      this.lastGeneration = this.currentGeneration;
      this.currentGeneration = this.mutateGeneration(defaultChanceOfMutation, this.crossoverGenerationWithIndividual(selection));
      return this;
    }

    evaluate(desiredTraits = this.desiredTraits, generation = this.currentGeneration) {


      for (var i = 0; i < generation.length; i++) {
        generation[i].evaluate(desiredTraits);
      }

      return generation;

    }

    averageFitness(generation = this.currentGeneration){

      var totalFitness = 0;

      for (var i = 0; i < generation.length; i++) {
        totalFitness += generation[i].fitness;
      }

      return (totalFitness / generation.length);

    }

    // TODO: Always make sure previous fittest individuals survive.
    // TODO: When choosing random individuals, always choose fittest members.
    selectFitMembers(numberOfIndividuals = defaultNumberOfIndividuals,
      generation = this.currentGeneration){

      var fitIndividuals = this.allFitIndividuals(generation);
      var selection = [];
      for (var i = 0; i < numberOfIndividuals; i++) {

        if(i < fitIndividuals.length){
          selection.push(fitIndividuals[i]);
        } else {
          selection.push(this.findRandomFitIndividual(fitIndividuals));
        }

      };

      return selection;

    }

    mutateGeneration(chance = defaultChanceOfMutation, generation = this.currentGeneration){


      for (var i = 0; i < generation.length; i++) {
        generation[i].mutate();
      }

      return generation;

    }

    crossoverGeneration(generation = this.currentGeneration, crossoverPoint){

      crossoverPoint = typeof crossoverPoint !== 'undefined' ? crossoverPoint : Math.floor(generation[0].traits.length / 2);
      var nextGeneration = [];

      for (var i = 0; i < generation.length; i++) {
        nextGeneration.push(this.crossover(generation[i]));
      }

      return nextGeneration;

    }

    crossoverGenerationWithIndividual(mate) {
      return this.currentGeneration.map((individual) => this.crossover(individual, mate));
    }

    // TODO: Do a real crossover and prouce two children
    crossover(individual,
      mate = this.findRandomFitOrFitterIndividual(),
      crossoverPoint,
      generation = this.currentGeneration){

      // this default mate selection will drive fitness up. yay! except watch for local maximums.
      crossoverPoint = typeof crossoverPoint !== 'undefined' ? crossoverPoint : Math.floor(individual.traits.length / 2);

      var child = new Individual();

      if (Math.random() > 0.5) {
        var hold = individual;
        individual = mate;
        mate = hold;
      }

      for (var i = 0; i < child.traits.length; i++) {
        if(i < crossoverPoint){
          child.traits[i] = individual.traits[i];
        } else {
          child.traits[i] = mate.traits[i];
        }
      }

      child.evaluate();

      return child;
    }

    findAMostFitIndividual(generation = this.currentGeneration){

      var fittest = new Individual();

      for (var i = 0; i < generation.length; i++) {
        if(generation[i].fitness >= fittest.fitness){
          fittest = generation[i];
        }
      }

      return fittest;

    }

    findALeastFitIndividual(generation = this.currentGeneration){

      var leastFit = new Individual();
      var leastFitIndex = 0;

      for (var i = 0; i < generation.length; i++) {
        if(generation[i].fitness <= leastFit.fitness){
          leastFit = generation[i];
          leastFitIndex = i;
        }
      }

      return leastFit;

    }

    findIndexOfALeastFitIndividual(generation = this.currentGeneration){

      var leastFit = new Individual();
      var leastFitIndex = 0;

      for (var i = 0; i < generation.length; i++) {
        if(generation[i].fitness <= leastFit.fitness){
          leastFit = generation[i];
          leastFitIndex = i;
        }
      }

      return leastFitIndex;

    }

    findRandomFitOrFitterIndividual(fitness = 1, generation = this.currentGeneration){

      var fitOrFitterIndividuals = this.allFitIndividuals(generation, fitness);

      if (fitOrFitterIndividuals.length !== 0){
        var randomInt = this.getRandomInt(0, fitOrFitterIndividuals.length - 1);
        return fitOrFitterIndividuals[randomInt];
      }
      return null;

    }

    findRandomFitIndividual(generation = this.currentGeneration){

      var fitIndividuals = this.allFitIndividuals(generation);

      if (fitIndividuals.length > 0){
        var randomInt = this.getRandomInt(0, fitIndividuals.length - 1);
        return fitIndividuals[randomInt];
      }

      return null;

    }

    allFitIndividuals(generation = this.currentGeneration, fitness = 1) {

      var fitIndividuals = [];

      for (var i = 0; i < generation.length; i++) {
        if(generation[i].fitness >= fitness){
          fitIndividuals.push(generation[i]);
        }
      }

      return fitIndividuals;

    }

    // HELPERS
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // PRINTS
    prettyPrintGeneration(generation = this.currentGeneration) {
      for (var i = 0; i < generation.length; i++) {
        console.log('(' + i + ')');
        generation[i].prettyPrint();
      }
    }

  }

  module.exports = Population;
})();
