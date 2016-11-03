// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created Janurary 3rd, 2015

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
          phenotype: (genome) => { },
          // To initialize generation.
          strategies: { },
          size: 200,
          selection: (population) => {},
          removal: (population) => {}
        });
      }).should.not.throw(Error);
    })
    it("takes a population as an argument", () => {
    });
    it("requires arguments", () => {
      (() => {
        new Population();
      }).should.throw(Error);
    });
  });
  describe("json", () => {
  });
  describe("identifier", () => {
    it("should be a unique string", () => {
    });
  });
  describe("evolve", () => {
    it("should apply selection and removal to create a new generation", () => {
    });
    it("should create a new generation", () => {
    });
    it("should create new individuals", () => {
    });
    it("returns a generation number", () => {
    });
  });
});
