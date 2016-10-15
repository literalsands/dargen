(function() {
  "use strict";
  // GENETIC EXPERIENCE MANAGEMENT
  // by Paul Prae
  // First created December 5th, 2014
  // TODO: Unit Test thoroughly
  // TODO: Traits should probably be there own class
  // TODO: Learn how to override methods properly

  // PROPERTIES
  // TODO: Configuration file
  var defaultPossibleTraits = new Array( "red", "blue", "yellow", "green", "turquoise", "purple", "orange", "brown", "black", "white");
  var defaultDesiredTraits = new Array("turquoise", "purple");
  var defaultNumberOfTraits = 3;
  var defaultChanceOfMutation = 0.05;

  class Individual {

    constructor(numberOfTraits = defaultNumberOfTraits,
      possibleTraits = defaultPossibleTraits,
      desiredTraits = defaultDesiredTraits) {
      this.numberOfTraits = numberOfTraits;
      this.possibleTraits = possibleTraits;
      this.desiredTraits = desiredTraits;
      this.traits = this.newTraits();
      this.fitness = 0;
      this.evaluate();
    }


    newTraits() {

      var traits = [];
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      for (let i = 0; i < this.numberOfTraits; i++) {
        let randomInt = getRandomInt(0, this.possibleTraits.length - 1);
        traits.push(this.possibleTraits[randomInt]);
      }

      return traits;

    }

    // TODO: Something is redundant or this needs to be multiple methods
    evaluate(desiredTraits = defaultDesiredTraits) {
      this.fitness = this.countDesiredTraits();
      return this.fitness;
    }



    // GENETIC OPERATIONS
    mutate(chance = defaultChanceOfMutation) {

      for (let i = 0; i < this.numberOfTraits; i++) {
        if(Math.random() <= chance){
          this.traits[i] = this.getRandomTrait();
        }
      }

      this.evaluate();

      return this;

    }

    // HELPERS
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomTrait() {
      var randomInt = this.getRandomInt(0, this.possibleTraits.length - 1);
      return this.possibleTraits[randomInt];
    }

    hasTrait(trait){
      return this.traits.indexOf(trait) !== -1;
    }

    hasTraits(traits){

      for (let i = 0; i < traits.length; i++) {
        if (this.hasTrait(traits[i])){
          return true;
        }
      }
      return false;

    }

    countDesiredTraits(desiredTraits = defaultDesiredTraits) {

      var count = 0;

      for (let i = 0; i < this.traits.length; i++) {
        for (let j = 0; j < desiredTraits.length; j++) {
          if (this.traits[i] == desiredTraits[j]){
            count++;
          }
        }
      }
      return count;

    }

    // PRINTS
    prettyPrint() {
      console.log("Traits" + this.traitsToString());
      console.log("Fitness" + this.fitness);
    }

    traitsToString() {
      return this.traits.join(' ');
    }

  }

  module.exports = Individual;
})();
