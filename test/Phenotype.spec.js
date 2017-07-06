import "babel-polyfill";
import { should, expect } from "chai";
import { Phenotype } from "../src/Phenotype";

describe("Phenotype", () => {
  let phenotype;
  describe("constructor", () => {
    it("can take no arguments", () => {
      expect(() => {
        new Phenotype();
      }).to.not.throw(Error);
    });
    it("can take a single object argument", () => {
      expect(() => {
        new Phenotype({});
      }).to.not.throw(Error);
    });
  });
  describe("representation", () => {
    it("sets representation from constructor", () => {
      phenotype = new Phenotype({ boo: "bees" });
      expect(phenotype.representation).to.eql({ boo: "bees" });
    });
    it("sets representation after constructor", () => {
      phenotype = new Phenotype();
      phenotype.representation = { boo: "bees" };
      expect(phenotype.representation).to.eql({ boo: "bees" });
    });
    it("sets new representation", () => {
      phenotype = new Phenotype({ boo: "bees" });
      expect(phenotype.representation).to.eql({ boo: "bees" });
      phenotype.representation = { boo: "bears" };
      expect(phenotype.representation).to.eql({ boo: "bears" });
      phenotype.representation = { boo: "boos" };
      expect(phenotype.representation).to.eql({ boo: "boos" });
    });
    it("is a flat object", () => {
      phenotype = new Phenotype({
        boo: {
          Boo: {
            BOO: "BOOM"
          }
        }
      });
      expect(phenotype.representation).to.eql({ "boo.Boo.BOO": "BOOM" });
    });
  });
  describe("names", () => {
    beforeEach(() => {
      phenotype = new Phenotype({
        boo: {
          Boo: {
            BOO: () => {}
          },
          Choo: () => {},
          Doo: [() => {}, () => {}]
        }
      });
    })
    it("returns an array", () => {
      expect(phenotype.names).to.be.instanceof(Array)
    });
    it("returns flattened names", () => {
      expect(phenotype.names).to.eql([
        "boo.Boo.BOO",
        "boo.Choo",
        "boo.Doo.0",
        "boo.Doo.1"
      ])
    })
  });
  describe("length", () => {
    beforeEach(() => {
      phenotype = new Phenotype({
        f1: (a1, a2, a3) => {},
        f2: (a1) => {},
        f3: () => {}
      })
    })
    it("returns a number", () => {
      expect(phenotype.length).to.be.a('number');
    });
    it("returns 0 if no functions", () => {
      phenotype.representation = {noFuncs: ["yeah", "yeah", "yeah"]}
      expect(phenotype.length).to.equal(0);
    });
    it("returns length of functions", () => {
      expect(phenotype.length).to.equal(4);
    });
    it("returns length of described functions");
  });
  describe("lengths", () => {
    beforeEach(() => {
      phenotype = new Phenotype({
        f1: (a1, a2, a3) => {},
        f2: (a1) => {},
        f3: () => {},
        a1: [1, 2, 3]
      })
    })
    it("returns an object", () => {
      expect(phenotype.lengths).to.be.an('object');
    });
    it("returns and empty object if no functions", () => {
      phenotype.representation = {noFuncs: ["yeah", "yeah", "yeah"]}
      expect(phenotype.lengths).to.eql({});
    });
    it("returns an object of keys length equal to total functions", () => {
      expect(Object.keys(phenotype.lengths).length).to.equal(3);
    });
    it("returns an object of function lengths", () => {
      expect(phenotype.lengths).to.eql({
        // No array lengths.
        f1: 3,
        f2: 1,
        f3: 0
      });
    });
    it("returns an array of described function lengths");
  });
  describe("apply", () => {
      beforeEach(() => {
      phenotype = new Phenotype({
        f1: (a1, a2, a3) => a1 + a2 + a3,
        f2: (a1) => 5,
        o1: {
          f3: () => 0,
          f4: function(){
            return (this|| {}).names
          }
        },
        a1: [1, 2, 3]
      })
      })
    it("must take one array argument", () => {
      expect(() => {
        phenotype.apply()
      }).to.throw(Error);
    });
    it("takes two arguments, bind scope and an object", () => {
      expect(() => {
        phenotype.apply(null, {})
      }).to.not.throw(Error);
    });
    it("can take a single object argument", () => {
      expect(() => {
        phenotype.apply({})
      }).to.not.throw(Error);
    });
    it("returns an object", () => {
      expect(phenotype.apply({})).to.be.an('object')
    });
    it("replaces called functions with values", () => {
      expect(phenotype.apply({
        f1: [1, 3, 7],
        f2: [0],
        "o1.f3": [2, 3, 3],
        "o1.f4": []
      })).to.eql({
        f1: 11,
        f2: 5,
        o1: {
          f3: 0,
          f4: undefined,
        },
        a1: [1, 2, 3]
      })
    });
    it("calls functions with context if provided", () => {
      expect(phenotype.apply(phenotype, {
        f1: [1, 3, 7],
        f2: [0],
        "o1.f3": [2, 3, 3],
        "o1.f4": []
      })).to.eql({
        f1: 11,
        f2: 5,
        o1: {
          f3: 0,
          f4: ["f1", "f2", "o1.f3", "o1.f4"],
        },
        a1: [1, 2, 3]
      })
    })
    it("leaves uncalled functions with function values", () => {
      expect(phenotype.apply({
        f2: [0],
        "o1.f3": [2, 3, 3],
      })).to.eql({
        f1: phenotype.representation["f1"],
        f2: 5,
        o1: {
          f3: 0,
          f4: phenotype.representation["o1.f4"],
        },
        a1: [1, 2, 3]
      })
    });
  });
});
