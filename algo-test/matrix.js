const Matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]]

let firstDiagonal = 0;
let secondDiagonal = 0;

for (let i = 0; i < Matrix.length; i++) {
  firstDiagonal += Matrix[i][i];
  secondDiagonal += Matrix[i][Matrix[i].length - (1 + i)];
}

const result = firstDiagonal - secondDiagonal;
console.log(result);