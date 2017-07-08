import "babel-polyfill";
import { should, expect, config } from "chai";
import { Individual } from "../src/Individual";
import { Genome } from "../src/Genome";
import { Epigenome } from "../src/Epigenome";
import { Phenotype } from "../src/Phenotype";

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
      JSON.stringify(individual).should.be.a("string");
    });
    it("should output a JSON object", () => {
      JSON.parse(JSON.stringify(individual)).should.be.an("object");
    });
    it("should parse to an equivalent individual", () => {
      let stringifiedIndividual = JSON.stringify(individual);
      let parsedIndividual = JSON.parse(stringifiedIndividual);
      new Individual(parsedIndividual).should.not.deep.equal(individual);
    });
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
  describe("epigenome", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be an epigenome", () => {
      expect(individual.epigenome).to.be.an.instanceof(Epigenome);
    });
    it("will store gene to function mapping in an epigenome");
  });
  describe("phenotype", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual({
        genome: new Genome(2)
      });
    });
    it("should always be a phenotype", () => {
      // Setting different individuals from constructor.
      expect(new Individual().phenotype).to.be.instanceof(Phenotype);
      expect(new Individual({ phenotype: {} }).phenotype).to.be.instanceof(
        Phenotype
      );
      expect(
        new Individual({ phenotype: { simple: "phenotype" } }).phenotype
      ).to.be.instanceof(Phenotype);
      expect(
        new Individual({ phenotype: new Phenotype() }).phenotype
      ).to.be.instanceof(Phenotype);
      expect(
        new Individual({ phenotype: { fancy: () => "phenotype" } }).phenotype
      ).to.be.instanceof(Phenotype);

      // Setting different individuals.
      individual = new Individual();
      individual.phenotype = undefined;
      expect(individual.phenotype).to.be.instanceof(Phenotype);
      individual.phenotype = {};
      expect(individual.phenotype).to.be.instanceof(Phenotype);
      individual.phenotype = { simple: "phenotype" };
      expect(individual.phenotype).to.be.instanceof(Phenotype);
      individual.phenotype = new Phenotype();
      expect(individual.phenotype).to.be.instanceof(Phenotype);
      individual.phenotype = { fancy: () => "phenotype" };
      expect(individual.phenotype).to.be.instanceof(Phenotype);
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
      let otherIndividual = new Individual({
        genome: individual.genome.copy()
      });
      expect(otherIndividual.traits).to.deep.equal(individual.traits);
    });
  });
  describe("identifier", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be a string", () => {
      expect(individual.identifier).to.be.a("string");
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
      child.parents.should.be.an("array");
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
      individual.timestamp.should.be.a("number");
      new Date(individual.timestamp).should.be.a("date");
    });
    it("should be a recent datetime", () => {
      let recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 1);
      individual.timestamp.should.be.above(recentDate);
    });
    it("should not be in the future", () => {
      // Add 1 "should be below or equal to"
      individual.timestamp.should.be.below(new Date().getTime() + 1);
    });
  });
  describe("generation", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be an identifier if defined", () => {
      expect(individual.generation).to.be.oneOf([undefined, "string"]);
    });
  });
  describe("population", () => {
    let individual;
    beforeEach(() => {
      individual = new Individual();
    });
    it("should be an identifier if defined", () => {
      expect(individual.population).to.be.oneOf([undefined, "string"]);
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
    it("should be given options through phenotype mutate", () => {
      individual.phenotype = {
        mutate: {
          name: "substitution",
          selection: g => g,
          lower: g => g * 1200,
          upper: g => g * 80
        }
      };
      expect(() => {
        individual.mutate();
      }).to.not.throw(Error);
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
      let parentsGenes = [parentIndividual]
        .concat(otherParentIndividual)
        .reduce((genes, { genome }) => {
          return genes.concat(genome);
        }, []);
      childIndividual.genome.forEach(gene =>
        gene.should.be.oneOf(parentsGenes)
      );
    });
    it("should be overriden by phenotype", () => {
      individual.phenotype = {
        crossover: {
          rate: g => g[2],
          min: g => g[1],
          max: g => g[0]
        }
      };
      let otherIndividual = new Individual();
      individual.genome.size = 3;
      (() => individual.crossover(otherIndividual)).should.not.throw(Error);
    });
  });
});
