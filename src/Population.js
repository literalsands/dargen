import { Individual } from "./Individual";
import uuid from "uuid";
let { v4: getIdentifier } = uuid;

/**
 * Creates a new Population.
 *
 * Can take prototype individual, phenotypes, and/or genome and create an initial population with the same phenotype and options. It can also take a list of previously defined individuals.
 *
 * @exports Population
 * @classdesc Query, manage, and perform operations on many individuals at once.
 * @class
 * @param {Population|Population~json} population - Population parameters.
 * @param {Individual} population.proto - A Prototypal Invididual.
 * @param {number|Individual[]|Individual~json[]} population.individuals - A list of individuals, or a number specifying the number of individuals to be created from the prototype.
 * @param {string} population.identifier - An identifier helpful for storing the population.
 */
export class Population {
  constructor(population) {
    /* Setup Population using configuration object. */
    let individuals;
    ({
      proto: this.proto,
      individuals,
      identifier: this.identifier = `p-${getIdentifier()}`
    } = population);
    // A population requires a set of individuals or it requires a prototype individuals and a number of individuals.
    if (
      !(Array.isArray(individuals) && individuals.length > 0) &&
      !(this.proto instanceof Object && Number.isInteger(individuals))
    )
      throw Error("Invalid population options.");
    this.individuals = Array.isArray(individuals)
      ? individuals.slice()
      : this._generate(this.proto, individuals);
    this._selections = [];
  }

  /**
   * Generate orphan individuals from a prototype individual.
   */
  _generate(proto, n) {
    // TODO: Make this an operator. This would make the constructor more predictable, and would encourage for the creation of prototype individuals after the initial population has been created.
    return Array.from(
      new Array(n),
      i => new Individual(proto && proto.__proto)
    );
  }

  /**
   * The population is serializable to and from JSON.
   *
   * @typedef Population~json
   * @type {Object}
   * @property {String} [identifier=`p-${getIdentifier()}`] - A unique string for the population. Automatically populated by UUID.
   * @property {Individual[]|Object[]} [individuals] - An array of Individuals in the population.
   */

  /**
   * Deeply copied, immutable population.
   *
   * @returns Population - Frozen, deep copy of current population.
   * @memberof Population
   */
  fossilize() {
    return new Population({
      individuals: Array.from(
        this.individuals,
        individual => new Individual(JSON.parse(JSON.stringify(individual)))
      )
    });
  }

  /**
   * A pipeline is an ordered list of pipeline objects.
   *
   * @typedef Population~Pipeline
   * @type {Population~PipelineOperation[]]}
   */

  /**
   * Pipeline operators are named functions on the Population.Operation object.
   *
   * @typedef Population~PipelineOperator
   * @type {string} operation - A named operation that the Population class can perform. Add more operations by extending Population.Operation.
   */

  /**
   * A pipeline operation is a selection with an operation applied to it.
   * An operation doesn't have to be applied in every pipeline operation, for example a named selection can be created by itself.
   * Some shorthand operations are available.
   *
   * @typedef Population~PipelineOperation
   * @type {object}
   * @property {Population~SelectionOptions} [selection=true] - Base selection to apply operation to. Selects all if true.
   * @property {Population~PipelineOperator} operation
   * @property {Population~SelectionOptions} [mutate] - Applies mutate operation to selection. Given selection is taken from base selection. Mutate always occurs after crossover if together. Shorthand for the mutateAndReplace operation.
   * @property {Population~SelectionOptions[]} [crossover] - Applies crossover operation to selections, with the first selection being the "bearing" parent. Selections are taken from base selection. The shape and number of crossover children will be the same as that of the first selection. Shorthand for the crossoverAndReplace operation.
   * @property {Population~SelectionOptions} [duplicate] - Shorthand for the duplicate operation.
   * @property {Population~SelectionOptions} [remove] - Shorthand for the remove operation.
   * TODO: Amend documentation with an image showing the total structure of a pipeline operation.
   */

