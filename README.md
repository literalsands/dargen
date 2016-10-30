This is my first time writing back-end, prototype-based JavaScript. There is much refactoring ahead before I can turn this into a full fledged web service. I hope to tie this into a basic web site that optimizes itself based on traits the users like.

##Demo
To try it out:
	$> node Population_Tests.js

var genome = new Genome(12);

##The Genetics
Individual:

Generations:

Fitness operator:

Selection and combination:

Mutation:

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


Can the phenotype be serialized? Is that even important?

Can the phenotype be more than one layer deep?

What does a phenotype look like?

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



