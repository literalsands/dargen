import { GenomeBase } from "./GenomeBase";

/**
 * Creates an epigenome.
 *
 * @exports Epigenome
 * @classdesc How are genes expressed? i.e. Which functions decode which gene positions?
 * @class
 * @param {Epigenome|Array|Number|undefined} epigenome - An array of strings or a number indicating the length of the epigenome.
 * @param {String[]} [alphabet=[""]] - Strings that are available to the epigenome.
 * @extends {GenomeBase}
 */
export class Epigenome extends GenomeBase {
  constructor(epigenome, alphabet) {
    super(epigenome);
    this._alphabet = alphabet;
  }

  /**
   * The values available to epigenome mutations.
   *
   * @type {Array}
   * @memberof Epigenome
   * @example
   *  // Always a unique list.
   * let epigenome = new Epigenome()
   * epigenome.alphabet = ["red", "green", "blue", "blue"]
   * epigenome.alphabet //=> ["red", "green", "blue"]
   *
   * @example
   * // Alphabet values are used to fill epigenome if size increases.
   * let epigenome = new Epigenome()
   * epigenome //=> []
   * epigenome[0] //=> undefined
   * epigenome.alphabet = ["A"]
   * epigenome.size = 6
   * epigenome //=> ["A", "A", "A", "A", "A", "A"]
   *
   * @example
   * // Alphabet includes epigenome values.
   * let epigenome = new Epigenome(["A", "B", "B"])
   * epigenome.alphabet //=> ["A", "B"]
   * // But, it doesn't use automatic values for filling.
   * epigenome.size = 6
   * epigenome //=> ["A", "B", "B", undefined, undefined, undefined, undefined]
   * // Unless you set them.
   * epigenome.alphabet = epigenome.alphabet
   */
  set alphabet(alphabet) {
    this._alphabet = alphabet;
  }

  get alphabet() {
    return new Set(this._alphabet.concat(this)).entries();
  }

  /**
   * Returns a random value epigenome marker value from the set alphabet.
   *
   * @override
   * @returns {string} - A random marker from the epigenome alphabet.
   * @memberof Epigenome
   * @example
   * let epigenome = new Epigenome(["B", "B"])
   * epigenome.alphabet //=> ["B"]
   * epigenome.getRandomGeneValue() //=> undefined
   * epigenome.alphabet = epigenome.alphabet
   * epigenome.getRandomGeneValue() //=> "B"
   * epigenome.alphabet = ["A"]
   * epigenome.getRandomGeneValue() //=> "A"
   */
  getRandomGeneValue() {
    return this.alphabet[Math.floor(super.getRandomGeneValue()*this.alphabet.length)];
  }

  /**
   * Compile genome positions to arguments arrays using marker names.
   *
   * @param {Genome|Array} genome
   * @returns {Object} - Object of arrays containing a key and values that are values of the genome.
   * @memberof Epigenome
   * @example
   * let epigenome = new Epigenome(["A", "B", "B", "A"])
   * let genome = new Genome([0, 0.5, 0.5, 1])
   * epigenome.compile(genome) //=>
   * {
   *   "A": [0, 1],
   *   "B": [0.5, 0.5]
   * }
   */
  compile(genome) {
    return this.reduce((args, marker, position) => {
      if (args[marker]) {
        args[marker] = [genome[position]];
      } else {
        args[marker].push(genome[position]);
      }
      return args;
    }, {});
  }
}

Epigenome.Mutations = Object.assign({}, GenomeBase.Mutations, {
  incrementation() {},
  substitution() {}
})
