import "babel-polyfill";
import { should, expect } from "chai";
import { Epigenome } from "../src/Epigenome"
import { GenomeBase } from "../src/GenomeBase";

describe("Epigenome", () => {
  let epigenome;
  beforeEach(() => {
    epigenome = new Epigenome([
      'color',
      'color',
      'color',
      'font.size',
      'font.lineHeight',
      'font.family',
      'font.family',
      'font.family'
    ]);
  });
  describe("constructor", () => {
    it("extends GenomeBase", () => {
      expect(new Epigenome()).to.be.instanceof(GenomeBase);
    })
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
  });
  describe("mutate", () => {
    it("modifies the epigenome")
    it("doesn't modify the epigenome when asked")
    describe("substitution", () => {
      it("doesn't modify the epigenome")
    })
    describe("duplication", () => {
      it("modifies the epigenome")
      it("increases the occurrence of duplicated genes")
    })
    describe("inverse", () => {
      it("modifies the epigenome")
      it("doesn't change the occurrence of inverted genes")
    })
    describe("deletion", () => {
      it("modifies the epigenome")
      it("decreases the occurrence of deleted genes")
    })
    describe("icrementation", () => {
      it("doesn't modify the epigenome")
    })
    describe("gravity", () => {
      it("doesn't modify the epigenome")
    })
    describe("fuzzy mutations", () => {
      it("doesn't modify the epigenome")
    })
    describe("computed gradient mutations", () => {
      it("doesn't modify the epigenome")
    })
  });
  describe("crossover", () => {
    it("produces a modified epigenome when parent epigenome's crossover position values differ.")
    it("simply copies the epigenome when parents crossover positions are identical")
  });
});
