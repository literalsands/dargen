##The Genetics

Each class holds information for implementing different parts of evolutionary strategies.
Extend or pass options to change how each strategy unfolds.

Population => Exploratory Strategy
  Establish phenotype.
    Establishes mutation strategy.
    Establishes crossover strategy.
  Establish gene alphabet. (I'm saying always (0-1) for now.)
  Establish selection strategy.
  Establish replacement strategy.
  Establish population parameters.

Generations => Selection Strategy
  Evaluation of Individuals in Generation

Individuals => Crossover Strategy
  Create traits using phenotype(genome).
  Crossover strategy and mutation strategy are
    characteristics of phenotype.

Genomes => Mutation Strategy

(1) []
(N) {[]}
(M) ()
(M) {()}
(N, M) {[], ()}
(N) {{}}

Recurses through objects.
Terminates at an array that recieves its own gene, or at a function which receives the entire genome.

A phenotype function is called with the genome as its first argument and the length of the array genome as its second argument.

An array will always have one of its elements chosen.



