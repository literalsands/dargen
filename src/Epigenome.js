import { GenomeBase } from "./GenomeBase";

/**
 * Creates an epigenome.
 *
 * @classdesc How are genes expressed? i.e. Which functions decode which gene positions?
 * @class Epigenome
 * @param {Epigenome|Array|Number|undefined} epigenome - An array of strings or a number indicating the length of the epigenome.
 * @param {String[]} [alphabet=[]] - Strings that are available to the epigenome.
 * @extends {GenomeBase}
 * @example
 * // Create a boring Epigenome.
 * let boring = new Epigenome();
 * boring //=> []
 *
 * @example
 * // Create an Epigenome with an automatic alphabet.
 * let epigenome = new Epigenome(["A", "B", "A", "C", "C"])
 * epigenome.alphabet //=> ["A", "B", "C"]
 *
 * @example
 * // Create an Epigenome with a specified alphabet.
 * let epigenome = new Epigenome(["A"], ["A", "B", "C"])
 * epigenome.alphabet //=> ["A", "B", "C"]
 *
 * @example
 * // Create an randomly populated Epigenome of a certain size from a given alphabet.
 * new Epigenome(6, ["E"]) //=> ["E", "E", "E", "E", "E", "E"]
 *
 * @example
 * // Epigenomes json representation will restore to the same object.
 * let epigenome = new Epigenome(["A", "G"], ["A", "B", "C"])
 * let epigenomeFromJSON = JSON.parse(JSON.stringify(epigenome))
 * epigenome.isEqual(epigenomeFromJSON) //=> true
 * // But, it's alphabet will need to be restored.
 * epigenome.alphabet //=> ["A", "B", "C"]
 * epigenomeFromJSON.alphabet //=> ["A", "G"]
 *
 */
export class Epigenome extends GenomeBase {
  constructor(epigenome, alphabet=[]) {
    if (Number.isSafeInteger(genes) && genes >= 0) {
      super();
      this._alphabet = alphabet;
      this.size = genes;
    }
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
    return Array.from(new Set(this.concat(this._alphabet)));
  }

  /**
   * Returns a random value epigenome marker value from the set alphabet.
   *
   * @returns {string} - A random marker from the epigenome alphabet.
   * @memberof Epigenome
   * @example
   * // Return a random value from the Epigenome's alphabet.
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
