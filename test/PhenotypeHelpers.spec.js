import "babel-polyfill";
import { should, expect } from "chai";
import PhenotypeHelpers from "../src/PhenotypeHelpers";

describe("PhenotypeHelpers", () => {
  describe("choose", () => {
    let { choose } = PhenotypeHelpers;
    it("is a function", () => {
      expect(choose).to.be.a("function");
    });
    it("takes an array as the first argument", () => {
      expect(() => {
        choose([]);
      }).to.not.throw(Error);
    });
    it("throws an error if not given an array", () => {
      expect(() => {
        choose();
      }).to.throw(Error);
      expect(() => {
        choose({});
      }).to.throw(Error);
    });
    it("returns a function", () => {
      expect(choose([])).to.be.a("function");
    });
    describe("return function", () => {
      it("takes a number from 0 to 1", () => {
        expect(() => {
          choose([])(0.5);
        }).to.not.throw(Error);
        expect(() => {
          choose(["a", "b"])(0.5);
        }).to.not.throw(Error);
      });
      it("returns an element from the given array", () => {
        expect(choose(["a"])(0.5)).to.equal("a");
      });
      it("returns an element from the given array if given 0", () => {
        expect(choose(["a"])(0)).to.equal("a");
      });
      it("returns an element from the given array if given 1", () => {
        expect(choose(["a"])(1)).to.equal("a");
      });
    });
  });
  describe("dynamic", () => {
    it("is a function");
    it("takes a function and an initial arity");
    it("is a function");
    describe("return function", () => {
      it("is a function");
      it("has a length");
      it("returns the same values as the given function");
    });
  });
});
