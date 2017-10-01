import 'babel-polyfill';
import {should, expect} from 'chai';
import { Generation } from '../src/Generation';
import { Population } from  '../src/Population';

should();

describe("Generation", () => {
  let generation, population;
  describe("constructor", () => {
    it("takes a strategy pipeline")
    it("takes a population", () => {
      let population = new Population()
      expect(() => {
        generation.evolve(population)
      }).to.not.throw(Error)
    })
    it("alternatively, takes an array of individuals")
    it("requires a first argument")
  })
  describe("selection", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {})
    })
    it("is a function", () => {
      expect(generation.selection).to.be.a("function")
    })
    it("takes a list of individuals")
    it("takes an options object")
    it("returns array of integers");
  })
  describe("sort", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {})
    })
    it("is a function", () => {
      expect(generation.sort).to.be.a("function")
    })
    it("returns an array");
    it("takes an options object")
  });
  describe("crossover", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {})
    })
    it("is a function", () => {
      expect(generation.crossover).to.be.a("function")
    })
    it("returns an array");
    it("takes a two selection arrays and the individuals")
  });
  describe("mutate", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {})
    })
    it("is a function", () => {
      expect(generation.mutate).to.be.a("function")
    })
    it("returns an array")
    it("takes a selection array and the individuals")
  });
  describe("remove", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {})
    })
    it("is a function", () => {
      expect(generation.remove).to.be.a("function")
    })
    it("returns an array")
    it("takes a selection array and the individuals")
  })
  describe("duplicate", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {})
    })
    it("is a function", () => {
      expect(generation.duplicate).to.be.a("function")
    })
    it("returns an array")
    it("takes a selection array and the individuals")
  })
});
