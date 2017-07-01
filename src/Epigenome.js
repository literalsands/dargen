import { GenomeBase } from "./GenomeBase";

/**
 * Creates an epigenome.
 *
 * How are genes expressed?
 * i.e. What genes positions are passed to what functions?
 *
 * @exports Epigenome
 * @class Epigenome
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
   * @memberof Epigenome
   */
  set alphabet(alphabet) {
    this._alphabet = alphabet;
  }

  /**
   * The values available to epigenome mutations, and the in-use alphabet of the epigenome.
   *
   * @returns Set - Set that contains the alphabet.
   * @memberof Epigenome
   */
  get alphabet() {
    return new Set(this._alphabet.concat(this));
  }

  /**
   * Returns a random value epigenome marker value.
   *
   * @returns string - A random marker from the epigenome alphabet.
   * @memberof Epigenome
   */
  getRandomGeneValue() {
    return this.alphabet.entries()[Math.floor(super.getRandomGeneValue()*this.alphabet.size)];
  }

  /**
   * Compile genome positions to arguments arrays using marker names.
   *
   * @param {Genome|Array} genome
   * @returns Object - Object of arrays containing a key and values that are values of the genome.
   * @memberof Epigenome
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

  /**
   * Mimic mutations that take place for a genome.
   *
   * Will mutate epigenome only when asked for mutations that do not change gene positions.
   *
   * @memberof Epigenome
   */
  mutate() {
  }

  /**
   * Mimic crossover that takes place for a genome.
   *
   * Will only apply crossover methods that do not change gene positions or exchange gene when asked.
   *
   * @memberof Epigenome
   */
  crossover() {
  }
}

Epigenome.Mutations = Object.assign({}, GenomeBase.Mutations, {
  substitution(rate) {},
})