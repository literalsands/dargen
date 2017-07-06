import "babel-polyfill";
import { should, expect } from "chai";
import { Genome } from "../src/Genome";
import doctest from "jsdoc-test";

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
        new Genome([1, 0.4]);
      }).should.not.throw(Error);
    });
    it("takes a number as an argument", () => {
      (() => {
        new Genome(8);
      }).should.not.throw(Error);
    });
  });
  describe("json", () => {
    let genome = new Genome(8);
    it("outputs a string", () => {
      JSON.stringify(genome).should.be.a("string");
    });
    it("should output a JSON array", () => {
      JSON.parse(JSON.stringify(genome)).should.be.an("array");
    });
    it("should parse to an equivalent genome", () => {
      let stringifiedGenome = JSON.stringify(genome);
      let parsedGenome = JSON.parse(stringifiedGenome);
      new Genome(parsedGenome).should.deep.equal(genome);
    });
  });
  describe("size", () => {
    it("truncates the genome", () => {
      let genome = new Genome(2);
      expect(genome[1]).to.be.a("number");
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
      expect(genome[0]).to.be.a("number");
    });
  });
  describe("selection", () => {
    let genome, selection;
    beforeEach(() => {
      genome = new Genome(5);
      selection = [0, 1, 2, 3, 4];
    });
    it("does not modify the parent", () => {
      let genomeCopy = genome.copy();
      genome.selection();
      expect(genome).to.eql(genomeCopy);
      genome.selection(0);
      expect(genome).to.eql(genomeCopy);
      genome.selection(1);
      expect(genome).to.eql(genomeCopy);
      genome.selection({ rate: 0.5 });
      expect(genome).to.eql(genomeCopy);
      genome.selection({ start: 3 });
      expect(genome).to.eql(genomeCopy);
      genome.selection({ stop: 3 });
      expect(genome).to.eql(genomeCopy);
      genome.selection({ selection: 3 });
      expect(genome).to.eql(genomeCopy);
      genome.selection({ selection: [1, 2, 3, 8, 10] });
      expect(genome).to.eql(genomeCopy);
    });
    it("returns all keys if no arguments given", () => {
      expect(genome.selection()).to.eql(selection);
      expect(genome.selection({})).to.eql(selection);
      expect(genome.selection({ selection: undefined })).to.eql(selection);
      expect(genome.selection({ selection: {} })).to.eql(selection);
    });
    describe("rate", () => {
      it("returns all keys if rate is 1", () => {
        expect(genome.selection(1)).to.eql(selection);
      });
      it("returns no keys if rate is 0", () => {
        expect(genome.selection(0)).to.eql([]);
      });
      it("returns some or no keys if rate is between 0 and 1", () => {
        // TODO:Revise
        // Is there a better way to write a test like this?
        expect(genome.selection(0.5).length).to.be.within(0, 5);
      });
    });
    describe("selection", () => {
      it("returns truncated selection if given out of bounds selection array", () => {
        expect(genome.selection([-1, 4, 6, 25])).to.eql([4]);
      });
      it("returns selection if given in bounds selection array", () => {
        expect(genome.selection([3, 4])).to.eql([3, 4]);
      });
    });
    describe("region", () => {
      it("returns all positions in region", () => {
        expect(genome.selection({ start: 0, stop: 5 })).to.eql(selection);
        expect(genome.selection({ start: 0, stop: 4 })).to.eql(
          selection.slice(0, 4)
        );
      });
      it("returns some positions in region when given rate", () => {
        expect(
          genome.selection({ start: 3, stop: 4, rate: 0.5 }).length
        ).to.be.within(0, 2);
      });
      it("returns region and selection intersection", () => {
        expect(
          genome.selection({ start: 3, stop: 4, selection: [1, 3, 5, 7] })
        ).to.eql([3]);
      });
    });
  });
  describe("mutate", () => {
    it("modifies the parent", () => {
      let parentGenome = new Genome(2);
      let genomeCopy = parentGenome.copy();
      let mutatedGenome = parentGenome.mutate({
        name: "substitution",
        selection: { rate: 1 }
      });
      parentGenome.should.not.deep.equal(genomeCopy);
      parentGenome.should.deep.equal(mutatedGenome);
    });
    it("does not modify the parent when asked", () => {
      let parentGenome = new Genome(2);
      let genomeCopy = parentGenome.copy();
      let mutatedGenome = parentGenome.mutate({
        name: "substitution",
        selection: { rate: 1 },
        modify: false
      });
      parentGenome.should.deep.equal(genomeCopy);
      parentGenome.should.not.deep.equal(mutatedGenome);
    });
    describe("substitution", () => {
      it("is provided", () => {
        let genome = new Genome(2);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "substitution",
          selection: 0
        });
        genome.should.deep.equal(genomeCopy);
        genome.mutate({
          name: "substitution",
          selection: 1
        });
        genome.should.not.deep.equal(genomeCopy);
      });
    });
    describe("duplication", () => {
      it("is provided", () => {
        let genome = new Genome(2);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "duplication",
          selection: 0
        });
        genome.should.deep.equal(genomeCopy);
        genome.mutate({
          name: "duplication",
          selection: 1
        });
        genome.size.should.equal(4);
        genome[0].should.equal(genome[2]);
        genome[1].should.equal(genome[3]);
      });
    });
    describe("inverse", () => {
      it("is provided", () => {
        let genome = new Genome(2);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "inversion",
          selection: 0
        });
        genome.should.deep.equal(genomeCopy);
        genome.mutate({
          name: "inversion",
          selection: 1
        });
        genome.size.should.equal(2);
        genome.should.deep.equal(genomeCopy.reverse());
      });
    });
    describe("deletion", () => {
      it("is provided", () => {
        let genome = new Genome(4);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "deletion",
          selection: 0
        });
        expect(genome).to.deep.equal(genomeCopy);
        genome.mutate({
          name: "deletion",
          selection: 1
        });
        expect(genome).to.not.deep.equal(genomeCopy);
      });
      it("removes all elements to the required 1", () => {
        let genome = new Genome(4);
        genome.mutate({
          name: "deletion",
          selection: 1
        });
        genome.size.should.equal(1);
      });
      it("removes all elements to the lower bound", () => {
        let genome = new Genome(4);
        genome.mutate({
          name: "deletion",
          selection: 1,
          lower: 4
        });
        genome.size.should.equal(4);
      });
      it("doesn't trigger replacement for lower bound protected elements", () => {
        let genome = new Genome(4);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "deletion",
          selection: 1,
          lower: 4
        });
        expect(genome).to.eql(genomeCopy);
      });
    });
    describe("decrement", () => {
      it("is provided", () => {
        let genome = new Genome(4);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "decrement",
          selection: 0,
          params: { decrement: 0.05 }
        });
        expect(genome).to.deep.equal(genomeCopy);
        genome.mutate({
          name: "decrement",
          selection: 1,
          params: { decrement: 0.05 }
        });
        expect(genome).to.not.deep.equal(genomeCopy);
      });
      it("moves values a fixed amount toward zero", () => {
        let genome = new Genome([0.5, 1]);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "decrement",
          selection: 1,
          params: { decrement: 0.05 }
        });
        expect(genome).to.eql([0.45, 0.95]);
      });
      it("stays between the values of 0 and 1", () => {
        let genome = new Genome(12);
        genome.mutate({
          name: "decrement",
          selection: 1,
          params: { decrement: 0.7 }
        });
        genome.forEach(gene => expect(gene).to.be.within(0, 1));
      });
      it("changes value to 0 or 1 if value would pass 0 or 1 and is not that number", () => {
        let genome = new Genome(12);
        genome.mutate({
          name: "decrement",
          selection: 1,
          params: { decrement: 1 }
        });
        genome.forEach(gene => expect(gene).to.be.oneOf([1, 0]));
      });
    });
    describe("increment", () => {
      it("is provided", () => {
        let genome = new Genome(4);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "increment",
          selection: 1,
          params: { increment: 0.05 }
        });
        expect(genome).to.not.deep.equal(genomeCopy);
      });
      it("doesn't change the genome on null selection", () => {
        let genome = new Genome(4);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "increment",
          selection: 0,
          params: { increment: 0.05 }
        });
        expect(genome).to.deep.equal(genomeCopy);
      });
      it("moves values a fixed amount toward 1", () => {
        let genome = new Genome([0.5, 0]);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "increment",
          selection: 1,
          params: { increment: 0.05 }
        });
        expect(genome).to.deep.equal([0.55, 0.05]);
      });
      it("stays between the values of 0 and 1", () => {
        let genome = new Genome(12);
        genome.mutate({
          name: "increment",
          selection: 1,
          params: { increment: 0.7 }
        });
        genome.forEach(gene => expect(gene).to.be.within(0, 1));
      });
      it("changes value to 0 or 1 if value would pass 0 or 1 and is not that number", () => {
        let genome = new Genome(12);
        genome.mutate({
          name: "increment",
          selection: 1,
          params: { increment: 1 }
        });
        genome.forEach(gene => expect(gene).to.be.oneOf([1, 0]));
      });
    });
    it("provides gravity");
    it("provides fuzzy mutations");
    it("provides computed gradient mutation");
    it("never allows size to become greater than upper", () => {
      let genome = new Genome(4);
      console.log(genome.mutations);
      genome.mutate({
        name: "duplication",
        selection: 1,
        upper: 6
      });
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
    it("should take a single mate", () => {
      let parentGenome = new Genome(2);
      let otherParentGenome = new Genome(2);
      let childGenome;
      (() => {
        childGenome = parentGenome.crossover(
          { selection: 0.5 },
          otherParentGenome
        );
      }).should.not.throw(Error);
      childGenome[0].should.be.oneOf([parentGenome[0], otherParentGenome[0]]);
      childGenome[1].should.be.oneOf([parentGenome[1], otherParentGenome[1]]);
    });
    it("should take multiple mates", () => {
      let genomeA = new Genome(4);
      let genomeB = new Genome(2);
      let genomeC = new Genome(3);
      let childGenome;
      (() => {
        childGenome = genomeA.crossover({ selection: 1 }, [genomeB, genomeC]);
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
      let genomeCopy = genome.copy();
      genome.should.not.equal(genomeCopy);
    });
    it("is equal to the original", () => {
      let genome = new Genome(2);
      let genomeCopy = genome.copy();
      genome.should.deep.equal(genomeCopy);
    });
  });
  describe("howSimilar", () => {
    it("should be a function", () => {
      let genome = new Genome(30);
      expect(genome.howSimilar).to.be.a("function");
    });
    it("requires an argument", () => {
      let genome = new Genome(30);
      (() => {
        genome.howSimilar();
      }).should.throw(Error);
    });
    it("takes a single array-like argument", () => {
      let genome = new Genome(30);
      (() => {
        genome.howSimilar([]);
      }).should.not.throw(Error);
    });
    it("will return 1 if given self", () => {
      let genome = new Genome(30);
      expect(genome.howSimilar(genome)).to.equal(1);
    });
    it("will return 0 if given an empty genome", () => {
      let genome = new Genome(30);
      expect(genome.howSimilar([])).to.equal(0);
    });
    it("will return between 0 and 1 if given a crossover genome", () => {
      let genome = new Genome(100);
      let genomeMate = new Genome(100);
      let genomeChild = genome.crossover({ selection: 0.5 }, [genomeMate]);
      expect(genomeChild.howSimilar(genome)).to.be.below(1);
      expect(genomeChild.howSimilar(genome)).to.be.above(0);
      expect(genomeChild.howSimilar(genomeMate)).to.be.below(1);
      expect(genomeChild.howSimilar(genomeMate)).to.be.above(0);
    });
    it("will add up to 1 when compared from a child to both parents", () => {
      let genome = new Genome(100);
      let genomeMate = new Genome(100);
      let genomeChild = genome.crossover({ crossover: 0.5 }, genomeMate);
      expect(
        genomeChild.howSimilar(genome) + genomeChild.howSimilar(genomeMate)
      ).to.equal(1);
    });
  });
});
