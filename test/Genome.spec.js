// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created Janurary 3rd, 2015

import 'babel-polyfill';
import chai from 'chai';
import { Genome } from '../src/Genome';

chai.should();
var expect = chai.expect;

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
  describe("length", () => {
    it("truncates the array", () => {
      let genome = new Genome(2);
      expect(genome[1]).to.be.a('number');
      console.log('call');
      genome.length = 1;
      expect(genome[1]).to.be.undefined;
    });
    it("fills the array with random values", () => {
      let genome = new Genome();
      expect(genome[0]).to.be.undefined;
      console.log('call');
      genome.length = 1;
      expect(genome[0]).to.be.a('number');
    });
  });
  describe("mutate", () => {
    it("modifies the parent", () => {
      var parentGenome = new Genome(2);
      var copiedGenome = parentGenome.copy();
      var mutatedGenome = parentGenome.mutate({rate: 1, modify: true});
      parentGenome.should.not.deep.equal(copiedGenome);
      parentGenome.should.deep.equal(mutatedGenome);
    });
    it("does not modify the parent when asked", () => {
      var parentGenome = new Genome(2);
      var copiedGenome = parentGenome.copy();
      var mutatedGenome = parentGenome.mutate({rate: 1, modify: false});
      parentGenome.should.deep.equal(copiedGenome);
      parentGenome.should.not.deep.equal(mutatedGenome);
    });
  });
  describe("crossover", () => {
    it("does not modify the parent", () => {
      var parentGenome = new Genome(2);
      var otherParentGenome = new Genome(2);
      var childGenome = parentGenome.crossover(otherParentGenome);
      parentGenome.should.not.deep.equal(otherParentGenome);
      parentGenome.should.not.deep.equal(childGenome);
    });
    it("produces a child composed of parent genes", () => {
      var parentGenome = new Genome(2);
      var otherParentGenome = new Genome(2);
      var childGenome = parentGenome.crossover(otherParentGenome);
      var parentsGenome = parentGenome.concat(otherParentGenome);
      childGenome.forEach((gene) =>
        gene.should.be.oneOf(parentsGenome));
    });
  });
  describe("copy", () => {
  });
  describe("includes", () => {
  });
  describe("equals", () => {
  });
  describe("howSimilar", () => {
  });
})

