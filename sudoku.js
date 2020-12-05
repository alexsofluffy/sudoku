/**
 * Checks if the filled cells of the specified Sudoku board are valid
 * @param {Array} b - A Sudoku board
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


/**
 * Solves a valid Sudoku board
 * @param {*} b - A Sudoku board
 */
function solve(b) {
    // Board must be valid
    if (isValid(b) === false) {
        return false;
    }
    // Stores all empty cells in an array, used by helper function
    var empty = [];
    for (i  = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            var num = b[i][j];
            if (num == 0) {
                empty.push([i, j]);
            }
        }
    }
    // Fills all empty cells using recursive backtracking
    for (var k = 0; k < empty.length; k++) {
        if (solveHelper(b, k, empty) === true) {
            console.log(b);
            return true;
        }
    }
    return false;
}

/**
 * Helper function for solve()
 * @param {*} b - A Sudoku board
 * @param {*} k - Empty cell counter
 * @param {*} empty - Array of empty cells
 */
function solveHelper(b, k, empty) {
    var row = empty[k][0];
    var col = empty[k][1];
    /* Recursively tests every combination of numbers for every empty
    cell, as long as numbers do not violate Sudoku's rules
    */
    for (var l = 1; l < 10; l++) {
        b[row][col] = l;
        if (isValid(b) === true) {
            if (k == empty.length - 1) {
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


/**
 * Generates a new Sudoku puzzle
 */
function generate() {
    var newBoard = [[1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]];
    /* Randomizes first row of new puzzle, then each row after is a shift
    of the previous row by 1 or 3 cells
    */
    newBoard[0] = generateHelper(newBoard[0]);
    var prev = [...newBoard[0]];
    for (i = 1; i < 9; i++) {
        if (i == 1 || i == 2 || i == 4 || i == 5 || i == 7 || i == 8) {
            for (j = 0; j < 3; j++) {
                var num = prev.shift();
                prev.push(num);
            }
        } else {
            var num = prev.shift();
            prev.push(num);
        }
        newBoard[i] = prev;
        prev = [...newBoard[i]];
    }

    /* Further randomizes puzzle by shifting order of each row in each 
    3-row group
    */
    var randomized = [];
    var counter = 0;
    var counter2 = 0;
    for (j = 0; j < 3; j++) {
        for (k = 0; k < 3; k++) {
            randomized.push(newBoard[counter]);
            counter += 1;
        }
        randomized = generateHelper(randomized);
        for (l = 0; l < 3; l++) {
            newBoard[counter2] = randomized[l];
            counter2 += 1;
        }
        randomized = [];
    }

    



    return newBoard;
}

/**
 * Helper function for generate()
 * @param {*} a - An array of integers from 1 to 9
 */
function generateHelper(a) {
    /* Utilizes the Durstenfeld shuffle, an optimized version of
    the Fisher-Yates shuffle, to randomize the array of integers: 
    https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    */
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


function print(b) {
    console.table(b);
}





var test = [[2, 4, 6, 8, 5, 7, 9, 1, 3],
            [1, 8, 9, 6, 4, 3, 2, 7, 5],
            [5, 7, 3, 2, 9, 1, 4, 8, 6],
            [4, 1, 8, 3, 2, 9, 5, 6, 7],
            [6, 3, 7, 4, 8, 5, 1, 2, 9],
            [9, 5, 2, 1, 7, 6, 3, 4, 8],
            [7, 6, 4, 5, 3, 2, 8, 9, 1],
            [3, 2, 1, 9, 6, 8, 7, 5, 4],
            [8, 9, 5, 7, 1, 4, 6, 0, 0]];
var board = [[2, 0, 0, 0, 0, 7, 0, 4, 0],
             [0, 0, 0, 0, 0, 9, 0, 0, 1],
             [3, 7, 0, 0, 0, 6, 0, 0, 0],
             [0, 9, 0, 0, 0, 0, 0, 0, 0],
             [1, 0, 0, 5, 7, 0, 2, 0, 0],
             [0, 0, 0, 0, 2, 0, 0, 3, 0],
             [0, 0, 0, 0, 0, 0, 1, 0, 0],
             [8, 0, 5, 0, 3, 0, 0, 2, 0],
             [0, 4, 0, 0, 0, 0, 7, 0, 0]];


/*
nice = solve(board);
console.log(nice);
*/
testing = generate();
console.log(isValid(testing));