  /**
   * Evolve individuals of the population into the next generation.
   * Applies manipulations to populations of individuals using manipulation pipelines and fitness functions.
   *
   * @method evolve
   * @param {function|Population~Pipeline}  strategy - A function or description of operations to be performed on the population.
   * @returns {this}
   * @example
   * Population.Fitness["fitfunc"] = ({traits: {value}}) => value
   * Population.evolve(function() {
   *   let groups = this.selection({
   *     size: 10,
   *     groups: 4,
   *     sort: "random"
   *   }), elite = this.selection(groups, {
   *     size: 1,
   *     sort: {
   *       value: "fitfunc", // The fitness function defined above.
   *       order: "ascending"
   *     }
   *   })
   *   this.crossover([elite, {
   *     operation: "difference", selections: [groups, elite]
   *   })
   *   this.mutate({operation: "inverse", selections: "elite"})
   * })
   *
   * @example
   * population.evolve([
   *   {
   *     // Perform crossover in tournaments of size 5.
   *     selection: {
   *       // Select groups.
   *       size: 5,
   *       sort: "random"
   *     },
   *     crossover: [
   *       {
   *         // "Less fit" Mating Partners
   *         size: 4,
   *         sort: {
   *           value: "fitness",
   *           order: "descending"
   *         }
   *       },
   *       {
   *         // "Elite" Tournament Winner
   *         name: "elite",
   *         size: 1,
   *         sort: {
   *           value: "fitness",
   *           order: "ascending"
   *         }
   *       }
   *     ]
   *   },
   *   {
   *     mutate: {
   *       operation: "inverse",
   *       selections: ["elite"]
   *     }
   *   }
   * ]);
   */
  evolve(pipeline) {
    return this;
  }

  /**
   * @typedef Population~Selection
   * @type {integer[]|Population~Selection[]} - A nested array of integers.
   */

  /**
   * @typedef Population~SelectionOperator
   * @type {object}
   * @property {string('inverse'|'union'|'intersection'|'difference')} operation
   * @property {Population~SelectionOptions[]} selections - Invert the selection.
   */

  /**
   * @typedef Population~SelectionOptionsObject
   * @type {object} - If true, returns full selection.
   * @property {string} [name] - A name to cache the selection under.
   * @property {integer} [groups] - The maximum number of top level nested selections. Increase the level of nesting by one.
   * @property {integer} [size] - The maximum number of identifiers per selection.
   * @property {Population~SelectionSortOptions} [sort] - Sort the selection before applying grouping or sizing.
   */

  /**
   * A description used to retrieve a selection of individuals from a population.
   * This selection can be nested into groups.
   * If true, returns all selectable.
   * If string, treat as named selection reference.
   * If object, can be an operation over multiple selections or a selection.
   * If array, returns a list of nested selections.
   *
   * @typedef Population~SelectionOptions
   * @type {Population~SelectionOptions[]|string|boolean|Population~Selection|Population~SelectionOperator|Population~SelectionOptionsObject}
   */

  /**
   * Select a list of individual indexes. This list can be nested in groups.
   *
   * @method selection
   * @param {Population~SelectionOptions} [options=true] - Options to create a selection or nested selection. Returns a complete selection by default.
   * @param {Population~Selection} [individuals] - Optional structured subset of the population to select from.
   * @returns {Population~Selection}
   *
   * @example
   * // True returns the entire selection.
   * population.selection(true) // => [0, 1, 2, 3, 4]
   * // Falsey values return an empty selection.
   * population.selection({}) // => []
   *
   * @example
   * // A named selection is stored for later.
   * population.selection({name: "saveit"}, true) // => [0, 1, 2, 3, 4]
   * population.selection("saveit")               // => [0, 1, 2, 3, 4]
   * population.selection({name: "saveit"})       // => [0, 1, 2, 3, 4]
   * population.selection({name: "saveit", shuffle: true, groups: 2}) // => [[3, 1, 4], [0, 2]]
   * population.selection("saveit")               // => [[3, 1, 4], [0, 2]]
   * population.selection({name: "saveit"})       // => [[3, 1, 4], [0, 2]]
   *
   */
  selection(...selections) {
    // Combine selections.
    return selections.reverse().reduce((selection, next) => {
      // If the selection is nested, apply next on every nested selection.
      if (Array.isArray(selection) && Array.isArray(selection[0])) {
        selection.forEach(
          (nested, i) => (selection[i] = this.selection(next, nested))
        );
        return selection;
      }
      return this._selection(next, selection);
    }, undefined);
  }

