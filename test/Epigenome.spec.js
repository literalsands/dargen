import Mocha from "mocha";
import "babel-polyfill";
import { should, expect } from "chai";
import { Epigenome } from "../src/Epigenome";
import { GenomeBase } from "../src/GenomeBase";

describe("Epigenome", () => {
  let epigenome;
  beforeEach(() => {
    epigenome = new Epigenome([
      "color",
      "color",
      "color",
      "font.size",
      "font.lineHeight",
      "font.family",
      "font.family",
      "font.family"
    ]);
  });
  describe("constructor", () => {
    it("extends GenomeBase", () => {
      expect(new Epigenome()).to.be.instanceof(GenomeBase);
    });
    it("takes a second argument", () => {
      (() => {
        new Epigenome([], []);
      }).should.not.throw(Error);
    });
  });
  describe("json", () => {
    it("outputs a string", () => {
      JSON.stringify(epigenome).should.be.a("string");
    });
    it("should output a JSON array", () => {
      JSON.parse(JSON.stringify(epigenome)).should.be.an("array");
    });
    it("should parse to an equivalent epigenome", () => {
      let stringifiedEpigenome = JSON.stringify(epigenome);
      let parsedEpigenome = JSON.parse(stringifiedEpigenome);
      new Epigenome(parsedEpigenome).should.deep.equal(epigenome);
    });
    it("should not restore the alphabet", () => {
      epigenome.alphabet = ["newToken"];
      let stringifiedEpigenome = JSON.stringify(epigenome);
      let parsedEpigenome = JSON.parse(stringifiedEpigenome);
      new Epigenome(parsedEpigenome).should.not.deep.equal(epigenome);
    });
  });
  describe("mutate", () => {
    describe("substitution", () => {
      it("doesn't modify the epigenome", () => {
        let epigenomeCopy = epigenome.copy();
        expect(epigenome).to.eql(epigenomeCopy);
        expect(
          epigenome.mutate({
            name: "substitution",
            selection: 1
          })
        ).to.eql(epigenomeCopy);
      });
    });
    describe("increment", () => {
      it("doesn't modify the epigenome", () => {
        let epigenomeCopy = epigenome.copy();
        expect(epigenome).to.eql(epigenomeCopy);
        expect(
          epigenome.mutate({
            name: "increment",
            selection: 1,
            params: {
              increment: 0.4
            }
          })
        ).to.eql(epigenomeCopy);
      });
    });
    describe("decrement", () => {
      it("doesn't modify the epigenome", () => {
        let epigenomeCopy = epigenome.copy();
        expect(epigenome).to.eql(epigenomeCopy);
        expect(
          epigenome.mutate({
            name: "decrement",
            selection: 1,
            params: {
              decrement: 0.4
            }
          })
        ).to.eql(epigenomeCopy);
      });
    });
  });
  describe("copy", () => {
    it("returns a copy with ")
    it("returns a copy with the same alphabet", () => {
      epigenome.alphabet = ["A", "B", "C"];
      let epigenomeCopy = epigenome.copy();
      expect(epigenomeCopy.alphabet).to.eql(epigenome.alphabet);
      expect(epigenomeCopy).to.eql(epigenome);
    })
  })
  describe("getRandomGeneValue", () => {
    it("returns undefined if no alphabet is set", () => {
      expect(epigenome.getRandomGeneValue()).to.be.undefined;
    });
    it("returns an element from a set alphabet", () => {
      let alphabet = ["green", "red", "blue"];
      epigenome.alphabet = alphabet;
      expect(epigenome.getRandomGeneValue()).to.be.oneOf(alphabet);
    });
  });
  describe("alphabet", () => {
    it("can be set to an array", () => {
      expect(() => {
        epigenome.alphabet = [];
      }).to.not.throw(Error);
    });
    it("can be set to undefined", () => {
      expect(() => {
        epigenome.alphabet = undefined;
      }).to.not.throw(Error);
    });
    it("can't be set to a non array", () => {
      expect(() => {
        epigenome.alphabet = {};
      }).to.throw(Error);
      expect(() => {
        epigenome.alphabet = 5;
      }).to.throw(Error);
      expect(() => {
        epigenome.alphabet = "alphabet";
      }).to.throw(Error);
    });
    it("is an array", () => {
      expect(epigenome.alphabet).to.be.an("array");
    });
    it("is unique", () => {
      epigenome.alphabet = ["color", "font.size", "font.size"];
      let alphabet = ["color", "font.size", "font.lineHeight", "font.family"];
      expect(epigenome.alphabet).to.have.members(alphabet);
      expect(epigenome.alphabet.length).to.equal(alphabet.length);
    });
    it("contains all elements of the epigenome", () => {
      let alphabet = ["color", "font.size", "font.lineHeight", "font.family"];
      expect(epigenome.alphabet).to.include.members(alphabet);
    });
    it("contains all elements of the set alphabet", () => {
      let alphabet = [
        "new.color",
        "new.font.size",
        "new.font.lineHeight",
        "new.font.family"
      ];
      epigenome.alphabet = alphabet;
      expect(epigenome.alphabet).to.include.members(alphabet);
    });
  });
  describe("selection", () => {
    it("accepts a string argument", () => {
      expect(() => {
        epigenome.selection("string");
      }).to.not.throw(Error);
    });
    it("accepts a nested string argument", () => {
      expect(() => {
        epigenome.selection("string");
      }).to.not.throw(Error);
    });
    it("returns matching string positions", () => {
      expect(epigenome.selection("color")).to.eql([0, 1, 2]);
      expect(epigenome.selection("font.family")).to.eql([5, 6, 7]);
    });
  });
  describe("compile", () => {
    it("requires an argument", () => {
      expect(() => {
        epigenome.compile();
      }).to.throw(Error);
    });
    it("takes a genome", () => {
      expect(() => {
        epigenome.compile(new GenomeBase());
      }).to.not.throw(Error);
    });
    it("takes an array", () => {
      expect(() => {
        epigenome.compile(new GenomeBase());
      }).to.not.throw(Error);
    });
    it("returns an object", () => {
      expect(epigenome.compile([])).to.be.an("object");
    });
    it("returns an object mapping genome values to epigenome values by position", () => {
      expect(epigenome.compile(Array.from(epigenome.keys()))).to.eql({
        color: [0, 1, 2],
        "font.size": [3],
        "font.lineHeight": [4],
        "font.family": [5, 6, 7]
      });
    });
    it(
      "will give a warning if mismatched epigenome and genome sizes are encountered"
    );
  });
});
