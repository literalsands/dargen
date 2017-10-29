import { Population } from "../src/Population";
import { Individual } from "../src/Individual";
describe("Population", () => {
  let population;
  let nullStrategy = function() {};
  beforeEach(() => {
    population = new Population();
  });

  describe("constructor", () => {
    let proto = new Individual({
      phenotype: {
        value: (a, b, c, d) => a * b * c * d
      }
    });
    it("requires an argument", () => {
      expect(() => {
        new Population();
      }).to.throw(Error);
    });
    it("takes an object as an argument", () => {
      expect(() => {
        new Population({
          proto,
          individuals: 200
        });
      }).to.not.throw(Error);
    });
    it("takes a population as an argument", () => {
      expect(() => {
        new Population(
          new Population({
            proto,
            individuals: 200
          })
        );
      }).to.not.throw(Error);
    });
    it("takes a deserialized population as an argument", () => {
      expect(() => {
        new Population(
          JSON.parse(
            JSON.stringify(
              new Population({
                proto,
                individuals: 200
              })
            )
          )
        );
      }).to.not.throw(Error);
    });

    describe("options", () => {
      it("should take a proto individual", () => {
        expect(() => {
          new Population({
            proto,
            individuals: 200
          });
        }).to.not.throw(Error);
      });
      it("requires a number of inidividuals with proto individual", () => {
        expect(() => {
          new Population({
            proto,
          });
        }).to.throw(Error);
      });
      it("should take individuals", () => {
        expect(() => {
          new Population({
            individuals: [proto]
          });
        }).to.not.throw(Error);
      });
      it("should take an identifier", () => {
        expect(() => {
          new Population({
            identifier: "POPTEST",
            individuals: [proto]
          });
        }).to.not.throw(Error);
      });
      it("requires a proto individuals or individuals", () => {
        expect(() => {
          new Population({
            individuals: 200
          });
        }).to.throw(Error);
        expect(() => {
          new Population({
            individuals: []
          });
        }).to.throw(Error);
        expect(() => {
          new Population({
          });
        }).to.throw(Error);
      })
    });
  });

  describe("generate", () => {
  });

  describe("identifier", () => {
    it("should be a string");
    it("can be assigned through the contructor");
    it("can be omitted from the constructor");
    it("will be assigned if not given to the constructor");
  });

  describe("fossilize", () => {
    it("is a function");
    it("returns an array");
    it("returns an array of individuals");
    it("returns an array of deeply copied individuals");
  });

  describe("evolve", () => {
    it("returns the mutated population", () => {
      let evolved = population.evolve(nullStrategy);
      expect(evolved).to.be.instanceof(Population);
      expect(evolved).to.be.eql(population);
    });
    it("takes an evolution strategy pipeline");
    describe("strategy pipeline", () => {
      it("applies pipeline strategy operations to the population", () => {});
    });
    it("takes an evoultion stategy function");
    describe("strategy function", () => {
      it("applies pipeline function operations to the population", () => {});
    });
  });

  describe("selection", () => {
    // Should selection return a list of indexes, or should it return a list of individuals?
    it("is a function", () => {
      expect(generation.selection).to.be.a("function");
    });
    it("returns array of integers", () => {
      let ret = generation.selection(population.individuals, {});
      expect(ret).to.be.an("array");
      ret.map(int => {
        expect(Number.isSafeInteger(int)).to.true;
      });
    });
    it("takes an options object", () => {
      expect(function() {
        generation.selection(population, {});
      }).to.not.throw(Error);
    });

    describe("options", () => {
      describe("name", () => {
        it("saves selection under a name");
      });

      describe("groups", () => {
        it("takes a number");
        it("takes a boolean");
        it("assumes a groups value if given true");
        // In order to get a sorted group, you must apply two selections.
        it("sorts before grouping");
        it("nests groups");
      });

      describe("size", () => {
        it("takes a number");
        it("assumes a size value if given groups number");
        it("limits selection to a number of individuals");
        it("limits selection to a number of individuals per group");
      });

      describe("sort", () => {
        it("takes a sort object");
        it("gracefully combines with group options");
      });
    });
  });

  describe("operation", () => {
    it("requires a string or function argument");
    it("takes a selection or selection options");
    it("returns a set of changed, removed, or inserted individuals");
  });

  describe("sort", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {});
    });
    it("is a function", () => {
      expect(generation.sort).to.be.a("function");
    });
    it("returns an array of individuals");
    it("takes an options object");
  });

  describe("crossover", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {});
    });
    it("is a function", () => {
      expect(generation.crossover).to.be.a("function");
    });
    it("returns an array");
    it("takes a two selection arrays and the individuals");
  });

  describe("mutate", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {});
    });
    it("is a function", () => {
      expect(generation.mutate).to.be.a("function");
    });
    it("returns an array");
    it("takes a selection array and the individuals");
  });

  describe("remove", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {});
    });
    it("is a function", () => {
      expect(generation.remove).to.be.a("function");
    });
    it("returns an array");
    it("takes a selection array and the individuals");
  });

  describe("duplicate", () => {
    beforeEach(() => {
      generation = new Generation({}, () => {});
    });
    it("is a function", () => {
      expect(generation.duplicate).to.be.a("function");
    });
    it("returns an array");
    it("takes a selection array and the individuals");
  });
});
