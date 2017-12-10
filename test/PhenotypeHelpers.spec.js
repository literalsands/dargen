import "babel-polyfill";
import { should, expect } from "chai";
import * as PhenotypeHelpers from "../src/PhenotypeHelpers";

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
  describe("arity", () => {
    let {arity} = PhenotypeHelpers;
    it("is a function", () => {
      expect(arity).to.be.a('function')
    });
    it("takes an integer and a function", () => {
      expect(() => {
        arity(3, function() {});
      }).to.not.throw(Error);
    });
    it("throws an error if not given an integer and a function", () => {
      expect(() => {
        arity();
      }).to.throw(Error);
      expect(() => {
        arity(3);
      }).to.throw(Error);
      expect(() => {
        arity(function(){});
      }).to.throw(Error);
      expect(() => {
        arity(null, function(){});
      }).to.throw(Error);
    })
    describe("return function", () => {
      it("is a function", () => {
        expect(arity(2, function(){})).to.be.a('function')
      });
      it("has a length", () => {
        expect(arity(2, function(){})).has.property('length')
      });
      it("has the set length", () => {
        expect(arity(2, function(){})).has.property('length', 2)
      })
      it("has the set length despite arguments", () => {
        expect(arity(2, function(a, b, c, d){})).has.property('length', 2)
      })
      it("returns the same values as the given function", () => {
        let func = function(a, b) {return a + b;}
        let aFunc = arity(4, func)
        expect(func(1, 2)).to.equal(aFunc(1, 2));
        expect(func(3, 2)).to.equal(aFunc(3, 2));
        expect(func(1, 3)).to.equal(aFunc(1, 3));
      });
    });
  });
});
