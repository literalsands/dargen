import 'babel-polyfill';
import {should, expect} from 'chai';
import { Population } from '../src/Population';

should();

describe("Population", () => {
  describe("constructor", () => {
    it("takes an object as an argument", () => {
      (() => {
        new Population({
          // To Initialize individuals.
          phenotype: {
            mutate: {
              substitution: [0.01, 0.05, 0.06, 0.065, 0.07]
            }
          },
          // To initialize generation.
          size: 200
        });
      }).should.not.throw(Error);
    })
    it("takes a population as an argument");
    it("requires arguments", () => {
      (() => {
        new Population();
      }).should.throw(Error);
    });
  });
  describe("json", () => {
  });
  describe("identifier", () => {
    it("should be a unique string");
  });
  describe("fossilize", () => {
    it("is a function")
    it("returns an array")
    it("returns an array of individuals")
    it("returns an array of deeply copied individuals")
  })
  describe("evolve", () => {
    it("should apply selection and removal to create a new generation");
    it("should create a new generation");
    it("should create new individuals");
    it("returns a generation number");
  });
});
