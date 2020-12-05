/**
 * Checks if the filled cells of the specified Sudoku board are valid
 * @param {Array} b - A sudoku board
 * @return {Boolean}
 */
function isValid(b) {
    // Used to store the numbers discovered in each row, column and box
    var rows = {};
    var columns = {};
    var boxes = {};
    for (h = 0; h < 9; h++) {
        rows[h] = {};
        columns[h] = {};
        boxes[h] = {};
    }
    // Checks each cell in the grid
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            var num = b[i][j]
            var box_num = Math.floor(i / 3) * 3 + Math.floor(j / 3);
            // Number can't be less than 0, greater than 9, or non-integer
            if (num < 0 || num > 9 || Number.isInteger(num) === false) {
                return false;
            }
            // If number is 0, algorithm ignores it
            if (num == 0) {
                continue;
            }
            /* Mark dictionary with number for current row/column/box, if
            number already exists then board is invalid
            */ 
            if (rows[i][num] === undefined) {
                rows[i][num] = 1;
            } else {
                return false;
            }
            if (columns[j][num] === undefined) {
                columns[j][num] = 1;
            } else {
                return false;
            }
            if (boxes[box_num][num] === undefined) {
                boxes[box_num][num] = 1;
            } else {
                return false;
            }
        }
    }
    return true;
}

function solveHelper(b, k, empty) {
    var row = empty[k][0];
    var col = empty[k][1];
    for (var l = 1; l < 10; l++) {
        b[row][col] = l;
        if (isValid(b) === true) {
            if (k == empty.length - 1) {
                testing = b;
                return true;
            } else {
                if (solveHelper(b, k + 1, empty) === true) {
                    return true;
                }
            }
        }
    }
    b[row][col] = 0;
    return false;
}

function solve(b) {
    if (isValid(b) === false) {
        return false;
    }
    var empty = [];
    for (i  = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            var num = b[i][j];
            if (num == 0) {
                empty.push([i, j]);
            }
        }
    }
    for (var k = 0; k < empty.length; k++) {
        if (solveHelper(b, k, empty) === true) {
            console.log(b);
            return true;
        }
    }
    return false;
}






var test = [[2, 4, 6, 8, 5, 7, 9, 1, 3],
            [1, 8, 9, 6, 4, 3, 2, 7, 5],
            [5, 7, 3, 2, 9, 1, 4, 8, 6],
            [4, 1, 8, 3, 2, 9, 5, 6, 7],
            [6, 3, 7, 4, 8, 5, 1, 2, 9],
            [9, 5, 2, 1, 7, 6, 3, 4, 8],
            [7, 6, 4, 5, 3, 2, 8, 9, 1],
            [3, 2, 1, 9, 6, 8, 7, 5, 4],
            [8, 9, 5, 7, 1, 4, 6, 0, 0]]
var board = [[2, 0, 0, 0, 0, 7, 0, 4, 0],
             [0, 0, 0, 0, 0, 9, 0, 0, 1],
             [3, 7, 0, 0, 0, 6, 0, 0, 0],
             [0, 9, 0, 0, 0, 0, 0, 0, 0],
             [1, 0, 0, 5, 7, 0, 2, 0, 0],
             [0, 0, 0, 0, 2, 0, 0, 3, 0],
             [0, 0, 0, 0, 0, 0, 1, 0, 0],
             [8, 0, 5, 0, 3, 0, 0, 2, 0],
             [0, 4, 0, 0, 0, 0, 7, 0, 0]]



nice = solve(board);
console.log(nice);