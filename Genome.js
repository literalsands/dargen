(function() {
  "use strict";
  class Genome {
    /* Setup Genome using configuration object */
    constructor(potentialGenes) {
      this.potentialGenes = JSON.parse(potentialGenes);
      this.names = Object.keys(potentialGenes);
      this.count = Object.keys(potentialGenes).length;
      this.genes = [];
      // Initialize Genes
      this.setRandomGenes();
    }

    /* Methods for initialization */

    // NOTE: This distribution may not be completely random.
    getRandomGene(name){

      var values = this.potentialGenes[name];
      return values[Math.floor(Math.random()*values.length)];

    }

    setRandomGene(name){

      this.genes[name] = this.getRandomGene(name);

    }

    setRandomGenes(){

      for (var i = 0; i < this.count; i++){

        this.setRandomGene(this.names[i]);

      }

    }


    /* More Getters and Setters */

    getGenes(){
      return this.genes;
    }

    getNames(){
      return this.names;
    }

    getCount(){
      return this.count;
    }

    /* Genetic operators */

    mutate(chance){

      for (var i = 0; i < this.count; i++){

        if(Math.random() <= chance){
          var name = this.names[i];
          this.setRandomGene(name);
        }

      }

    }

    /* Helper Methods */

    hasGene(nameToMatch, valueToMatch){

      if(this.names.indexOf(nameToMatch) > -1){

        if(valueToMatch == this.genes[nameToMatch]){
          return true;
        }

      }
      return false;

    }

    isEqual(genomeToMatch){
      var namesToMatch = genomeToMatch.getNames();
      var genesToMatch = genomeToMatch.getGenes();
      for (var i = 0; i < genomeToMatch.getCount(); i++){
        var nameToMatch = namesToMatch[i];
        var valueToMatch = genesToMatch[nameToMatch];
        if(!this.hasGene(nameToMatch, valueToMatch)){
          return false;
        }
      }
      return true;
    }


    // Prints
    printGenome(){

      genes = this.genes;
      Object.keys(genes).forEach(function (key) {
        console.log(key + ": " + genes[key]);
      });

    }

  }

  module.exports = Genome;
})();
