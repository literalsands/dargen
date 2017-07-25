import { Population } from "./src/Population";

let target = "It works!"
let population = new Population({
  phenotype: {
    mutate: [
      {
        name: "substitution",
        selection: {
          selection: "value",
          rate: 0.1
        }
      }
    ],
    value: function(a, b, c, d, e, f, g, h, i) {
      // I should be able to access other traits here.
      var codes = Array.from(
        arguments
      ).map(arg => {
        return 32 + Math.floor(arg * (126 - 32));
      });
      var string = String.fromCharCode(...codes);
      return string;
    },
  },
  size: 5
});

for (let i = 0; i < 2000; i++) {
  population.evolve({
    removal: individuals => {
      console.log(individuals[0].traits.value)
      return individuals.slice(0, 4);
    },
    survival: individuals => {
      return individuals.slice(0, 1);
    },
    groups: 5,
    // Ascending order.
    comparison: ({value: a}, {value: b}) => {
      return a - b;
    },
    // Add 1 to an error term for every mismatched letter.
    fitness: individual => {
      let value = individual.traits.value;
      let ret = Array.from(target).reduce(
          (n, v, i) => (target[i] === value[i] ? n : n + 1),
          0)
      return ret;
    }
  });
}
