// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created Janurary 3rd, 2015

import Individual from './Individual';
import getRandomInt from './helpers';
import uuid from 'node-uuid';
let { v4: getIdentifier } = uuid;

// Holds a population or individuals at a certain iteration.
export class Generation {

  constructor(options, ...populations) {
    ({
      // Save this generation's population as a copy.
      selection: this.selection = this._selection,
      removal: this.removal = this._removal,

      // Fitness function must be defined by the user.
      fitness: this.fitness,
      comparison: this.comparison = this._comparision,

      population: this.population,
      identifier: this.identifier = `g-${getIdentifier()}`
    } = options);
    if (popluations.length) {
      // Make a temporary population to evolve multiple populations with.
      this.population = new Population({
        individuals: populations.reduce(((is, p) => is.concat(p.individuals), []))
      });
    }
  }

  _generation() {
    let groups = this._groups().map(this._tournament);
    let elite = groups.map(this._selection());
    // Should the groups and ranks be saved somewhere?
    let childGroups = elite.map(
      (leet, i) => groups.map(
        individual => crossover(...leet)));
    let childIndividuals = childGroups.reduce(
      (individuals, group => individuals.concat(group)), []
    );
    // Mutated Offspring of Non-elite and Elite.
    return childIndividuals.map(individual => individual.mutate());
  }

  // Given an ordered group, choose which individuals will mate with the rest of the group.
  _selection(group) {
    // Return only the top performing member.
    return [group[0]];
  }

  // Given the current population, determine which will be saved for the next generation.
  _removal(population) {
    // Save none of the past generation of individuals.
    return [];
  }

  _chooseAndSplice(array) {
    // Get index of choice.
    let choice = Math.floor(Math.random() * array.length);
    // Save choice element reference.
    let choiceElement = array[choice];
    // Remove choice element from array.
    array.splice(choice, 1);
    // Return choice element.
    return choiceElement;
  }
  _groups(size=5) {
    // Create groups. Make a shallow copy of individuals.
    let groups = [], individuals = this.individuals.slice();
    groups.length = Math.ciel(individuals.length / size) / individuals.length;
    for (var i=0; individuals.length > 0; i++) {
      // Choose one from group, and remove from individuals.
      let individual = this._chooseAndSplice(individuals);
      // Put individual into new group.
      groups[i%size].push(individual);
    }
  }

  // Sort individuals based on evaluation function.
  _tournament(group) {
    let outcomes = group.map((individual, index) => ({
      index: index,
      value: this.fitness(individual, group)
    }));
    // Sort outcomes that may be multidimensional.
    outcomes.sort(this.comparison);
    return outcomes.map(outcome => group[outcome.index]);
  }

  _comparison({value: a}, {value: b}) {
    if (Array.isArray(a) && Array.isArray(b)) {
      // A comes before B if A dominates B.
      if (a.every((v, i) => (v > b[i]))) {
        return -1;
      // B comes before A if A is dominated by B.
      } else if (b.every((v, i) => (v > a[i]))) {
        return 1;
      }
      return 0;
    }
    return a - b;
  }

  // TODO Use an internal iterable object to apply these generational rules again.
  next() {
    this.individuals = this._generation().concat(this.removal(this.individuals));
    return this.individuals;
  }

}
