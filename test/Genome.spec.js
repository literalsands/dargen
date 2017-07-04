import 'babel-polyfill';
import {should, expect} from 'chai';
import { Genome } from '../src/Genome';
import doctest from 'jsdoc-test';

should();

// A Genome is the set of genes of an individual.
describe("Genome", () => {
  describe("DocTests", () => {
    doctest("src/Genome.js");
  })
  describe("constructor", () => {
    it("does not require arguments", () => {
      (() => {
        new Genome();
      }).should.not.throw(Error);
    });
    it("takes an array as an argument", () => {
      (() => {
        new Genome([1, 0.4]);
      }).should.not.throw(Error);
    })
    it("takes a number as an argument", () => {
      (() => {
        new Genome(8);
      }).should.not.throw(Error);
    })
  });
  describe("json", () => {
    let genome = new Genome(8);
    it("outputs a string", () => {
      JSON.stringify(genome).should.be.a('string');
    });
    it("should output a JSON array", () =>{
      JSON.parse(JSON.stringify(genome)).should.be.an('array');
    })
    it("should parse to an equivalent genome", () => {
      let stringifiedGenome = JSON.stringify(genome);
      let parsedGenome = JSON.parse(stringifiedGenome);
      new Genome(parsedGenome).should.deep.equal(genome);
    })
  });
  describe("size", () => {
    it("truncates the genome", () => {
      let genome = new Genome(2);
      expect(genome[1]).to.be.a('number');
      genome.size = 1;
      expect(genome[1]).to.be.undefined;
    });
    it("equals the length", () => {
      let genome = new Genome(2);
      genome.length.should.equal(genome.size);
    });
    it("fills the array with random values", () => {
      let genome = new Genome();
      expect(genome[0]).to.be.undefined;
      genome.size = 1;
      expect(genome[0]).to.be.a('number');
    });
  });
  describe("mutate", () => {
    it("modifies the parent", () => {
      let parentGenome = new Genome(2);
      let genomeCopy = parentGenome.copy();
      let mutatedGenome = parentGenome.mutate({substitution: 1});
      parentGenome.should.not.deep.equal(genomeCopy);
      parentGenome.should.deep.equal(mutatedGenome);
    });
    it("does not modify the parent when asked", () => {
      let parentGenome = new Genome(2);
      let genomeCopy = parentGenome.copy();
      let mutatedGenome = parentGenome.mutate({substitution: 1, modify: false});
      parentGenome.should.deep.equal(genomeCopy);
      parentGenome.should.not.deep.equal(mutatedGenome);
    });
    describe("substitution", () => {
      it("is provided", () => {
        let genome = new Genome(2);
        let genomeCopy = genome.copy();
        genome.mutate({substitution: 0});
        genome.should.deep.equal(genomeCopy);
        genome.mutate({substitution: 1});
        genome.should.not.deep.equal(genomeCopy);
      });
    });
    describe("duplication", () => {
      it("is provided", () => {
        let genome = new Genome(2);
        let genomeCopy = genome.copy();
        genome.mutate({duplication: 0});
        genome.should.deep.equal(genomeCopy);
        genome.mutate({duplication: 1});
        genome.size.should.equal(4);
        genome[0].should.equal(genome[2]);
        genome[1].should.equal(genome[3]);
      });
    });
    describe("inverse", () => {
      it("is provided", () => {
        let genome = new Genome(2);
        let genomeCopy = genome.copy();
        genome.mutate({inversion: 0});
        genome.should.deep.equal(genomeCopy);
        genome.mutate({inversion: 1});
        genome.size.should.equal(2);
        genome.should.deep.equal(genomeCopy.reverse());
      });
    });
    describe("deletion", () => {
      it("is provided", () => {
        let genome = new Genome(4);
        let genomeCopy = genome.copy();
        genome.mutate({deletion: 0});
        expect(genome).to.deep.equal(genomeCopy);
        genome.mutate({deletion: 1});
        expect(genome).to.not.deep.equal(genomeCopy);
      });
      it("removes all elements to the required 1", () => {
        let genome = new Genome(4);
        genome.mutate({deletion: 1});
        genome.size.should.equal(1);
      });
      it("removes all elements to the lower bound", () => {
        let genome = new Genome(4);
        genome.mutate({deletion: 1, lower: 4});
        genome.size.should.equal(4);
      });
      it("doesn't trigger replacement for lower bound protected elements");
    });
    describe("incrementation", () => {
      it("is provided", () => {
        let genome = new Genome(4);
        let genomeCopy = genome.copy();
        genome.mutate({incrementation: 0, increment: 0.05});
        expect(genome).to.deep.equal(genomeCopy);
        genome.mutate({incrementation: 1, increment: 0.05});
        expect(genome).to.not.deep.equal(genomeCopy);
      });
      it("moves values a fixed amount in a random direction", () => {
        let genome = new Genome([0.5, 0.5]);
        let genomeCopy = genome.copy();
        genome.mutate({incrementation: 1, increment: 0.05});
        expect(genome[0]).to.be.oneOf([0.55, 0.45]);
      });
      it("stays between the values of 0 and 1", () => {
        let genome = new Genome(12);
        genome.mutate({incrementation: 1, increment: 0.7});
        genome.forEach((gene)=> expect(gene).to.be.within(0,1));
      });
      it("changes value to 0 or 1 if value would pass 0 or 1 and is not that number", () => {
        let genome = new Genome(12);
        genome.mutate({incrementation: 1, increment: 1});
        genome.forEach((gene)=> expect(gene).to.be.oneOf([1, 0]));
      });
      it("will always move away from 0 or 1 if value is 0 or 1", () => {
        let genome = new Genome([0, 1]);
        genome.mutate({incrementation: 1, increment: 0.5});
        expect(genome[0]).to.equal(0.5);
        expect(genome[1]).to.equal(0.5);
        // Special case transition from 0 to 1.
        genome = new Genome([1, 0, 1, 0]);
        genome.mutate({incrementation: 1, increment: 1});
        expect(genome).to.deep.equal([0, 1, 0, 1]);
      });
    });
    it("provides gravity");
    it("provides fuzzy mutations");
    it("provides computed gradient mutation");
    it("never allows size to become greater than upper", () => {
      let genome = new Genome(4);
      genome.mutate({duplication: 1, substitution: 0, upper: 6});
      genome.size.should.equal(6);
    });
  });
  describe("crossover", () => {
    it("does not modify the parent", () => {
      let parentGenome = new Genome(2);
      let otherParentGenome = new Genome(2);
      let childGenome = parentGenome.crossover({}, otherParentGenome);
      parentGenome.should.not.deep.equal({}, otherParentGenome);
      parentGenome.should.not.equal(childGenome);
    });
    it("should take multiple parents", () => {
      let genomeA = new Genome(4);
      let genomeB = new Genome(2);
      let genomeC = new Genome(3);
      let childGenome;
      (() => {
        childGenome = genomeA.crossover({crossover: 1}, genomeB, genomeC);
      }).should.not.throw(Error);
      childGenome[0].should.be.oneOf([genomeB[0], genomeC[0]]);
      childGenome[1].should.be.oneOf([genomeB[1], genomeC[1]]);
      childGenome[2].should.be.oneOf([genomeC[2], genomeA[2]]);
      childGenome[3].should.be.oneOf([genomeA[3]]);
    });
  });
  describe("copy", () => {
    it("is not the same object", () => {
      let genome = new Genome(2);
      let genomeCopy = genome.copy();
      genome.should.not.equal(genomeCopy);
    });
    it("is equal to the original", () => {
      let genome = new Genome(2);
      let genomeCopy = genome.copy();
      genome.should.deep.equal(genomeCopy);
    });
  });
  describe("howSimilar", () => {
    it("should be a function", () => {
      let genome = new Genome(30);
      expect(genome.howSimilar).to.be.a('function')
    })
    it("requires an argument",() => {
      let genome = new Genome(30);
      (() => {
        genome.howSimilar();
      }).should.throw(Error);
    })
    it("takes a single array-like argument", () => {
      let genome = new Genome(30);
      (() => {
        genome.howSimilar([]);
      }).should.not.throw(Error);
    })
    it("will return 1 if given self", () => {
      let genome = new Genome(30);
      expect(genome.howSimilar(genome)).to.equal(1)
    })
    it("will return 0 if given an empty genome", () => {
      let genome = new Genome(30);
      expect(genome.howSimilar([])).to.equal(0);
    })
    it("will return between 0 and 1 if given a crossover genome", () => {
      let genome = new Genome(100);
      let genomeMate = new Genome(100);
      let genomeChild = genome.crossover({crossover: 0.5}, genomeMate)
      expect(genomeChild.howSimilar(genome)).to.be.below(1)
      expect(genomeChild.howSimilar(genome)).to.be.above(0)
      expect(genomeChild.howSimilar(genomeMate)).to.be.below(1)
      expect(genomeChild.howSimilar(genomeMate)).to.be.above(0)
    })
    it("will add up to 1 when compared from a child to both parents", () => {
      let genome = new Genome(100);
      let genomeMate = new Genome(100);
      let genomeChild = genome.crossover({crossover: 0.5}, genomeMate)
      expect(genomeChild.howSimilar(genome) + genomeChild.howSimilar(genomeMate)).to.equal(1)
    })
  })
})

