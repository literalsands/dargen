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
    it("can represent a single function", () => {
      let func = function() {
        return "floo";
      };
      phenotype = new Phenotype(func);
      expect(phenotype.representation).to.equal(func);
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
    });
    it("returns an array", () => {
      expect(phenotype.names).to.be.instanceof(Array);
    });
    it("returns flattened names", () => {
      expect(phenotype.names).to.eql([
        "boo.Boo.BOO",
        "boo.Choo",
        "boo.Doo.0",
        "boo.Doo.1"
      ]);
    });
    it("returns an empty array for an array for a function representation", () => {
      expect(new Phenotype(function() {}).names).to.eql([]);
    });
  });
  describe("length", () => {
    beforeEach(() => {
      phenotype = new Phenotype({
        f1: (a1, a2, a3) => {},
        f2: a1 => {},
        f3: () => {}
      });
    });
    it("returns a number", () => {
      expect(phenotype.length).to.be.a("number");
    });
    it("returns 0 if no functions", () => {
      phenotype.representation = { noFuncs: ["yeah", "yeah", "yeah"] };
      expect(phenotype.length).to.equal(0);
    });
    it("returns length of functions", () => {
      expect(phenotype.length).to.equal(4);
    });
    it("returns length of function for function representation", () => {
      expect(new Phenotype(function(a, b, c) {}).length).to.equal(3);
    });
    it("returns length of described functions");
  });
  describe("lengths", () => {
    beforeEach(() => {
      phenotype = new Phenotype({
        f1: (a1, a2, a3) => {},
        f2: a1 => {},
        f3: () => {},
        a1: [1, 2, 3]
      });
    });
    it("returns an object", () => {
      expect(phenotype.lengths).to.be.an("object");
    });
    it("returns and empty object if no functions", () => {
      phenotype.representation = { noFuncs: ["yeah", "yeah", "yeah"] };
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
    it("returns an empty object for function representation", () => {
      expect(new Phenotype(function() {}).lengths).to.eql({});
    });
    it("returns an object of described function lengths");
  });
  describe("apply", () => {
    beforeEach(() => {
      phenotype = new Phenotype({
        f1: (a1, a2, a3) => a1 + a2 + a3,
        f2: a1 => 5,
        o1: {
          f3: () => 0,
          f4: function() {
            return (this || {}).names;
          }
        },
        a1: [1, 2, 3]
      });
    });
    it("must take one argument", () => {
      expect(() => {
        phenotype.apply();
      }).to.throw(Error);
    });
    it("takes two arguments, bind scope and an object", () => {
      expect(() => {
        phenotype.apply(null, {});
      }).to.not.throw(Error);
    });
    it("can take a single object argument", () => {
      expect(() => {
        phenotype.apply({});
      }).to.not.throw(Error);
    });
    it("returns an object", () => {
      expect(phenotype.apply({})).to.be.an("object");
    });
    it("replaces called functions with values", () => {
      expect(
        phenotype.apply({
          f1: [1, 3, 7],
          f2: [0],
          "o1.f3": [2, 3, 3],
          "o1.f4": []
        })
      ).to.eql({
        f1: 11,
        f2: 5,
        o1: {
          f3: 0,
          f4: undefined
        },
        a1: [1, 2, 3]
      });
    });
    it("calls functions with context if provided", () => {
      expect(
        phenotype.apply(phenotype, {
          f1: [1, 3, 7],
          f2: [0],
          "o1.f3": [2, 3, 3],
          "o1.f4": []
        })
      ).to.eql({
        f1: 11,
        f2: 5,
        o1: {
          f3: 0,
          f4: ["f1", "f2", "o1.f3", "o1.f4"]
        },
        a1: [1, 2, 3]
      });
    });
    it("leaves uncalled functions with function values", () => {
      expect(
        phenotype.apply({
          f2: [0],
          "o1.f3": [2, 3, 3]
        })
      ).to.eql({
        f1: phenotype.representation["f1"],
        f2: 5,
        o1: {
          f3: 0,
          f4: phenotype.representation["o1.f4"]
        },
        a1: [1, 2, 3]
      });
    });
    it("calls function representation with entire context", () => {
      // Takes a compiled epigenome.
      let values = {
        f1: [1, 3, 7],
        f2: [0],
        "o1.f3": [2, 3, 3],
        "o1.f4": []
      };
      // And just consumes the whole compiled epigenome as it's first argument.
      expect(
        new Phenotype(function() {
          return this;
        }).apply(values, null)
      ).to.eql(values);
      expect(
        new Phenotype(function() {
          return arguments[0];
        }).apply(null, values)
      ).to.eql(values);
      // Still prioritize arguments to this?
      expect(
        new Phenotype(function() {
          return arguments[0];
        }).apply(values)
      ).to.eql(values);
    });
    it("optionally applies function representations with an array", () => {
      let values = [[1, 3, 7], [0], [2, 3, 3], []];
      // Takes an array.
      expect(
        new Phenotype(function() {
          return this.from(arguments);
        }).apply(Array, values)
      ).to.eql(values);
    });
  });
  describe("bind", () => {
    beforeEach(() => {
      phenotype = new Phenotype({
        bindableFunction: function() {
          return this;
        },
        unbindableFunction: () => this
      });
    });
    it("can take a single argument, bind scope", () => {
      expect(() => {
        phenotype.bind(null);
      }).to.not.throw(Error);
    });
    it("takes two arguments, bind scope and an object", () => {
      expect(() => {
        phenotype.bind(null, {});
      }).to.not.throw(Error);
    });
    it("returns an object", () => {
      expect(phenotype.bind({})).to.be.an("object");
    });
    it("returns a function representation", () => {
      expect(new Phenotype(function() {}).bind({})).to.be.a("function");
    });
    it("replaces functions with bound functions", () => {
      let bindValue = {foo: "bar"};
      let boundPhenotype = phenotype.bind(bindValue);
      expect(boundPhenotype.bindableFunction()).to.not.equal(boundPhenotype.unbindableFunction());
      expect(boundPhenotype.bindableFunction()).to.equal(bindValue);
      expect(boundPhenotype.unbindableFunction()).to.equal(this);
    });
    it("binds function representation with entire context as first argument", () => {
      // Takes a compiled epigenome.
      let values = {
        f1: [1, 3, 7],
        f2: [0],
        "o1.f3": [2, 3, 3],
        "o1.f4": []
      };
      // And just consumes the whole compiled epigenome as it's first argument.
      expect(
        new Phenotype(function() {
          return this;
        }).bind(values, null)()
      ).to.eql(values);
      expect(
        new Phenotype(function() {
          return arguments[0];
        }).bind(null, values)()
      ).to.eql(values);
      expect(
        new Phenotype(function() {
          return this;
        }).bind(values)()
      ).to.eql(values);
    });
    it("binds function representations with given an array", () => {
      let values = [[1, 3, 7], [0], [2, 3, 3], []];
      // Takes an array.
      expect(
        new Phenotype(function() {
          return this.from(arguments);
        }).bind(Array, values)()
      ).to.eql(values);
    });
  });
});
