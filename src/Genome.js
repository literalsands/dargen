// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created Janurary 3rd, 2015

import { getRandomInt } from './helpers';

export class Genome extends Array {

  constructor(genes) {
    if (Number.isSafeInteger(genes) && genes > 0) {
      super();
      this.size = genes;
    } else if (Array.isArray(genes)) {
      super(...genes);
    } else {
      super();
    }
  }

  getRandomGeneValue(){
    return Math.random();
  }

  get size() {
    return this.length;
  }

  set size(length) {
    let start = this.length;
    this.length = length;
    if (start < length) {
      this.fillRandom(start, length - 1);
    }
  }

  toRandom(index) {
    this[index] = this.getRandomGeneValue();
    return this;
  }

  fillRandom(start = 0, stop = this.length - 1) {
    for (let i = start; i < stop + 1; i++) {
      this.toRandom(i);
    }
    return this;
  }

  /* Genetic operators */
  // Method (Move, New), Rate, Copy
  mutate({rate = 0.05, modify = true }) {
    if (modify) {
      var genome = this;
    } else {
      var genome = this.copy();
    }
    for (var i = 0; i < this.length; i++) {
      if(Math.random() <= rate) {
        genome.toRandom(i);
      } // end if
    } // end for
    return genome;
  } // end mutate

  // Random chance any particular gene is from either parent.
  // Mate, Method (Mix, Pivot), Copy
  // This might be better on a population level.
  crossover(mate) {
    var child = this.slice();
    // Duplicate this parent. Assuming the same species i.e. from the same config.
    for (var i = 0; i < mate.length; i++){
      if(Math.random() <= 0.5) {
        child[i] = mate[i];
      }
    }
    return child;
  } // end crossover

  /* Helper Methods */
  copy() {
    return new Genome(super.slice());
  }

  isEqual(genome){
    if (this.length !== genome.length) {
      return false;
    }
    return this.every((value, index) => genome[index] === value);
  } // end isEqual

  // returns the percentage of genes that are the same
  howSimilar(genomeToCompare){
    var geneMatchCount = 0;
    var namesToMatch = genomeToCompare.names;
    var genesToMatch = genomeToCompare.genes;
    for (var i = 0; i < genomeToCompare.length; i++){
      var nameToMatch = namesToMatch[i];
      var valueToMatch = genesToMatch[nameToMatch];
      if(this.hasGene(nameToMatch, valueToMatch)){
        geneMatchCount++;
      } // end if hasGene
    } // end for
    return geneMatchCount / this.length;
  } // end howSimilar

} // end Genome

