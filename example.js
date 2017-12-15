import { Population } from "./src/Population";
import { Individual } from "./src/Individual";
import { arity, choose } from "./src/PhenotypeHelpers";

let target = "It works!";
let population = new Population({
  proto: new Individual({
    phenotype: {
      mutate: [
        {
          name: "substitution",
          selection: {
            // We could keep this mutation rate from acting on itself.
            //selection: "value",
            // Let the individuals choose their own mutation rate on initialization.
            //rate: g => g
            // We're making it a little easier to hit lower numbers.
            //rate: g => Math.tan(Math.PI / 4 * g)
            rate: g => (g * 0.06) + 0.02
          }
        }
      ],
      // The arity function returns a function of a given length.
      // That length is used to populate the genome.
      string: arity(target.length, function() {
        // Encode each gene into a valid character code.
        var codes = Array.from(arguments).map(arg => {
          return 32 + Math.floor(arg * (126 - 32));
        });
        // Convert the character codes into a string.
        var string = String.fromCharCode(...codes);
        return string;
      })
    }
  }),
  individuals: 25
});

Population.Fitness["fitness"] = individual => {
  // Give the individual an error point every time they don't match the target string.
  return Array.from(target).reduce(
    (n, v, i) => (v === individual.traits.string[i] ? n : n + 1),
    0
  );
};

for (let i = 0; i < 500; i++) {
  // Sort the individuals by size.
  let sorted = population.selection({
    // Shuffle the selection to vary the best individual per generation when scores.
    shuffle: true,
    sort: { value: "fitness", comparison: "ascending" }
  });
  let mostFit = sorted.slice(0, 4);
  // View the population's transformation over time.
  console.log(
    sorted
      .map(i => Population.Fitness.fitness(population.individuals[i]))
      .join(""), population.individuals[mostFit[0]].traits.string
  );
  // Crossover all the individuals with the most fit.
  population.operation("crossoverAndReplace", [true, mostFit]);
  // Mutate all the individuals.
  population.mutate(true);
}
