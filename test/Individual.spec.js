import 'babel-polyfill';
import {should, expect, config} from 'chai';
import { Individual } from '../src/Individual';
import { Genome } from '../src/Genome';

config.includeStack = true;
should();

describe("Individual", () => {
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
    let individual;
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
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be a genome", () => {
      individual.genome.should.be.an.instanceof(Genome);
    });
  });
  describe("phenotype", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual({
        genome: new Genome(2)
      });
    });
    it("should take a function", () => {
      (() => {
        individual.phenotype = (g => g);
      }).should.not.throw(Error);
      expect(individual.traits).to.deep.equal(individual.genome);
    });
    it("should take an object of functions", () => {
      (() => {
        individual.phenotype = {
          copy: (g => g.copy()),
          reverse: (g => g.copy().reverse()),
        }
      }).should.not.throw(Error);
      expect(individual.traits).to.deep.equal({
        copy: individual.genome,
        reverse: individual.genome.copy().reverse()
      });
    });
    it("should take an array", () => {
      (() => {
        individual.phenotype = [
          (g => Math.floor(g * 50)),
          (g => Math.floor(g * 100)),
        ];
      }).should.not.throw(Error);
      expect(individual.traits).to.be.oneOf(individual.phenotype);
    });
    it("should take an array of arrays", () => {
      (() => {
        individual.phenotype = [
          ['magenta', 'cyan', 'yellow'],
          ['serif', 'sans-serif'],
        ]
      }).should.not.throw(Error);
      expect(individual.traits).to.be.oneOf(individual.phenotype);
    });
    it("should take an object of arrays and functions", () => {
      individual.genome.size = 4;
      individual.phenotype = {
        color: (g => `rgb(${g.join()})`),
        fontStyle: ['serif', 'sans-serif'],
      }
      expect(individual.traits.color).to.be.a('string');
      expect(individual.traits.fontStyle).to.be.oneOf(individual.phenotype.fontStyle);
    });
    it("should take an object of arrays", () => {
      (() => {
        individual.phenotype = {
          color: ['magenta', 'cyan', 'yellow'],
          fontStyle: ['serif', 'sans-serif'],
        }
      }).should.not.throw(Error);
      expect(individual.traits.color).to.be.oneOf(individual.phenotype.color);
      expect(individual.traits.fontStyle).to.be.oneOf(individual.phenotype.fontStyle);
    });
    it("should take a nested object", () => {
      (() => {
        individual.phenotype = {
          mutate: {
            rate: (g => 0.1),
            min: (g => 0.2),
            max: (g => 0.3),
            substitution: [0.4, 0.8, 1],
            deletion: 0.5,
            duplication: 0.6,
            inversion: 0.7
          }
        };
      }).should.not.throw(Error);
      expect(individual.traits.mutate).to.be.an('object');
      expect(individual.traits.mutate.deletion).to.equal(0.5);
      expect(individual.traits.mutate.min).to.equal(0.2);
      expect(individual.traits.mutate.max).to.equal(0.3);
      expect(individual.traits.mutate.rate).to.equal(0.1);
      expect(individual.traits.mutate.inversion).to.equal(0.7);
      expect(individual.traits.mutate.duplication).to.equal(0.6);
      expect(individual.traits.mutate.substitution).to.be.oneOf(individual.phenotype.mutate.substitution);
    });
  });
  describe("traits", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should return genome if no phenotype is set", () => {
      expect(individual.traits).to.be.an.instanceof(Genome);
    });
    it("should always return the same value for the same genome", () => {
      let otherIndividual = new Individual({genome: individual.genome.copy()});
      expect(otherIndividual.traits).to.deep.equal(individual.traits);
    });
    describe("array", () => {
      it("should return a value when a gene is 0 or 1", () => {
        individual.phenotype = [0, 1, 2, 3];
        individual.genome[0] = 0;
        expect(individual.traits).to.equal(0);
        individual.genome[0] = 1;
        expect(individual.traits).to.equal(3);
      });
    });
  });
  describe("evaluate", () => {
    let individual;
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
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be a string", () => {
      expect(individual.identifier).to.be.a('string');
    });
    it("should be unique to genome", () => {
      let otherIndividual = new Individual();
      expect(individual.identifer).to.not.equal(otherIndividual.identifier);
    });
  });
  describe("parents", () => {
    let individual;
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
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be a datetime", () => {
      individual.timestamp.should.be.a('number');
      new Date(individual.timestamp).should.be.a('date');
    });
    it("should be a recent datetime", () => {
      let recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 1);
      individual.timestamp.should.be.above(recentDate);
    });
    it("should not be in the future", () => {
      // Add 1 "should be below or equal to"
      individual.timestamp.should.be.below(new Date().getTime() + 1)
    });
  });
  describe("generation", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be an identifier if defined", () => {
      expect(individual.generation).to.be.oneOf([undefined, 'string']);
    });
  });
  describe("population", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be an identifier if defined", () => {
      expect(individual.population).to.be.oneOf([undefined, 'string']);
    });
  });
  describe("mutate", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should have a default function", () => {
      (() => {
        individual.mutate();
      }).should.not.throw(Error);
    });
    it("should be overriden by phenotype", () => {
      individual.phenotype = {
        mutate: {
          rate: (g => g[2]),
          min: (g => g[1]),
          max: (g => g[0])
        }
      };
      (() => {
        individual.mutate();
      }).should.not.throw(Error);
    });
  });
  describe("crossover", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("takes an individual", () => {
      let otherIndividual = new Individual();
      individual.crossover(otherIndividual);
    });
    it("takes many individuals", () => {
      let individual0 = new Individual();
      let individual1 = new Individual();
      individual.crossover(individual0, individual1);
    });
    it("produces a child composed of parent genes", () => {
      let parentIndividual = new Individual();
      let otherParentIndividual = new Individual();
      let childIndividual = parentIndividual.crossover(otherParentIndividual);
      let parentsGenes = [parentIndividual].concat(otherParentIndividual).reduce(
        (genes, { genome }) => { return genes.concat(genome); }, []);
      childIndividual.genome.forEach(gene => gene.should.be.oneOf(parentsGenes));
    });
    it("should be overriden by phenotype", () => {
      individual.phenotype = {
        crossover: {
          rate: (g => g[2]),
          min: (g => g[1]),
          max: (g => g[0])
        }
      };
      let otherIndividual = new Individual();
      individual.genome.size = 3;
      (() => individual.crossover(otherIndividual)).should.not.throw(Error);
    });
  });
});
