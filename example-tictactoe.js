import { Population } from "./src/Population";

let population = new Population({
  phenotype: {
    mutate: [
      {
        name: g => (g > 0.5 ? "increment" : "decrement"),
        selection: {
          rate: 0.4
        },
        params: {
          increment: 0.03,
          decrement: 0.03
        }
      },
      {
        name: g => (g > 0.5 ? "duplication" : "removal"),
        selection: {
          rate: 0.1
        }
      },
      {
        name: "substitution",
        selection: 0.01
      }
    ],
    player: function() {
      // Convert the player epigenome into a neural network.
      // The first layer takes 9 values, the state of the board.
      // There are three states for the board. I guess I could set them as -1, 0, and 1.
    },
    ticTacToePlayer: function() {}
  },
  size: 50
});

function TicTacToe(player1, player2) {
  let board = new Array(9).fill(0);
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
  let winner = board => {
    return wins.filter(
      ([a, b, c]) =>
        (board[a] === -1 || board[a] === 1) &&
        board[a] === board[b] &&
        board[a] === board[c]
    );
  };
  let complete = () => winner(board) || board.every(p => p != 0);
}

for (let i = 0; i < 25000; i++) {
  population.evolve({
    removal: individuals => {
      console.log(
        individuals[0].traits.valueA(),
        "_____",
        individuals[0].traits.valueB()
      );
      return individuals.slice(0, 4);
    },
    survival: individuals => {
      return individuals.slice(0, 1);
    },
    groups: 5,
    fitness: (individual, group) => {
      var game = TicTacToe.bind(null, individual.traits.player);
      return group.map(opponent => game(opponent.traits.player));
    }
  });
}
