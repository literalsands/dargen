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
      let mutatedGenome = parentGenome.mutate({substitution: 1});
      parentGenome.should.not.deep.equal(copiedGenome);
      parentGenome.should.deep.equal(mutatedGenome);
    });
    it("does not modify the parent when asked", () => {
      let parentGenome = new Genome(2);
      let copiedGenome = parentGenome.copy();
      let mutatedGenome = parentGenome.mutate({substitution: 1, modify: false});
      parentGenome.should.deep.equal(copiedGenome);
      parentGenome.should.not.deep.equal(mutatedGenome);
    });
    it("provides substitution", () => {
      let genome = new Genome(2);
      let copiedGenome = genome.copy();
      genome.mutate({substitution: 1});
      genome.should.not.deep.equal(copiedGenome);
    });
    it("provides duplication", () => {
      let genome = new Genome(2);
      genome.mutate({duplication: 1, substitution: 0});
      genome.size.should.equal(4);
      genome[0].should.equal(genome[2]);
      genome[1].should.equal(genome[3]);
    });
    it("provides inverse", () => {
      let genome = new Genome(2);
      let genomeCopy = genome.copy();
      genome.mutate({inversion: 1, substitution: 0});
      genome.size.should.equal(2);
      genome.should.deep.equal(genomeCopy.reverse());
    });
    it("provides deletion", () => {
      let genome = new Genome(4);
      genome.mutate({deletion: 1, substitution: 0});
      genome.size.should.be.at.most(3);
    });
    it("provides incrementation");
    it("provides gravity");
    it("provides fuzzy mutations");
    it("never allows size to become less than 1 or lower", () => {
      let genome = new Genome(4);
      genome.mutate({deletion: 1, substitution: 0, lower: 4});
      genome.size.should.equal(4);
      genome.mutate({deletion: 1, substitution: 0});
      genome.size.should.equal(1);
    });
    it("never allows size to become greater than upper", () => {
      let genome = new Genome(4);
      genome.mutate({duplication: 1, substitution: 0, upper: 6});
      genome.size.should.equal(6);
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
    it("should take multiple parents", () => {
      let genomeA = new Genome(4);
      let genomeB = new Genome(2);
      let genomeC = new Genome(3);
      let childGenome;
      (() => {
        childGenome = genomeA.crossover({crossover: 1}, genomeB, genomeC);
      }).should.not.throw(Error);
      childGenome[0].should.be.oneOf([genomeB[0], genomeC[0]]);
      childGenome[1].should.be.oneOf([genomeB[1], genomeC[1]]);
      childGenome[2].should.be.oneOf([genomeC[2], genomeA[2]]);
      childGenome[3].should.be.oneOf([genomeA[3]]);
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

