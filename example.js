import { Population } from "./src/Population";

let target = "It works!";
let population = new Population({
  phenotype: {
    mutate: [
      {
        name: "substitution",
        selection: {
          selection: "value",
          rate: g => g * 0.1
        }
      }
    ],
    value: function(a, b, c, d, e, f, g, h, i) {
      // I should be able to access other traits here.
      var codes = Array.from(arguments).map(arg => {
        return 32 + Math.floor(arg * (126 - 32));
      });
      var string = String.fromCharCode(...codes);
      return string;
    }
  },
  size: 5
});


Population.Fitness["fitness"] = individual => {
  return Array.from(target).reduce(
    (n, v, i) => (target[i] === individual.traits.value[i] ? n : n + 1),
    0
  );
};

for (let i = 0; i < 2000; i++) {
  // Print out the best individual of the population each generation.
  console.log(
    population.selection({
      size: 1,
      sort: { value: "fitness", order: "ascending" }
    })
  );
  population.evolve([
    {
      // Perform crossover in tournaments of size 5.
      selection: {
        // Select groups.
        size: 5,
        sort: "random"
      },
      crossover: [
        {
          // "Less fit" Mating Partners
          size: 4,
          sort: {
            value: "fitness",
            order: "descending"
          }
        },
        {
          // "Elite" Tournament Winner
          name: "elite",
          size: 1,
          sort: {
            value: "fitness",
            order: "ascending"
          }
        }
      ]
    },
    {
      // Perform mutation on total population except the elite, and replace with their mutated values.
      mutate: {
        operation: "inverse",
        selections: ["elite"]
      }
    }
  ]);
}
