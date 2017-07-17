import { Population } from "./src/Population";

let population = new Population({
  phenotype: {
    mutate: [
      {
        name: g => (g > 0.5) ? "duplication" : "removal",
        selection: {
          rate: 0.1,
          selection: "valueB"
        },
      },
      {
        name: g => (g > 0.5) ? "duplication" : "removal",
        selection: {
          rate: 0.1,
          selection: "valueA"
        },
      },
      {
        name: "substitution",
        selection: 0.1
      }
    ],
    slice: function(a) {
      return Math.floor(a * 10);
    },
    valueA: function() {
      // I should be able to access other traits here.
      var codes = Array.from(this.genome.slice(6,this.traits.slice)).map((arg) => {
        return 32 + Math.floor(arg * (126 - 32));
      });
      var string = String.fromCharCode(...codes);
      return string
    },
    valueB: function() {
      var codes = Array.from(this.genome.slice(this.traits.slice)).map((arg) => {
        return 32 + Math.floor(arg * (126 - 32));
      });
      var string = String.fromCharCode(...codes);
      return string
    }
  },
  size: 50
});

for (let i = 0; i < 25000; i++) {
  population.evolve({
    removal: individuals => {
      console.log(individuals[0].traits.valueA(), "_____", individuals[0].traits.valueB())
      return individuals.slice(0, 4);
    },
    survival: individuals => {
      return individuals.slice(0, 1)
    },
    groups: 5,
    fitness: individual => {
      let targetA = "It works!";
      let valueA = individual.traits.valueA();
      let retB = Array.from(targetA).reduce((n, v, i) => (targetA[i] === valueA[i] ? n + 1 : n), 0) / Math.abs(targetA.length - valueA.length)
      let targetB = "You know it!";
      let valueB = individual.traits.valueB();
      let retA = Array.from(targetB).reduce((n, v, i) => (targetB[i] === valueB[i] ? n + 1 : n), 0) / Math.abs(targetB.length - valueB.length)
      return retA + retB;
    }
  });
}
