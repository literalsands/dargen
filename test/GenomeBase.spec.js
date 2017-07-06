import "babel-polyfill";
import { should, expect } from "chai";
import { GenomeBase } from "../src/GenomeBase";

describe("GenomeBase", () => {
  describe("constructor", () => {
    it("does not require arguments", () => {
      (() => {
        new GenomeBase();
      }).should.not.throw(Error);
    });
    it("takes an array as an argument", () => {
      (() => {
        new GenomeBase([1, 0.4, null, "Grape"]);
      }).should.not.throw(Error);
    });
    it("takes a number as an argument", () => {
      (() => {
        new GenomeBase(8);
      }).should.not.throw(Error);
    });
  })
  describe("size", () => {
    it("truncates the genome", () => {
      let genome = new GenomeBase(2);
      expect(genome[1]).to.be.not.undefined;
      genome.size = 1;
      expect(genome[1]).to.be.undefined;
    });
    it("equals the length", () => {
      let genome = new GenomeBase(2);
      genome.length.should.equal(genome.size);
    });
  });
  describe("selection", () => {
    let genome, selection;
    beforeEach(() => {
      genome = new GenomeBase(5);
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
  class NormalGenome extends GenomeBase {
    getRandomGeneValue() {
      return Math.random();
    }
  }
  describe("mutate", () => {
    let genome;
    beforeEach(() => {genome = new NormalGenome();})
    it("modifies the parent", () => {
      genome.size = 2
      let genomeCopy = genome.copy();
      let mutatedGenome = genome.mutate({
        name: "substitution",
        selection: { rate: 1 }
      });
      genome.should.not.deep.equal(genomeCopy);
      genome.should.deep.equal(mutatedGenome);
    });
    it("does not modify the parent when asked", () => {
      genome.size = 2
      let genomeCopy = genome.copy();
      let mutatedGenome = genome.mutate({
        name: "substitution",
        selection: { rate: 1 },
        modify: false
      });
      genome.should.deep.equal(genomeCopy);
      genome.should.not.deep.equal(mutatedGenome);
    });
    describe("substitution", () => {
      it("is provided", () => {
        genome.size = 2
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
        genome.size = 2
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
    it("never allows size to become greater than upper", () => {
      genome.size = 4
      genome.mutate({
        name: "duplication",
        selection: 1,
        upper: 6
      });
      genome.size.should.equal(6);
    });
    });
    describe("inverse", () => {
      it("is provided", () => {
        genome.size = 2
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
        genome.size = 4
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
        genome.size = 4
        genome.mutate({
          name: "deletion",
          selection: 1
        });
        genome.size.should.equal(1);
      });
      it("removes all elements to the lower bound", () => {
        genome.size = 4
        genome.mutate({
          name: "deletion",
          selection: 1,
          lower: 4
        });
        genome.size.should.equal(4);
      });
      it("doesn't trigger replacement for lower bound protected elements", () => {
        genome.size = 4
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "deletion",
          selection: 1,
          lower: 4
        });
        expect(genome).to.eql(genomeCopy);
      });
    });
  });
  describe("crossover", () => {
    let genome;
    beforeEach(() => {genome = new NormalGenome();})
    it("does not modify the parent", () => {
      genome.size = 2
      let otherGenome = genome.copy().fillRandom()
      let childGenome = genome.crossover({}, otherGenome);
      genome.should.not.deep.equal({}, otherGenome);
      genome.should.not.equal(childGenome);
    });
    it("should take a single mate", () => {
      genome.size = 2
      let otherGenome = genome.copy().fillRandom()
      let childGenome;
      (() => {
        childGenome = genome.crossover(
          { selection: 0.5 },
          otherGenome
        );
      }).should.not.throw(Error);
      childGenome[0].should.be.oneOf([genome[0], otherGenome[0]]);
      childGenome[1].should.be.oneOf([genome[1], otherGenome[1]]);
    });
    it("should take multiple mates", () => {
      genome.size = 4
      let genomeA = genome.copy().fillRandom()
      let genomeB = genome.copy().fillRandom()
      genomeB.size = 2
      let genomeC = genome.copy().fillRandom()
      genomeC.size = 3
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
    let genome;
    beforeEach(() => {genome = new NormalGenome();})
    it("is an instance of GenomeBase", () => {
      expect(genome).is.instanceof(GenomeBase);
    })
    it("is not the same object", () => {
      genome.size = 2
      let genomeCopy = genome.copy();
      expect(genome).to.not.equal(genomeCopy);
    });
    it("is equal to the original", () => {
      genome.size = 2
      let genomeCopy = genome.copy();
      expect(genome).to.deep.equal(genomeCopy);
    });
  });
  describe("howSimilar", () => {
    let genome;
    beforeEach(() => {genome = new NormalGenome();})
    it("should be a function", () => {
      expect(genome.howSimilar).to.be.a("function");
    });
    it("requires an argument", () => {
      (() => {
        genome.howSimilar();
      }).should.throw(Error);
    });
    it("takes a single array-like argument", () => {
      (() => {
        genome.howSimilar([]);
      }).should.not.throw(Error);
    });
    it("will return 1 if given self", () => {
      expect(genome.howSimilar(genome)).to.equal(1);
      genome.size = 30;
      expect(genome.howSimilar(genome)).to.equal(1);
    });
    it("will return 0 if given an empty genome", () => {
      genome.size = 30
      expect(genome.howSimilar([])).to.equal(0);
    });
    it("will return 0 if genome is empty and given genome is non-empty", () => {
      expect(genome.howSimilar([0, 1])).to.equal(0);
    })
    it("will return 1 if genome and given genome are empty", () => {
      expect(genome.howSimilar([])).to.equal(1);
    })
    it("will return between 0 and 1 if given a crossover genome", () => {
      genome.size = 100
      let genomeMate = genome.copy().fillRandom();
      let genomeChild = genome.crossover({ selection: 0.5 }, [genomeMate]);
      expect(genomeChild.howSimilar(genome)).to.be.below(1);
      expect(genomeChild.howSimilar(genome)).to.be.above(0);
      expect(genomeChild.howSimilar(genomeMate)).to.be.below(1);
      expect(genomeChild.howSimilar(genomeMate)).to.be.above(0);
    });
    it("will add up to 1 when compared from a child to both parents", () => {
      genome.size = 100
      let genomeMate = genome.copy().fillRandom();
      let genomeChild = genome.crossover({ crossover: 0.5 }, genomeMate);
      expect(
        genomeChild.howSimilar(genome) + genomeChild.howSimilar(genomeMate)
      ).to.equal(1);
    });
  });
});
