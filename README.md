This is my first time writing back-end, prototype-based JavaScript. There is much refactoring ahead before I can turn this into a full fledged web service. I hope to tie this into a basic web site that optimizes itself based on traits the users like.

##Demo
To try it out:
	$> node Population_Tests.js

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
  Establish gene alphabet.
  Establish selection strategy.
  Establish population parameters.
Generations => Selection Strategy
  Evaluation of Individuals in Generation
Individuals => Crossover Strategy
  Create traits using phenotype(genome).
  Crossover strategy and mutation strategy are
    characteristics of phenotype.
Genomes => Mutation Strategy
