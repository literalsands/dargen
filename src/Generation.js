import { Population } from "./Population";
import { Individual } from "./Individual";
import getRandomInt from "./helpers";
import uuid from "uuid";
let { v4: getIdentifier } = uuid;

/**
 * Create a new Generation.
 *
 * Holds a population or individuals at a certain iteration or of a certain number of parents.
 *
 * @exports Generation
 * @classdesc A generational collection of inidividuals.
 * @class
 * @param {Generation|Object} generation - Generation options.
 * @param {Generation~fitness} generation.fitness - Generational fitness function.
 * @param {Generation~comparison} generation.comparison - Generational comparison function.
 * @param {...Population|Object} populations - Populations to incorporate in a generational selection and removal process.
 */
export class Generation {
  constructor(generation, ...populations) {
    ({
      // Save this generation's population as a copy.
      selection: this.selection = this._selection,
      removal: this.removal = this._removal,
      survival: this.survival = this._removal,

      // Fitness function must be defined by the user.
      fitness: this.fitness,
      comparison: this.comparison = this._comparision,

      // Strategies
      groups: this.groups = 5,
      elites: this.elites = 1,

      population: this.population,
      identifier: this.identifier = `g-${getIdentifier()}`
    } = generation);
    if (populations.length) {
      // Make a temporary population to evolve multiple populations with.
      this.population = new Population({
        individuals: populations.reduce((is, p) => is.concat(p.individuals), [])
      });
    }
  }
  /**
   * @typedef Generation~fitness
   * @type {Function}
   * @param {Individual} individual
   * @param {Individual[]} group
   * @returns {any|any[]} A value or array of values to be consumed by a comparison function.
   */
  /**
   * @typedef Generation~comparison
   * @type {Function}
   * @param {any} a
   * @param {any} b
   * @returns {number} If greater than zero, value a will be sorted before b.
   */

  _generation() {
    let groups = this._groups().map(this._tournament, this);
    // Tournament sorts a group.
    let elite = groups.map(this._selection, this);
    // Should the groups and ranks be saved somewhere?
    let childGroups = groups.map(this.removal, this).map((group, i) =>
      group.map(individual => individual.crossover(...elite[i]))
    );
    let childIndividuals = childGroups.reduce(
      (individuals, group) => individuals.concat(group),
      []
    );
    // Mutated Offspring of Non-elite and Elite.
    return childIndividuals.map(individual => individual.mutate());
  }

  // Given an ordered group, choose which individuals will mate with the rest of the group.
  _selection(group) {
    // Return only the top performing member.
    return group.slice(0, this.elites);
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
  _groups(size = this.groups) {
    // Create groups. Make a shallow copy of individuals.
    let groups = [],
      individuals = this.population.individuals.slice();
    groups.length = Math.ceil(individuals.length / size);
    for (let i = 0; individuals.length > 0; i++) {
      // Choose one from group, and remove from individuals.
      let individual = this._chooseAndSplice(individuals);
      // Put individual into new group.
      let j = Math.floor(i / size);
      if (!groups[j]) groups[j] = [];
      groups[j].push(individual);
    }
    return groups;
  }

  // Sort individuals based on evaluation function.
  _tournament(group) {
    let outcomes = group.map(
      (individual, index) => ({
        index: index,
        value: this.fitness(individual, group)
      }),
      this
    );
    // Sort outcomes that may be multidimensional.
    outcomes.sort(this.comparison);
    return outcomes.map(outcome => group[outcome.index]);
  }

  _comparison({ value: a }, { value: b }) {
    if (Array.isArray(a) && Array.isArray(b)) {
      // A comes before B if A dominates B.
      if (a.every((v, i) => v > b[i])) {
        return -1;
        // B comes before A if A is dominated by B.
      } else if (b.every((v, i) => v > a[i])) {
        return 1;
      }
      return 0;
    }
    return b - a;
  }

  /**
   * Applies selection and removal to generation.
   *
   * @returns {Individual[]}
   * @memberof Generation
   */
  next() {
    this.population.individuals = this._generation().concat(
      this.survival(this._tournament(this.population.individuals))
    );
    return this.population.individuals;
  }
}
