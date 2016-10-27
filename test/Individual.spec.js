// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
// First created Janurary 3rd, 2015

import 'babel-polyfill';
import {should, expect} from 'chai';
import { Individual } from '../src/Individual';

should();

describe("Individual", () => {
  describe("constructor", () => {
    it("takes an object argument", () => {
    });
    it("requires arguments", () => {
      (() => {
        new Individual();
      }).should.throw(Error);
    });
  });
  describe("json", () => {
  });
  describe("genome", () => {
    it("should be a genome", () => {
    });
  });
  describe("phenotype", () => {
    it("should take a function", () => {
    });
    it("should take an object of functions", () => {
    });
    it("should take an object of arrays", () => {
    });
    it("should take an object of arrays and functions", () => {
    });
  });
  describe("traits", () => {
    it("should return an object", () => {
    });
    it("should return genome if no phenotype is set", () => {
    });
  });
  describe("evaluate", () => {
    it("should take a function", () => {
    });
  });
  describe("identifier", () => {
    it("should be a string", () => {
    });
    it("should be unique to genome", () => {
    });
  });
  describe("parent", () => {
    it("should be a string", () => {
    });
  });
  describe("timestamp", () => {
    it("should be a datetime", () => {
    });
    it("should be a recent datetime", () => {
    });
  });
  describe("generation", () => {
    it("should be a number", () => {
    });
  });
  describe("population", () => {
    it("should be a unique string", () => {
    });
  });
  describe("mutation", () => {
    it("should have a default function", () => {
    });
    it("should be overriden by phenotype", () => {
    });
  });
  describe("crossover", () => {
    it("should be a string", () => {
    });
  });
  describe("copy", () => {
    it("is not the same object", () => {
      var individual = new Indvidual(2);
      var copiedIndvidual = individual.copy();
      individual.should.not.equal(copiedIndvidual);
    });
    it("is equal to the original", () => {
      var individual = new Indvidual(2);
      var copiedIndvidual = individual.copy();
      individual.should.deep.equal(copiedIndvidual);
    });
  });
});
