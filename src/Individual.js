// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created December 5th, 2014

import Genome from './Genome';

export class Individual{

  constructor (individualJSON){
    var individualArray = JSON.parse(individualJSON);
    var genomeArray = individualArray['genome'];
    var genomeJSON = JSON.stringify(genomeArray);
    var fitnessArray = individualArray['fitness'];
    var fittestGenomeJSON = JSON.stringify(fitnessArray['fittestGenome']);
    var mutationArray = individualArray['mutation'];

    // public variables
    this.genome = new Genome(genomeJSON);
    this.fittestGenome = new Genome(fittestGenomeJSON);
    this.mutationRate = mutationArray['rate'];
    this.fitness = 0;
    /* Initialization */
    this.evaluate();

  }
  /* Setup Individual using configuration object */
  // private variables

  get JSON() {
    var individual = new Object();
    individual['Genome'] = this.genome.genes;
    individual['fitness'] = new Object();
    individual['fitness']['value'] = this.fitness;
    individual['mutation'] = new Object();
    individual['mutation']['rate'] = this.mutationRate;
    return JSON.stringify(individual, null, '\t');
  }

  /* Genetic operators */
  evaluate(){
    this.fitness = this.genome.howSimilar(this.fittestGenome);
  }

  mutate(){
    this.genome.mutate(this.mutationRate);
    this.evaluate();
  }

  crossover(mate){
    var Child = new Individual(individualJSON);
    Child.genome = this.genome.crossover(mate.genome);
    Child.evaluate();
    return Child;
  }

  /* Helpers */
  print(){
    console.log(this.JSON);
  }

}

