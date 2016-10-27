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
          phenotype: (genome) => {},
          selection: (generation) => {},
          size: 200
        });
      }).should.not.throw(Error);
    })
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
    it("should create a new generation", () => {
    });
    it("should create new individuals", () => {
    });
    it("returns a generation number", () => {
    });
  });
});
