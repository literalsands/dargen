// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created Janurary 3rd, 2015

import 'babel-polyfill';
import {should, expect} from 'chai';
import { Individual } from '../src/Individual';
import { Genome } from '../src/Genome';

should();

describe("Individual", () => {
  let individual;
  describe("constructor", () => {
    it("doesn't requires arguments", () => {
      (() => {
        new Individual();
      }).should.not.throw(Error);
    });
    it("takes an object argument", () => {
      (() => {
        new Individual({});
      }).should.not.throw(Error);
    });
  });
  describe("json", () => {
    beforeEach(() => {
      individual = new Individual();
    });
    it("outputs a string", () => {
      JSON.stringify(individual).should.be.a('string');
    });
    it("should output a JSON object", () =>{
      JSON.parse(JSON.stringify(individual)).should.be.an('object');
    })
    it("should parse to an equivalent individual", () => {
      let stringifiedIndividual = JSON.stringify(individual);
      let parsedIndividual = JSON.parse(stringifiedIndividual);
      new Individual(parsedIndividual).should.deep.equal(individual);
    })
  });
  describe("genome", () => {
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be a genome", () => {
      individual.genome.is.a('Genome');
    });
  });
  describe("phenotype", () => {
    beforeEach(() => {
      individual = new Individual({
        genome: new Genome(2)
      });
    });
    it("should take a function", () => {
      (() => {
        individual.phenotype = (g) => {g};
      }).to.not.throw(Error);
    });
    it("should take an object of functions", () => {
      (() => {
        individual.phenotype = {
          copy: (g) => {g.copy()},
          reverse: (g) => {g.reverse()},
        }
      }).to.not.throw(Error);
    });
    it("should take an array", () => {
      (() => {
        individual.phenotype = [
          copy: (g) => {Math.floor(g * 100)},
          reverse: (g) => {Math.floor(g * 100)},
        ]
      }).to.not.throw(Error);
    });
    it("should take an array of arrays", () => {
      (() => {
        individual.phenotype = [
          ['magenta', 'cyan', 'yellow'],
          ['serif', 'sans-serif'],
        ]
      }).to.not.throw(Error);
    });
    it("should take an object of arrays and functions", () => {
      individual.genome.size = 4;
      individual.phenotype = {
        color: (g) => {`rgb(${g.join()})`},
        fontStyle: ['serif', 'sans-serif'],
      }
    });
    it("should take an object of arrays", () => {
      (() => {
        individual.phenotype = {
          color: ['magenta', 'cyan', 'yellow'],
          fontStyle: ['serif', 'sans-serif'],
        }
      }).to.not.throw(Error);
    });
    it("should take an object of arrays", () => {
      (() => {
        individual.phenotype = {
          mutation: {
            substitution: 1,
            rate: (g) => {1},
            min: (g) => {0.1},
            max: (g) => {0.4},
            deletion: 1,
            duplication: 1,
            inversion: 1,
          }
        }
      }).to.not.throw(Error);
    });
    describe("traits", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("should return an object", () => {
        individual.traits.should.be.an('object');
      });
      it("should return genome if no phenotype is set", () => {
        individual.traits.should.be.a('Genome');
      });
      it("should always return the same value for the same genome", () => {
        let otherIndividual = new Individual({genome: genome.copy()});
        otherIndividual.traits.should.deep.equal(individual.traits);
      });
    });
    describe("evaluate", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("should take a function", () => {
        (() => {
          individual.evaluate((traits) => {
            traits.reduce((sum, value) => {
              sum + value
            }, 0);
          });
        }).should.not.throw(Error);
      });
    });
    describe("identifier", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("should be a string", () => {
        individual.identifier.should.be.a('string');
      });
      it("should be unique to genome", () => {
        let otherIndividual = new Individual();
        individual.identifer.should.not.equal(otherIndividual.identifier);
      });
    });
    describe("parents", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("should be an array of strings when parented", () => {
        let child = individual.crossover(individual);
        child.parents.should.be.an('array');
        child.parents[0].should.equal(individual.identifier);
        child.parents[1].should.equal(individual.identifier);
      });
      it("should be undefined when not parented", () => {
        expect(individual.parents).to.be.undefined;
      });
    });
    describe("timestamp", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("should be a datetime", () => {
        individual.timestamp.should.be.a('date');
      });
      it("should be a recent datetime", () => {
        let recentDate = new Date();
        recentDate.setDate(recentDate.getDate() - 1);
        individual.timestamp.should.be.above(recentDate);
      });
      it("should not be in the future", () => {
        individual.timestamp.should.be.below(new Date())
      });
    });
    describe("generation", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("should be a number", () => {
        individual.generation.should.be.a('number');
      });
    });
    describe("population", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("should be a unique string", () => {
        individual.population.should.be.a('string');
      });
    });
    describe("mutate", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("should have a default function", () => {
        individual.mutate.should.not.throw(Error);
      });
      it("should be overriden by phenotype", () => {
        individual.phenotype = {
          mutation: {
            rate: (g) => {g[2]},
            min: (g) => {g[1]},
            max: (g) => {g[0]}
          }
        }
        individual.mutate.should.not.throw(Error);
      });
    });
    describe("crossover", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("takes an individual", () => {
        let otherIndividual = new Individual()
        individual.crossover(otherIndividual)
      });
      it("takes many individuals", () => {
        let individual0 = new Individual()
        let individual1 = new Individual()
        individual.crossover(individual0, individual1);
      });
      it("produces a child composed of parent genes", () => {
        let parentIndividual = new Individual(2);
        let otherParentIndividual = new Individual(2);
        let childIndividual = parentIndividual.crossover(otherParentIndividual);
        let parentsIndividual = parentIndividual.concat(otherParentIndividual);
        childIndividual.genome.forEach((gene) =>
          gene.should.be.oneOf(parentsIndividual.genome));
      });
    });
    describe("copy", () => {
      beforeEach(() => {
        individual = new Individual();
      });
      it("is not the same object", () => {
        let individual = new Indvidual(2);
        let copiedIndvidual = individual.copy();
        individual.should.not.equal(copiedIndvidual);
      });
      it("is equal to the original", () => {
        let individual = new Indvidual(2);
        let copiedIndvidual = individual.copy();
        individual.should.deep.equal(copiedIndvidual);
      });
    });
