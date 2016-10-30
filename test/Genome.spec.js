// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created Janurary 3rd, 2015

import 'babel-polyfill';
import {should, expect} from 'chai';
import { Genome } from '../src/Genome';

should();

// A Genome is the set of genes of an individual.
describe("Genome", () => {
  describe("constructor", () => {
    it("does not require arguments", () => {
      (() => {
        new Genome();
      }).should.not.throw(Error);
    });
    it("takes an array as an argument", () => {
      (() => {
        new Genome([]);
      }).should.not.throw(Error);
    })
    it("takes a number as an argument", () => {
      (() => {
        new Genome(8);
      }).should.not.throw(Error);
    })
  });
  describe("json", () => {
    let genome = new Genome(8);
    it("outputs a string", () => {
      JSON.stringify(genome).should.be.a('string');
    });
    it("should output a JSON array", () =>{
      JSON.parse(JSON.stringify(genome)).should.be.an('array');
    })
    it("should parse to an equivalent genome", () => {
      let stringifiedGenome = JSON.stringify(genome);
      let parsedGenome = JSON.parse(stringifiedGenome);
      new Genome(parsedGenome).should.deep.equal(genome);
    })
  });
  describe("size", () => {
    it("truncates the genome", () => {
      let genome = new Genome(2);
      expect(genome[1]).to.be.a('number');
      genome.size = 1;
      expect(genome[1]).to.be.undefined;
    });
    it("equals the length", () => {
      let genome = new Genome(2);
      genome.length.should.equal(genome.size);
    });
    it("fills the array with random values", () => {
      let genome = new Genome();
      expect(genome[0]).to.be.undefined;
      genome.size = 1;
      expect(genome[0]).to.be.a('number');
    });
  });
  describe("mutate", () => {
    it("modifies the parent", () => {
      let parentGenome = new Genome(2);
      let copiedGenome = parentGenome.copy();
      let mutatedGenome = parentGenome.mutate({rate: 1});
      parentGenome.should.not.deep.equal(copiedGenome);
      parentGenome.should.deep.equal(mutatedGenome);
    });
    it("does not modify the parent when asked", () => {
      let parentGenome = new Genome(2);
      let copiedGenome = parentGenome.copy();
      let mutatedGenome = parentGenome.mutate({rate: 1, modify: false});
      parentGenome.should.deep.equal(copiedGenome);
      parentGenome.should.not.deep.equal(mutatedGenome);
    });
  });
  describe("crossover", () => {
    it("does not modify the parent", () => {
      let parentGenome = new Genome(2);
      let otherParentGenome = new Genome(2);
      let childGenome = parentGenome.crossover({}, otherParentGenome);
      parentGenome.should.not.deep.equal({}, otherParentGenome);
      parentGenome.should.not.equal(childGenome);
    });
  });
  describe("copy", () => {
    it("is not the same object", () => {
      let genome = new Genome(2);
      let copiedGenome = genome.copy();
      genome.should.not.equal(copiedGenome);
    });
    it("is equal to the original", () => {
      let genome = new Genome(2);
      let copiedGenome = genome.copy();
      genome.should.deep.equal(copiedGenome);
    });
  });
})

