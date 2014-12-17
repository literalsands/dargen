// GENETIC EXPERIENCE MANAGEMENT
// by Paul Prae
var Individual = require('./Individual');
var Population = require('./Population');

console.log('\n' + '~ Evolution of Color Traits: Desired Traits are \'purple\' and \'teal\' ~');
console.log('------------------------------------------------------------------------------');
var population = new Population();
population.prettyPrintGeneration();
console.log('\nA most fit individual:');
console.log('------------------------------------');
fittest = population.findAMostFitIndividual();
fittest.prettyPrint();
console.log('\nA least fit individual:');
console.log('------------------------------------');
fittest = population.findALeastFitIndividual();
fittest.prettyPrint();
console.log('\nAverage fitness:');
console.log('--------------------');
console.log(population.averageFitness());

console.log('\n\nAfter evolving the current generation 5 times (selection, crossover, mutation):');
console.log('--------------------------------------------------------------------------------');
for(var i = 0; i < 5; i++){
	population.evolve();
}
population.prettyPrintGeneration();
console.log('\nA most fit individual:');
console.log('------------------------------------');
fittest = population.findAMostFitIndividual();
fittest.prettyPrint();
console.log('\nA least fit individual:');
console.log('------------------------------------');
fittest = population.findALeastFitIndividual();
fittest.prettyPrint();
console.log('\nAverage fitness:');
console.log('--------------------');
console.log(population.averageFitness());

console.log('\n\nAfter evolving the current generation 50 more times (selection, crossover, mutation):');
console.log('--------------------------------------------------------------------------------');
for(var i = 0; i < 50; i++){
	population.evolve();
}
population.prettyPrintGeneration();
console.log('\nA most fit individual:');
console.log('------------------------------------');
fittest = population.findAMostFitIndividual();
fittest.prettyPrint();
console.log('\nA least fit individual:');
console.log('------------------------------------');
fittest = population.findALeastFitIndividual();
fittest.prettyPrint();
console.log('\nAverage fitness:');
console.log('--------------------');
console.log(population.averageFitness());