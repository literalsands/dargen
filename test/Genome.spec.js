import "babel-polyfill";
import { should, expect } from "chai";
import { Genome } from "../src/Genome";
import { GenomeBase } from "../src/GenomeBase";

should();

// A Genome is the set of genes of an individual.
describe("Genome", () => {
  describe("constructor", () => {
    it("extends GenomeBase", () => {
      expect(new Genome()).to.be.instanceof(GenomeBase);
    })
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
    it("fills the array with random values", () => {
      let genome = new Genome();
      expect(genome[0]).to.be.undefined;
      genome.size = 1;
      expect(genome[0]).to.be.a("number");
    });
  });
  describe("mutate", () => {
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
  });
});
