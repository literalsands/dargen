import "babel-polyfill";
import { should, expect } from "chai";
import { UnitVectorGenome } from "../src/UnitVectorGenome";

should();

describe("UnitVectorGenome", () => {
  describe("json", () => {
    let genome = new UnitVectorGenome(8, 4);
    it("outputs a string", () => {
      JSON.stringify(genome).should.be.a("string");
    });
    it("should output a JSON array", () => {
      JSON.parse(JSON.stringify(genome)).should.be.an("array");
    });
    it("should parse to an equivalent genome", () => {
      let stringifiedGenome = JSON.stringify(genome);
      let parsedGenome = JSON.parse(stringifiedGenome);
      new UnitVectorGenome(parsedGenome).should.deep.equal(genome);
    });
  });
  describe("size", () => {
    it("fills the array with random values", () => {
      let genome = new UnitVectorGenome();
      expect(genome[0]).to.be.undefined;
      genome.size = 1;
      expect(genome[0]).to.be.a("array");
      expect(genome[0][0]).to.be.a("number");
    });
  });
  describe("copy", () => {
    it("is provided and is a function", () => {
      let genome = new UnitVectorGenome(6);
      expect(genome.copy).to.be.a('function');
      expect(() => {
        genome.copy();
      }).to.not.throw(Error);
    })
    it("returns a deep copy", () => {
      let genome = new UnitVectorGenome(6);
      let genomeCopy = genome.copy();
      expect(genome).to.eql(genomeCopy);
      genome[0][0] = 1;
      expect(genome).to.not.eql(genomeCopy);
    });
  })
  describe("mutate", () => {
    describe("rotate", () => {
      it("is provided", () => {
        let genome = new UnitVectorGenome(4);
        let genomeCopy = genome.copy();
        genome.mutate({
          name: "rotate",
          selection: 0
        });
        expect(genome).to.deep.equal(genomeCopy);
        genome.mutate({
          name: "rotate",
          selection: 1
        });
        expect(genome).to.not.deep.equal(genomeCopy);
      });
      it("rotates vectors in a fixed direction", () => {
        let genome = new UnitVectorGenome([[0.5, 1, 0]]);
        genome.mutate({
          name: "rotate",
          selection: 1,
          params: { direction: [1, 1, 1], rotations: 0.25 }
        });
        expect(genome).to.eql(new UnitVectorGenome([[0.75, 0.25, 0.25]]));
      });
    });
  });
});
