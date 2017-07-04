# Why Dargen?

Dargen is a genetic algorithm focused on ease-of-use and magic.

  - Just create the decoder.
    - Supply arbitrarily shaped objects with functions.
    - Uses function length or description helper to call with genes.
  - Don’t worry too much about the mutation and crossover mechanisms.
    - Or, take full control and easily create mutation and crossover pipelines.
    - Mutation and crossover pipelines can be unique to the individual and determined according to their genome.
  - By default, uses robust and simple 0 to 1 (inclusive) genome encoding.
    - Extend the Genome to use different encodings.
    - Extend Genome.Mutations to add new mutation methods.
  - Supports genome growth and deletion.
  - Effortless self-reflection in mutation and crossover.
  - Great for testing out experimental features and ideas.