  _selection(options, selection = Array.from(this.individuals, (v, i) => i)) {
    // Return a full selection if given true.
    if (options === true) {
      // All indices for individuals.
      return selection;
      // Return the the number if given a number, as long as it is in range.
    } else if (Number.isInteger(options)) {
      // Out of bounds selection elements are replaced with -1's.
      return options < this.individuals.length && options > -1 ? options : -1;
      // Return an empty selection if given a falsey value.
    } else if (!options) {
      // Return an empty selection.
      return [];
      // Return the named selection if given a string.
    } else if (typeof options === "string") {
      return this._selections[options] || [];
      // Return a selection recursively if given an array.
    } else if (Array.isArray(options)) {
      // Replace array element with selection.
      options.forEach((el, i) => (options[i] = this._selection(el, selection)));
      return options;
      // Return a configured selection if given an object.
    } else if (options instanceof Object) {
      // Overwrite the selection name if given a name and options configure the selection in some way.
      if (typeof options.name === "string" && Object.keys(options).length > 1)
        this._selections[options.name] = selection;
      // Initialize the selection with the named selection or a new full selection.
      selection =
        typeof options.name === "string"
          ? this._selection(options.name)
          : selection;
      // Perform an operation over selections.
      if (options.operation) {
        // Configure a full selection.
      } else {
        // Shuffle the selection.
        if (options.shuffle) this._shuffle(selection);
        // Apply sizing and grouping options.
        if (options.size && !options.groups) selection.splice(options.size);
        if (options.groups) {
          let i = 0,
            groups = Math.min(
              Number.isSafeInteger(options.groups)
                ? options.groups
                : selection.length / options.size,
              selection.length
            ),
            size = Math.max(
              Number.isSafeInteger(options.size)
                ? options.size
                : selection.length / groups,
              1
            );
          selection[0] = selection.splice(0);
          while (i < groups) {
            // TODO: This use of size leaves a variable end group instead of groups of +1/-1 size.
            selection[i + 1] = selection[i].splice(Math.floor(size));
            i++;
          }
          selection.splice(i);
        }
        // Sort the selection.
        if (options.sort instanceof Object) {
          this.sort(selection, options.sort);
        }
        // Clip the selection to a threshold.
      }
      return selection;
    }
  }

  // In place fisher-yates shuffle.
  _shuffle(selection) {
    for (let i = 0; i < selection.length; i++) {
      let choice = Math.floor(Math.random() * (selection.length - i));
      let swap = selection[choice + i];
      selection[choice + i] = selection[i];
      selection[i] = swap;
    }
  }

  /**
   * Options allowing you to sort by fitness functions using self-defined comparators.
   * Sorting order "random" shuffles the selection.
   * Sorting threshold filters the selection, removing the threshold and any value placed after it.
   *
   * @typedef Population~SelectionSortOptions
   * @type {object}
   * @property {string|Population~Fitness} [value] - A function name on Population.Fitness or a function.
   * @property {string|Population~Comparison} [comparison] - A function name on Population.Compare or a comparison function for sorting.
   * @property {('ascending'|'descending'|'random'|'asis')} [order='asis']
   * @property {*} [threshold] - A cutoff value for ascending or descending order. Selection proceding this value in the sorted list will be discarded.
   */

