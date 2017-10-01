import { Population } from "./Population";
import { Individual } from "./Individual";
import getRandomInt from "./helpers";
import uuid from "uuid";
let { v4: getIdentifier } = uuid;

/**
 * Create a new Generation.
 *
 * Applies manipulations to populations of individuals using manipulation pipelines and fitness functions.
 *
 * @exports Generation
 * @classdesc A collection of strategies for producing the next generation of a population.
 * @class
 * @param {Generation~pipeline} strategy - Generation strategy.
 * @param {Generation~fitness|Generation~fitness[]} [fitness] - Fitness function or object of fitness functions.
 * @example
 * Generation.Fitness["fitness"] = () => 0
 * let generation = new Generation(function({individuals}) {
 *   this.cache = true;
 *   let groups = this.selection(individuals, {
 *     group: {
 *       size: 4,
 *       groups: 5
 *     },
 *     sort: "random"
 *   }), elite = this.selection(groups, {
 *     pick: 1,
 *     sort: {
 *       value: "fitness",
 *       order: "ascending"
 *     }
 *   })
 *   this.crossover(elite, groups, individuals)
 *   this.remove(this.selection(groups, {
 *     pick: 4,
 *     sort: {
 *       value: "fitness",
 *       order: "descending"
 *     }
 *   }), individuals)
 *   this.copy(elite, individuals)
 *   this.mutate(this.selection(), individuals)
 * })
 * generation.evolve(population);
 * @example
 * new Generation([{
 *   selection: {
 *     name: "groups",
 *     group: {size: 4, groups: 5},
 *     sort: "random",
 *     selection: {
 *       name: "elite",
 *       pick: 1
 *       sort: {
 *         value: "fitness",
 *         order: "ascending"
 *       }
 *     },
 *     selection: {
 *       name: "unfit",
 *       pick: 4,
 *       sort: {
 *         value: "fitness",
 *         order: "descending"
 *       }
 *     }
 *   },
 * },
 * {crossover: {primary: "elite", secondary: "groups"}},
 * {remove: "unfit"},
 * {copy: "elite"},
 * {mutate: true}])
 */
export class Generation {
  constructor(pipeline, fitness) {
    this.pipeline = pipeline;
    this.fitness = fitness;
  }

  /**
   * @typedef Generation~fitness
   * @type {Function}
   * @param {Individual} individual
   * @param {Individual[]} group
   * @returns {any|any[]} A value or array of values to be consumed by a comparison function.
   */

  /**
   * @typedef Generation~pipeline
   * @type {Function}
   * @param {Individual} individual
   * @param {Individual[]} group
   * @returns {any|any[]} A value or array of values to be consumed by a comparison function.
   */

  /**
   * @method evolve
   * @param {array|Population} individuals
   * @returns {this}
   */
  evolve() {}
  /**
   * @method evolve
   * @param {array|Population} individuals
   * @param {object} options
   * @returns {this}
   */
  selection() {}
  // Part of the selection method.
  sort() {}
  /**
   * @method evolve
   * @param {integer[]} selection
   * @param {array|Population} individuals
   * @returns {this}
   */
  crossover() {}
  /**
   * @method evolve
   * @param {integer[]} selection
   * @param {array|Population} individuals
   * @returns {this}
   */
  mutate() {}
  /**
   * @method evolve
   * @param {integer[]} selection
   * @param {array|Population} individuals
   * @returns {this}
   */
  remove() {}
  /**
   * @method evolve
   * @param {integer[]} selection
   * @param {array|Population} individuals
   * @returns {this}
   */
  duplicate() {}
}
