# Why Dargen?

Dargen in a genetic algorithm focused on ease-of-use and magic.

  - Just create the decoder.
    - Supply arbitrarily shaped objects with functions.
    - Uses function length or description helper to call with genes.
  - Don’t worry too much about the mutation and crossover mechanisms.
    - Or, take full control and easily create mutation and crossover pipelines.
    - Mutation and crossover pipelines can be unique to the individual and determined according to their genome.
  - Uses robust and simple 0 to 1 (inclusive) genome encoding.
  - Supports genome growth and deletion.
  - Effortless self-reflection.
  - Experimental features and ideas.

## Classes

<dl>
<dt><a href="#Individual">Individual</a></dt>
<dd></dd>
<dt><a href="#Phenotype">Phenotype</a></dt>
<dd></dd>
<dt><a href="#Genome">Genome</a> ⇐ <code>GenomeBase</code></dt>
<dd></dd>
<dt><a href="#Epigenome">Epigenome</a> ⇐ <code>GenomeBase</code></dt>
<dd></dd>
<dt><a href="#Generation">Generation</a></dt>
<dd></dd>
<dt><a href="#Population">Population</a></dt>
<dd></dd>
</dl>

<a name="Individual"></a>

## Individual
**Kind**: global class  

* [Individual](#Individual)
    * [new Individual([individual])](#new_Individual_new)
    * [.phenotype](#Individual+phenotype)
    * [.phenotype](#Individual+phenotype)
    * [.traits](#Individual+traits)
    * [.evaluate(func)](#Individual+evaluate) ⇒
    * [.mutate()](#Individual+mutate) ⇒
    * [.crossover(...mates)](#Individual+crossover) ⇒

<a name="new_Individual_new"></a>

### new Individual([individual])
Create a new Individual

**Returns**: [<code>Individual</code>](#Individual) - Returns the new Individual.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [individual] | [<code>Individual</code>](#Individual) \| <code>Object</code> |  | Object containing the individual. |
| [individual.identifier] | <code>String</code> | <code>&#x60;i-${getIdentifier()}&#x60;</code> | A unique string for the individual. Automatically populated by UUID or genome. |
| [individual.timestamp] | <code>Date</code> \| <code>String</code> \| <code>Number</code> | <code>new Date()</code> | A timestamp of when this individual was created. |
| [individual.phenotype] | [<code>Phenotype</code>](#Phenotype) \| <code>Object</code> |  | An object containing functions. |
| [individual.genome] | [<code>Genome</code>](#Genome) \| <code>Array</code> | <code>new Genome()</code> | An array containing genes. |
| [individual.epigenome] | [<code>Epigenome</code>](#Epigenome) \| <code>Array</code> |  | An array containing strings specifying phenotype functions and corresponding to gene positions. |
| [individual.parents] | <code>Array</code> |  | An array of parent individual identifiiers. |
| [individual.generation] | <code>String</code> |  | An optional string specifying the generation in which this individual was created. |
| [individual.population] | <code>String</code> |  | An optional string specifying the population in which this individual was created. |

**Example**  
```js
// Individuals don't have to have any attributes, but that makes them pretty boring.
let boring = new Individual()

// You can assign values later.
boring.phenotype = {personality: "none"}

// Individuals that are only given a phenotype give themselves a genome and epigenome based off of length of phenotype functions.
new Individual({
  phenotype: {
    color: (r, g, b) => `rgb(${[r, g, b].join(',')})`, // length 3
    animal: (g) => ["dog", "monkey", "cat"][Math.floor(g*3)], // length 1
    names: [
      (g) => ["Angie", "Martha", "John", "Jerry"][Math.floor(g*4)], // length 1
      (g) => ["Brown", "Austen", "Hook", "Perry"][Math.floor(g*4)], // length 1
    ]
  },
  // genome: new Genome(6),
  // epigenome: new Epigeome(["color", "color", "color", "animal", "names.0", "names.1"])
})
```
<a name="Individual+phenotype"></a>

### individual.phenotype
Enforce compatibility with established phenotype.

**Kind**: instance property of [<code>Individual</code>](#Individual)  
<a name="Individual+phenotype"></a>

### individual.phenotype
Return the established phenotype.

**Kind**: instance property of [<code>Individual</code>](#Individual)  
**Read only**: true  
<a name="Individual+traits"></a>

### individual.traits
Return the decoded genome.

**Kind**: instance property of [<code>Individual</code>](#Individual)  
**Read only**: true  
**Example**  
```js
// Given an individual of this shape.

new Individual(
  genome: [0.1, 0.5, 0.4, 0.9, 0.6, 0.24],
  epigenome: ["color", "color", "color", "animal", "names.0", "names.1"],
  phenotype: {
    color: (r, g, b) => `rgb(${[r, g, b].join(',')})`,
    animal: (g) => ["dog", "monkey", "cat"][Math.floor(g*3)],
    names: [
      (g) => ["Angie", "Martha", "John", "Jerry"][Math.floor(g*4)],
      (g) => ["Brown", "Austen", "Hook", "Perry"][Math.floor(g*4)],
    ]
  }
)

// The traits are the decoded output.

individual.traits

{
  color: "rgb(0.1, 0.5, 0.4)",
  // color: `rgb(${[0.1, 0.5, 0.4].join(',')})`,
  animal: "cat",
  // animal: ["dog", "monkey", "cat"][2],
  names: ["John", "Brown"]
  // names: [
  //   ["Angie", "Martha", "John", "Jerry"][2],
  //   ["Brown", "Austen", "Hook", "Perry"][0]
  // ]
}
```
<a name="Individual+evaluate"></a>

### individual.evaluate(func) ⇒
Call function on individual's traits.

**Kind**: instance method of [<code>Individual</code>](#Individual)  
**Returns**: any  

| Param | Type |
| --- | --- |
| func | <code>function</code> | 

<a name="Individual+mutate"></a>

### individual.mutate() ⇒
Mutate the individual's genome.

Utilizes the individual's `traits.mutate` value.

**Kind**: instance method of [<code>Individual</code>](#Individual)  
**Returns**: Individual  
<a name="Individual+crossover"></a>

### individual.crossover(...mates) ⇒
Creates a new individual using given mates.

Utilizes this individual's `traits.crossover` value.

**Kind**: instance method of [<code>Individual</code>](#Individual)  
**Returns**: Individual - A new child Individual using genes from this Individual and mates.  

| Param | Type | Description |
| --- | --- | --- |
| ...mates | [<code>Individual</code>](#Individual) | Individuals to exchange genes with. |

<a name="Phenotype"></a>

## Phenotype
**Kind**: global class  

* [Phenotype](#Phenotype)
    * [new Phenotype()](#new_Phenotype_new)
    * [.representation](#Phenotype+representation)
    * [.representation](#Phenotype+representation)
    * [.names](#Phenotype+names)
    * [.length](#Phenotype+length)
    * [.lengths](#Phenotype+lengths)
    * [.apply(thisArg, funcArgs)](#Phenotype+apply) ⇒ <code>Object</code>

<a name="new_Phenotype_new"></a>

### new Phenotype()
Simple, configurable decoder representation.
Contains useful methods and abstractions for interacting with Objects and Arrays filled with functions.

**Returns**: [<code>Phenotype</code>](#Phenotype) - - Returns the new Phenotype.  

| Type | Description |
| --- | --- |
| [<code>Phenotype</code>](#Phenotype) | An arbitrary object containing functions. |

<a name="Phenotype+representation"></a>

### phenotype.representation
Set the arbitrary object containing functions.

**Kind**: instance property of [<code>Phenotype</code>](#Phenotype)  
<a name="Phenotype+representation"></a>

### phenotype.representation
Representation as a flattened object.

**Kind**: instance property of [<code>Phenotype</code>](#Phenotype)  
<a name="Phenotype+names"></a>

### phenotype.names
Get the flattened names of functions.

**Kind**: instance property of [<code>Phenotype</code>](#Phenotype)  
**Read only**: true  
<a name="Phenotype+length"></a>

### phenotype.length
Get the combined length of all functions.

**Kind**: instance property of [<code>Phenotype</code>](#Phenotype)  
**Read only**: true  
<a name="Phenotype+lengths"></a>

### phenotype.lengths
Get the length of every function.

**Kind**: instance property of [<code>Phenotype</code>](#Phenotype)  
**Read only**: true  
<a name="Phenotype+apply"></a>

### phenotype.apply(thisArg, funcArgs) ⇒ <code>Object</code>
Apply an Object of name keys and argument values to the representation.

**Kind**: instance method of [<code>Phenotype</code>](#Phenotype)  
**Returns**: <code>Object</code> - - Decoded phenotype, or traits.  

| Param | Type | Description |
| --- | --- | --- |
| thisArg | <code>Object</code> | `this` parameter for function. |
| funcArgs | <code>Object</code> | Object of argument values. |

<a name="Genome"></a>

## Genome ⇐ <code>GenomeBase</code>
**Kind**: global class  
**Extends**: <code>GenomeBase</code>  

* [Genome](#Genome) ⇐ <code>GenomeBase</code>
    * [new Genome(genome)](#new_Genome_new)
    * [.getRandomGeneValue()](#Genome+getRandomGeneValue) ⇒

<a name="new_Genome_new"></a>

### new Genome(genome)
Creates a new Genome.


| Param | Type | Description |
| --- | --- | --- |
| genome | [<code>Genome</code>](#Genome) \| <code>Array</code> \| <code>Number</code> \| <code>undefined</code> | An array of genes or a number indicating the length of the genome. |

<a name="Genome+getRandomGeneValue"></a>

### genome.getRandomGeneValue() ⇒
Returns a random valid gene value.

**Kind**: instance method of [<code>Genome</code>](#Genome)  
**Returns**: Number  
<a name="Epigenome"></a>

## Epigenome ⇐ <code>GenomeBase</code>
**Kind**: global class  
**Extends**: <code>GenomeBase</code>  

* [Epigenome](#Epigenome) ⇐ <code>GenomeBase</code>
    * [new Epigenome(epigenome, [alphabet])](#new_Epigenome_new)
    * [.alphabet](#Epigenome+alphabet)
    * [.alphabet](#Epigenome+alphabet) ⇒
    * [.getRandomGeneValue()](#Epigenome+getRandomGeneValue) ⇒
    * [.compile(genome)](#Epigenome+compile) ⇒
    * [.mutate()](#Epigenome+mutate)
    * [.crossover()](#Epigenome+crossover)

<a name="new_Epigenome_new"></a>

### new Epigenome(epigenome, [alphabet])
Creates an epigenome.

How are genes expressed?
i.e. What genes positions are passed to what functions?


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| epigenome | [<code>Epigenome</code>](#Epigenome) \| <code>Array</code> \| <code>Number</code> \| <code>undefined</code> |  | An array of strings or a number indicating the length of the epigenome. |
| [alphabet] | <code>Array.&lt;String&gt;</code> | <code>[&quot;&quot;]</code> | Strings that are available to the epigenome. |

<a name="Epigenome+alphabet"></a>

### epigenome.alphabet
The values available to epigenome mutations.

**Kind**: instance property of [<code>Epigenome</code>](#Epigenome)  
<a name="Epigenome+alphabet"></a>

### epigenome.alphabet ⇒
The values available to epigenome mutations, and the in-use alphabet of the epigenome.

**Kind**: instance property of [<code>Epigenome</code>](#Epigenome)  
**Returns**: Set - Set that contains the alphabet.  
<a name="Epigenome+getRandomGeneValue"></a>

### epigenome.getRandomGeneValue() ⇒
Returns a random value epigenome marker value.

**Kind**: instance method of [<code>Epigenome</code>](#Epigenome)  
**Returns**: string - A random marker from the epigenome alphabet.  
<a name="Epigenome+compile"></a>

### epigenome.compile(genome) ⇒
Compile genome positions to arguments arrays using marker names.

**Kind**: instance method of [<code>Epigenome</code>](#Epigenome)  
**Returns**: Object - Object of arrays containing a key and values that are values of the genome.  

| Param | Type |
| --- | --- |
| genome | [<code>Genome</code>](#Genome) \| <code>Array</code> | 

<a name="Epigenome+mutate"></a>

### epigenome.mutate()
Mimic mutations that take place for a genome.

Will mutate epigenome only when asked for mutations that do not change gene positions.

**Kind**: instance method of [<code>Epigenome</code>](#Epigenome)  
<a name="Epigenome+crossover"></a>

### epigenome.crossover()
Mimic crossover that takes place for a genome.

Will only apply crossover methods that do not change gene positions or exchange gene when asked.

**Kind**: instance method of [<code>Epigenome</code>](#Epigenome)  
<a name="Generation"></a>

## Generation
**Kind**: global class  

* [Generation](#Generation)
    * [new Generation(generation, populations)](#new_Generation_new)
    * [.next()](#Generation+next) ⇒ [<code>Array.&lt;Individual&gt;</code>](#Individual)

<a name="new_Generation_new"></a>

### new Generation(generation, populations)
Create a new Generation.

Holds a population or individuals at a certain iteration or of a certain number of parents.


| Param | Type | Description |
| --- | --- | --- |
| generation | [<code>Generation</code>](#Generation) \| <code>Object</code> | Generation options. |
| generation.fitness | <code>Generation~fitness</code> | Generational fitness function. |
| generation.comparison | <code>function</code> | Generational comparison function. |
| populations | [<code>Population</code>](#Population) \| <code>Object</code> | Populations to incorporate in a generational selection and removal process. |

<a name="Generation+next"></a>

### generation.next() ⇒ [<code>Array.&lt;Individual&gt;</code>](#Individual)
Applies selection and removal to generation.

**Kind**: instance method of [<code>Generation</code>](#Generation)  
<a name="Population"></a>

## Population
**Kind**: global class  

* [Population](#Population)
    * [new Population(population)](#new_Population_new)
    * [.fossilize()](#Population+fossilize) ⇒
    * [.evolve([options], [iterations])](#Population+evolve) ⇒
    * [.stats()](#Population+stats) ⇒

<a name="new_Population_new"></a>

### new Population(population)
Holds information about an entire population of individuals.

Takes prototype individual and creates a population with the same phenotype and options.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| population | [<code>Population</code>](#Population) \| <code>Object</code> |  | Population parameters. |
| [population.identifier] | <code>String</code> | <code>&#x60;p-${getIdentifier()}&#x60;</code> | A unique string for the population. Automatically populated by UUID. |
| [population.timestamp] | <code>Date</code> \| <code>String</code> \| <code>Number</code> | <code>new Date()</code> | A timestamp of when this individual was created. |
| [population.phenotype] | [<code>Phenotype</code>](#Phenotype) \| <code>Object</code> |  | An object containing functions. |
| [population.individuals] | [<code>Array.&lt;Individual&gt;</code>](#Individual) \| <code>Array.&lt;Object&gt;</code> |  | An array of Individuals in the population. |

<a name="Population+fossilize"></a>

### population.fossilize() ⇒
Deeply copy the population.

**Kind**: instance method of [<code>Population</code>](#Population)  
**Returns**: Population - Frozen, deep copy of current population.  
<a name="Population+evolve"></a>

### population.evolve([options], [iterations]) ⇒
Create next generation.
If iterations are false or zero then it defaults to the amount of iterations in the config file.

**Kind**: instance method of [<code>Population</code>](#Population)  
**Returns**: Population  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>any</code> | <code>{fitness:(()=&gt;0)}</code> | Options for evolution. |
| [iterations] | <code>number</code> | <code>1</code> | Number of Generations to create. |

<a name="Population+stats"></a>

### population.stats() ⇒
Stub function that could return some interesting statistics on the current population of individuals.

**Kind**: instance method of [<code>Population</code>](#Population)  
**Returns**: Object  
