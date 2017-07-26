import { Population } from "./src/Population";
import { Phenotype } from "./src/Phenotype";
import { Genome } from "./src/Genome";

let population = new Population({
  phenotype: {
    mutate: [
      {
        name: "substitution",
        selection: {
          rate: 0.05,
          selection: "mutate.1.name"
        }
      },
      {
        name: g => (g > 0.45 ? "duplication" : "removal"),
        selection: {
          rate: 0.4,
          selection: "player"
        }
      },
      {
        name: "substitution",
        selection: {
          rate: 0.1,
          selection: "mutate.3.name"
        }
      },
      {
        name: g => (g > 0.5 ? "increment" : "decrement"),
        selection: {
          rate: 0.4,
          selection: "player"
        },
        params: {
          increment: g => 1 / 9 / 10 * g * 2,
          decrement: g => 1 / 9 / 10 * g * 2
        }
      },
      {
        name: "substitution",
        selection: {
          rate: 0.1,
          selection: "mutate.5.name"
        }
      },
      {
        name: g => (g > 0.5 ? "increment" : "decrement"),
        selection: {
          rate: 0.4,
          selection: "player"
        },
        params: {
          increment: g => 1 / 10 * g * 2,
          decrement: g => 1 / 10 * g * 2
        }
      }
    ],
    player: function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
      // Convert the player epigenome into a neural network.
      // The first layer takes 9 values, the state of the board.
      // There are three states for the board. I guess I could set them as -1, 0, and 1.
      let inputs = 10,
        outputs = 9,
        network = Array.from(arguments).map(value => ({
          input: Math.floor(value * inputs),
          output: Math.floor(value * inputs % 1 * outputs),
          weight: Math.cos(Math.PI * (value * 2 * inputs * outputs - 1) + 1) / 2
        }));
      function TicTacToePlayer(piece, board) {
        let inputLayer = new Array(inputs).fill(0);
        inputLayer.splice(0, 1, piece);
        inputLayer.splice(1, 9, ...board);
        // Apply network transformation.
        let outputLayer = network.reduce((layer, { input, output, weight }) => {
          let value = inputLayer[input] * weight;
          // Set the output layer to the max input value.
          if (value > layer[output]) layer[output] = value;
          return layer;
        }, new Array(outputs).fill(0));
        let [position] = outputLayer.reduce(
          ([choiceIndex, choiceValue], value, index) =>
            // If there is no previous choice and this is a valid move.
            choiceIndex === undefined && board[index] === 0
              ? [index, value]
              : // If there is a previous choice
                choiceIndex !== undefined &&
                // this is a valid move
                board[index] === 0 &&
                // and the value is higher.
                value > choiceValue
                ? [index, value]
                : [choiceIndex, choiceValue],
          [undefined, undefined]
        );
        board[position] = piece;
      }
      //console.log(Array.from(arguments))
      return TicTacToePlayer;
    }
  },
  size: 20
});

function RandomTicTacToePlayer(piece, board) {
  // Use the randomly generated value of the genome to make copying the code easy.
  let [position] = new Array(board.length).fill(0).map(Math.random).reduce((
    [choiceIndex, choiceValue],
    value,
    index
  ) =>
    // If there is no previous choice and this is a valid move.
    choiceIndex === undefined && board[index] === 0
      ? [index, value]
      : // If there is a previous choice
        choiceIndex !== undefined &&
        // this is a valid move
        board[index] === 0 &&
        // and the value is higher.
        value > choiceValue
        ? [index, value]
        : [choiceIndex, choiceValue], [undefined, undefined]);
  board[position] = piece;
}

function TicTacToe(player1, player2) {
  // Convert the board into a string.
  let drawBoard = board => {
    let xoboard = board.map(space => (space ? (space > 0 ? "X" : "O") : " "));
    return [xoboard.slice(0, 3), xoboard.slice(3, 6), xoboard.slice(6, 9)].join(
      "\n"
    );
  };
  // Nine squares.
  let board = new Array(9).fill(0);
  // Three in a row!
  let wins = [
    // Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal
    [0, 4, 8],
    [3, 4, 6]
  ];
  // One of the "wins" is occupied by the same values 1 or -1.
  let winner = board => {
    return wins.filter(
      ([a, b, c]) =>
        (board[a] === -1 || board[a] === 1) &&
        board[a] === board[b] &&
        board[a] === board[c]
    );
  };
  let complete = () => winner(board).length > 0 || board.every(p => p !== 0);
  // Player1 starts first.
  let turn = player1;
  // Stop if the game has concluded.
  while (!complete()) {
    // X's are represented by 1, O's are represented by -1.
    let xo = turn === player1 ? 1 : -1;
    // Player is given their piece to place, and the board.
    let position = turn(xo, board);
    // Alternate turns.
    turn = turn === player1 ? player2 : player1;
  }
  //console.log("-------");
  //console.log(drawBoard(board));
  //console.log("-------");
  let winning = winner(board);
  return (winning.length && winning[0][0]) || 0;
}

for (let i = 0; i < 2000; i++) {
  console.log("Generation", i)
  population.evolve({
    removal: individuals => {
      return individuals.slice(0);
    },
    survival: individuals => {
      return individuals.slice(0, 1);
    },
    groups: 5,
    fitness: (individual, group) => {
      let results = group
        .map(opponent =>
          TicTacToe(opponent.traits.player, individual.traits.player)
        )
        .concat(
          new Array(10)
            .fill(0)
            .map(() =>
              TicTacToe(individual.traits.player, RandomTicTacToePlayer)
            )
        )
        .concat(
          new Array(10)
            .fill(0)
            .map(() =>
              TicTacToe(RandomTicTacToePlayer, individual.traits.player)
            )
        )
        .filter(result => result <= 0).length;
      if (20 + group.length - results < 2) {
        console.log(individual.epigenome.selection("player").map((i) => individual.genome[i]))
        console.log(20 + group.length - results, group.length);
      }
      return 20 + group.length - results;
    }
  });
}
