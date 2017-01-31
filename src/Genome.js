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

  // Override this for different gene types.
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

  // Select genes at a certain rate.
  selection(rate) {
    return this.reduce((selection, gene, i) => {
      if (Math.random() <= rate) { selection.push(i); }
      return selection;
    }, []);
  }
  /* Genetic operators */
  _deletion(rate) {
    let selection = this.selection(rate);
    // Group consecutive selections.
    selection.reverse().forEach((selected) => {
      this.splice(selected, 1);
    });
  }
  // Repeat, in place, contiguous selected
  _duplication(rate) {
    let selection = this.selection(rate),
      groupedSelection = selection.reduce((groups, selected) => {
        let currentGroup = groups[groups.length - 1];
        if ( currentGroup[currentGroup.length - 1] === (selected - 1) ) {
          currentGroup.push(selected);
        } else {
          groups.push([selected]);
        }
        return groups;
      }, [[]]);
    groupedSelection.reverse().forEach((group) => {
      this.splice(group[0], 0, ...group.map((i) => this[i]));
    });
  }
  _inversion(rate) {
    let selection = this.selection(rate),
      groupedSelection = selection.reduce((groups, selected) => {
        let currentGroup = groups[groups.length - 1];
        if ( currentGroup[currentGroup.length - 1] === (selected - 1) ) {
          currentGroup.push(selected);
        } else {
          if (currentGroup.length === 1) {
            currentGroup[0] = selected;
          } else {
            groups.push([selected]);
          }
        }
        return groups;
      }, [[]]);
    groupedSelection.forEach((group) => {
      this.splice(group[0], group.length, ...group.reverse().map((i) => this[i]));
    });
  }
  _substitution(rate) {
    let selection = this.selection(rate);
    selection.forEach((selected) => {
      this.toRandom(selected);
    });
  }
  _increment(index, increment) {
    if (this[index] <= 0) this[index] += increment;
    else if (this[index] >= 1) this[index] -= increment;
    else {
      this[index] = (Math.random() > 0.5)?
        this[index]+increment:
        this[index]-increment;
    }
    if (this[index] < 0) this[index] = 0;
    if (this[index] > 1) this[index] = 1;
  }
  _incrementation(rate, increment) {
    let selection = this.selection(rate);
    selection.forEach((selected) => {
      this._increment(selected, increment);
    });
  }
  // Smooth mutations.
  mutate(options) {
    let {
      deletion = 0,
      duplication = 0,
      inversion = 0,
      incrementation = 0,
      increment = 0,
      substitution = 0.0,
      modify = true,
      upper = Infinity,
      lower = 1
    } = options || {};
    let genome = (modify)? this: this.copy();
    // Chance to duplicate something.
    // Duplication limitations.
    genome._duplication(duplication);
    // Chance to inverse a section.
    // Inverse limitations.
    genome._inversion(inversion);
    // Chance for substitution.
    // Substitution limitations.
    genome._substitution(substitution);
    // Chance for deletion.
    // Deletion limitations.
    genome._deletion(deletion);
    // Chance for incrementation.
    // Amount to increment.
    genome._incrementation(incrementation, increment);
    // Truncate the genome to the max size.
    if (Number.isFinite(upper) && genome.size > upper) {
      genome.size = upper;
    }
    // Increase the genome to the minimum size.
    if (Number.isFinite(lower) && genome.size < lower) {
      genome.size = lower;
    }
    return genome;
  } // end mutate

  // Random chance any particular gene is from either parent.
  // Splice, Pivot Splice
  // Genes retain position or not.
  // Splice or average splice.
  // Crossover is sectional or uniform.
  crossover(options, ...mates) {
    let {
      crossover = (1 - (1 / mates.length)),
      modify = false,
      average = false
    } = options;
    let child = (modify)? this: this.slice();
    // Retrieve a selection of gene indexes that will be changed.
    let selection = child.selection(crossover);
    // Set that gene equally from all parents.
    selection.forEach((selected) => {
      let geneMate = mates[Math.floor(Math.random() * mates.length)];
      // If mate doesn't contain gene length, abort.
      let cross = (geneMate.length > selected) ? geneMate[selected]: child[selected];
      if (average) {
        child.spliceAverage(selected, 1, cross, 0.5);
      } else {
        child.splice(selected, 1, cross);
      }
    });
    return child;
  } // end crossover

  spliceAverage(start=0, extend=this.length, splice, weight = 1) {
    for (let i=0; i < extend &&
      start + i < this.length &&
        start + i < splice.length; i++) {
          this[start + i] = (this[start + i] * weight + splice[start + i] / weight) / (2 + weight);
        }
  }

  /* Helper Methods */
  copy() {
    return this.slice();
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

