import {expect} from "chai";
import { Population } from "../src/Population";
import { Individual } from "../src/Individual";
describe("Population", () => {
  let population;
  let nullStrategy = function() {};
  beforeEach(() => {
    population = new Population({
      proto: {
        phenotype: (a, b, c) => [a, b, c]
      },
      individuals: 10
    });
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
            proto
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
          new Population({});
        }).to.throw(Error);
      });
    });
  });

  describe("identifier", () => {
    it("should be a string", () => {
      expect(population.identifier).to.be.a("string");
    });
    it("can be assigned through the contructor", () => {
      let population = new Population({ ...population, identifier: "POPTEST" });
      expect(population.identifier).to.eql("POPTEST");
    });
    it("can be omitted from the constructor", () => {
      expect(() => {
        new Population({ ...population, identifier: undefined });
      }).to.not.throw(Error);
    });
    it("will be assigned if not given to the constructor", () => {
      let population = new Population({ ...population, identifier: undefined });
      expect(population.identifier).to.be.a("string");
    });
  });

  describe("fossilize", () => {
    it("is a function", () => {
      expect(population.fossilize).to.be.a("function");
    });
    describe("return object", () => {
      it("includes an array of individuals", () => {
        let fossilized = population.fossilize();
        expect(fossilized).to.be.an("object");
        expect(fossilized.individuals).to.be.an("array");
        expect(fossilized.individuals[0]).to.be.instanceof(Individual);
      });
      it("includes an array of deeply copied individuals", () => {
        let fossilized = population.fossilize();
        expect(fossilized.individuals).to.eql(population.individuals);
        expect(fossilized.individuals).to.not.equal(population.individuals);
        fossilized.individuals.forEach((fossil, i) => {
          expect(fossil).to.eql(population.individuals[i]);
          expect(fossil).to.not.equal(population.individuals[i]);
        });
      });
      it("includes an array of immutable deeply copied individuals", () => {
        let fossilized = population.fossilize();
        expect(() => {
          fossilized.individuals.push(new Individual());
        }).to.throw(Error);
        fossilized.individuals.forEach((fossil, i) => {
          expect(() => {
            fossil.phenotype = {};
          }).to.throw(Error);
        });
      });
    });
  });

  describe("evolve", () => {
    let pipeline = [
      {
        selection: true,
        operation: "remove"
      }
    ];
    it("returns the mutated population", () => {
      let evolved = population.evolve(nullStrategy);
      expect(evolved).to.be.instanceof(Population);
      expect(evolved).to.be.equal(population);
    });
    it("requires a first argument", () => {
      expect(() => {
        population.evolve();
      }).to.throw(Error);
      expect(() => {
        population.evolve(() => {});
      }).to.not.throw(Error);
    });
    it("takes an evolution strategy pipeline", () => {
      expect(() => {
        population.evolve(pipeline);
      }).to.not.throw(Error);
    });
    describe("strategy pipeline", () => {
      it("applies some pipeline strategy operation to the population", () => {
        let emptyPopulation = population.evolve(pipeline);
        expect(emptyPopulation.individuals.length).to.be(0);
      });
    });
    it("takes an evolution strategy function", () => {
      expect(() => {
        population.evolve(population => {
          population.mutate(true);
        });
      }).to.not.throw(Error);
    });
    describe("strategy function", () => {
      it("applies some pipeline function operation to the population", () => {
        let emptyPopulation = population.evolve(population => {
          population.mutate(true);
        });
        expect(emptyPopulation.individuals.length).to.be(0);
      });
    });
  });

  describe("selection", () => {
    it("is a function", () => {
      expect(population.selection).to.be.a("function");
    });
    it("returns array of integers", () => {
      let ret = population.selection(population.individuals, {});
      expect(ret).to.be.an("array");
      ret.map(int => {
        expect(Number.isSafeInteger(int)).to.true;
      });
    });
    it("takes an options object", () => {
      expect(function() {
        population.selection(population, {});
      }).to.not.throw(Error);
    });

    describe("options", () => {
      // TODO:REVISE Think about making named selections permament, but released on evolve.
      describe("name", () => {
        let namedSelection = {
          name: "pick5",
          size: 5
        };
        it("is the default string argument", () => {
          expect(() => {
            population.selection("pick5");
          }).to.not.throw(Error);
          expect(population.selection("pick5")).to.eql([]);
        });
        it("saves selection under a name", () => {
          expect(population.selection(namedSelection)).to.eql(
            population.selection("pick5")
          );
        });
        it("overwrites names if given more than once", () => {
          let selected = population.selection(namedSelection);
          expect(selected).to.eql(population.selection("pick5"));
          population.selection({
            name: "pick5",
            size: 5,
            sorted: {
              order: "random"
            }
          });
          expect(selected).to.not.eql(population.selection("pick5"));
        });
        it("returns empty selection when not set", () => {
          expect(population.selection("pick5")).to.eql([]);
        });
      });

      describe("groups", () => {
        it("takes a number", () => {
          expect(() => {
            population.selection({
              groups: 3
            });
          }).to.not.throw(Error);
        });
        it("takes a boolean", () => {
          expect(() => {
            population.selection({
              groups: true
            });
          }).to.not.throw(Error);
        });
        it("assumes a groups value if given true and size is defined", () => {
          let selection = population.selection({
            groups: true,
            size: 2
          });
          selection.forEach(selectionGroup => {
            expect(selectionGroup.length).to.be.oneOf([1, 2]);
          });
        });
        it("nests groups", () => {
          let selection = population.selection({
            groups: true,
            size: 2
          });
          let nestedSelection = population.selection(
            {
              groups: true,
              size: 1
            },
            selection
          );
          selection.forEach(selectionGroup => {
            expect(selectionGroup.length).to.be.oneOf([1, 2]);
            selectionGroup.forEach(nestedSelecionGroup => {
              expect(nestedSelectionGroup.length).to.be.oneOf(1);
            });
          });
        });
      });

      describe("size", () => {
        it("takes a number", () => {
          expect(() => {
            population.selection({ size: 10 });
          }).to.not.throw(Error);
        });
        it("assumes a size value if given groups number", () => {
          let populationTotalSize = 10;
          let population = new Population({
            proto,
            individuals: populationTotalSize
          });
          let groups = 5;
          let selection = population.selection({
            groups: groups,
            size: populationTotalSize / groups
          });
          expect(selection).to.eql(population.selection({ groups: 5 }));
        });
        it("limits selection to a number of individuals", () => {
          let population = new Population({ proto, individuals: 10 });
          let selection = population.selection({ size: 5 });
          expect(selection.length).to.be.below(5);
        });
        it("limits selection to a number of individuals per group", () => {
          let population = new Population({ proto, individuals: 20 });
          let selection = population.selection({ groups: 5, size: 1 });
          selection.forEach(group => {
            expect(group.length).to.eql(1);
          });
        });
      });
      describe("sort", () => {
        it("takes a sort object", () => {
          expect(() => {
            population.selection({
              sort: { order: "ascending", fitness: "value" }
            });
          }).to.not.throw(Error)
        });
        describe("gracefully combines with group options", () => {
          it("sorts fitness after grouping", () => {
            let selection = population.selection({
              groups: 2,
              sort: { order: "ascending", fitness: "value" }
            })
            let groupsBefore = population.selection({
              sort: { order: "ascending", fitness: "value" }
            }, {groups: 2})
            let groupsAfter = population.selection({groups: 2}, {
              sort: { order: "ascending", fitness: "value" }
            })
            expect(selection).to.eql(groupsBefore);
            expect(selection).to.not.eql(groupsAfter);
          });
        });
      });
      // Order of application? Shuffle, Groups, Size, Sort, SortThreshold
      describe("shuffle", () => {
        it("takes a boolean", () => {
          expect(() => {
            population.selection({
              shuffle: true
            })
          })
        });
        describe("gracefully combines with group options", () => {
          it("shuffles before grouping", () => {
            let selection = population.selection({
              groups: 2,
              shuffle: true
            })
            let groupsBefore = population.selection({shuffled: true}, {groups: 2})
            let groupsAfter = population.selection({groups: 2}, {shuffled: true})
            expect(selection).to.eql(groupsAfter);
            expect(selection).to.not.eql(groupsBefore);
          });
        });
      });
    });
  });

  describe("operation", () => {
    it("requires a string or function argument");
    it("takes a selection or selection options");
    it("returns a set of changed, removed, or inserted individuals");
  });

  describe("sort", () => {
    it("is a function", () => {
      expect(population.sort).to.be.a("function");
    });
    it("returns an array of individuals");
    it("takes an options object");
  });

  describe("crossover", () => {
    it("is a function", () => {
      expect(population.crossover).to.be.a("function");
    });
    it("returns an array");
    it("takes a two selection arrays and the individuals");
  });

  describe("mutate", () => {
    it("is a function", () => {
      expect(population.mutate).to.be.a("function");
    });
    it("returns an array");
    it("takes a selection array and the individuals");
  });

  describe("remove", () => {
    it("is a function", () => {
      expect(population.remove).to.be.a("function");
    });
    it("returns an array");
    it("takes a selection array and the individuals");
  });

  describe("duplicate", () => {
    it("is a function", () => {
      expect(population.duplicate).to.be.a("function");
    });
    it("returns an array");
    it("takes a selection array and the individuals");
  });
});