  /**
   * Return a population selection in an order based on fitness functions.
   *
   * @method sort
   * @param {Population~Selection} selection - A selection to sort.
   * @param {string|Population~SelectionSortOptions} options - An options object.
   * @returns {Population~Selection} - Sorts the given selection or returns a new selection of the sorted individuals.
   */
  sort(selection, options) {
    if (Array.isArray(selection)) {
    }
  }

  /**
   * NOT IMPLEMENTED
   * Stub function that could return some interesting statistics on the current population of individuals.
   * Ideas for the future include convergence, trait commonality, and generational fitness graphs.
   *
   * @returns Object
   * @memberof Population
   */
  stats() {}

  /**
   * An operation is a function that takes a selection and performs an operation on the current population.
   *
   * @method operation
   * @param {function|Population~PipelineOperator} operator - A function or function key on Population.Operation.
   * @param {Population~SelectionOptions} selection - A selection of individuals to perform the operation with.
   * @returns {this}
   */
  operation(operator, selection = true) {
    operator =
      operator instanceof Function ? operator : Population.Operation[operator];
    return operator(this.individuals, this.selection(selection));
  }

  /*
   * Operation shorthand.
   */

  /**
   * @method crossover - A shorthand function for operation "crossoverAndReplace."
   * @param {Population~SelectionOptions} selections - An array of selections or selection options. The first selection will be the "bearing" selection.
   * @returns {this}
   */
  crossover(selections) {
    this.operation("crossoverAndReplace", selections);
  }

  /**
   * @method mutate - A shorthand function for operation "mutateAndReplace."
   * @param {Population~SelectionOptions} selection
   * @returns {this}
   */
  mutate(selection) {
    this.operation("mutateAndReplace", selection);
  }

  /**
   * @method remove - A shorthand function for the operation "remove."
   * @param {Population~SelectionOptions} selection
   * @returns {this}
   */
  remove(selection) {
    this.operation("remove", selection);
  }

  /**
   * @method duplicate - A shorthand function for the operation "duplicate."
   * @param {Population~SelectionOptions} selection
   * @returns {this}
   */
  duplicate(selection) {
    this.operation("duplicate", selection);
  }
}

function selectionFilter(selection, filter = {}) {
  if (!Array.isArray(selection)) filter[selection] = true;
  else selection.forEach(selected => selectionFilter(selected, filter));
  return filter;
}

/**
 * @typedef Population~Operation
 * @type {Function}
 * @param {Individual[]} individuals - Population of individuals to be operated on.
 * @param {Population~Selection} selection - The selection of the individuals used for the operation.
 * @returns {Individual[]} - A list of individuals affected by the operation.
 */

Population.Operation = {
  remove(individuals, selection) {
    let filter = Object.keys(selectionFilter(selection));
    let removed = [];
    // Remove individuals in reverse order to preserve indices.
    for (var i = filter.length - 1; i > -1; i--) {
      removed.push(individuals[filter[i]]);
      individuals.splice(filter[i], 1);
    }
    return removed;
  },
  duplicate(individuals, selection) {
    let filter = Object.keys(selectionFilter(selection));
    let duplicated = [];
    // Duplicate individuals in reverse order to preserve indices.
    for (var i = filter.length - 1; i > -1; i--) {
      duplicated.push(individuals[filter[i]]);
      // Place duplicated individuals in place directly after their copy.
      individuals.splice(i+1, 0, new Individual(individuals[filter[i]]));
    }
    return duplicated;
  },

};

/**
 * @typedef Population~Fitness
 * @type {Function}
 * @param {Individual} individual - Individual to be evaluated.
 * @param {Individual|Individual[]} [competition] - Optional individual or group of individuals to be evaluated with.
 * @returns {*|*[]} A value or array of values to be consumed by a comparison function.
 */

Population.Fitness = {};

/**
 * @typedef Population~Comparison
 * @type {Function} - See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters
 * @param {*} a - Comes before value 'b' if return value is less than 0. This is the return value of a fitness function.
 * @param {*} b - Comes before value 'a' if return value is greater than 1. This is the return value of a fitness function.
 * @returns {number}
 */

Population.Comparison = {};
