var solCount = null;  // Tracks solution count of Sudoku puzzle


/**
 * Determines if filled cells of specified Sudoku puzzle are valid
 * @param {Array} b - A Sudoku puzzle
 * @param {Boolean} logging - Determines if function will log messages to console
 * @return {Boolean}
 */
function isValid(b, logging=true) {
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
                if (logging === true) {
                    console.log("Invalid Sudoku.");
                }
                return false;
            }
            // If number is 0, algorithm ignores it
            if (num == 0) {
                continue;
            }
            /* Mark dictionary with number for current row/column/box, if
            number already exists then grid is invalid
            */ 
            if (rows[i][num] === undefined) {
                rows[i][num] = 1;
            } else {
                if (logging === true) {
                    console.log("Invalid Sudoku.");
                }
                return false;
            }
            if (columns[j][num] === undefined) {
                columns[j][num] = 1;
            } else {
                if (logging === true) {
                    console.log("Invalid Sudoku.");
                }
                return false;
            }
            if (boxes[box_num][num] === undefined) {
                boxes[box_num][num] = 1;
            } else {
                if (logging === true) {
                    console.log("Invalid Sudoku.");
                }
                return false;
            }
        }
    }
    if (logging === true) {
        console.log("Valid Sudoku.");
    }
    return true;
}


/**
 * Solves a valid Sudoku grid
 * @param {Array} b - A Sudoku grid
 * @param {Boolean} logging - Determines if function will log messages to console
 * @return {Boolean, Array}
 */
function solve(b, logging=true) {
    // Grid must be valid
    if (isValid(b, false) === false) {
        console.log("Cannot solve, invalid Sudoku.");
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
    if (logging === true) {
        console.log("Solving, please wait...");
    }
    // Fills all empty cells using recursive backtracking
    for (var k = 0; k < empty.length; k++) {
        if (solveHelper(b, k, empty) === true) {
            if (logging === true) {
                print(b);
            }
            return b;
        } else {
            if (logging === true) {
                console.log("Cannot solve, no solution.");
            }
            return false;
        }
    }
}


/**
 * Helper function for solve()
 * @param {Array} b - A Sudoku grid
 * @param {Number} k - Empty cell counter
 * @param {Array} empty - Array of empty cells
 * @return {Boolean}
 */
function solveHelper(b, k, empty) {
    var row = empty[k][0];
    var col = empty[k][1];
    /* Recursively tests every combination of numbers for every empty
    cell, as long as numbers do not violate Sudoku's rules
    */
    for (var l = 1; l < 10; l++) {
        b[row][col] = l;
        if (isValid(b, false) === true) {
            if (k == empty.length - 1) {
                if (solCount != null) {
                    solCount += 1;
                    continue;
                }
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
 * @param {Number} attempts - Difficulty of puzzle, higher means more difficult
 * @return {Array}
 */
function generate(attempts=10) {
    var newBoard = [[0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0]];
    // Randomly fills first row of new grid
    first = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    first = randomize(first);
    newBoard[0] = first;
    // Randomily fills rest of new grid, creating a fully filled, valid grid
    while (solve(newBoard, false) === false) {
        var ranRow = Math.floor(Math.random() * 9);
        var ranCol = Math.floor(Math.random() * 9);
        while (newBoard[ranRow][ranCol] != 0) {
            ranRow = Math.floor(Math.random() * 9);
            ranCol = Math.floor(Math.random() * 9);
        }
        newBoard[ranRow][ranCol] = Math.floor(Math.random() * 9) + 1;
        if (isValid(newBoard) === false) {
            newBoard[ranRow][ranCol] = 0;
        }
    }
    /* Generates a new puzzle by removing one cell at a time then checking
    the number of solutions possible with the board's current state. If
    it is 1, then the function continues to run. If not, we reverse the
    change made to the current cell and try again with a different cell on
    the board, until all our attempts run out.
    */
    console.log("Generating new puzzle, please wait...");
    while (attempts > 0) {
        ranRow = Math.floor(Math.random() * 9);
        ranCol = Math.floor(Math.random() * 9);
        while (newBoard[ranRow][ranCol] == 0) {
            ranRow = Math.floor(Math.random() * 9);
            ranCol = Math.floor(Math.random() * 9);
        }
        var backupNum = newBoard[ranRow][ranCol];
        newBoard[ranRow][ranCol] = 0;
        var copy = JSON.parse(JSON.stringify(newBoard));
        solCount = 0;
        solutions = solve(copy, false);
        if (solCount != 1) {
            newBoard[ranRow][ranCol] = backupNum;
            attempts -= 1;
        }

    }
    solCount = null;
    print(newBoard);
    return newBoard;
}


/**
 * Randomizes an array, helper function for generate()
 * @param {Array} a - An array of integers
 * @return {Array}
 */
function randomize(a) {
    /* Utilizes the Durstenfeld shuffle, an optimized version of
    the Fisher-Yates shuffle, to randomize an array of integers: 
    https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    */
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


/**
 * Prints a Sudoku board in a more readable format
 * @param {Array} b - A Sudoku board
 */
function print(b) {
    var copy = JSON.parse(JSON.stringify(b));
    for (i = 0; i < 9; i++) {
        if (i == 3 || i == 6) {
            console.log("---------------------");
        }
        row = copy[i];
        row.splice(3, 0, "|");
        row.splice(7, 0, "|");
        console.log(row.join(" ").toString());
    }
}

////////////////////////////////////////////////////////////////////////////

var completeGrid = [[2, 4, 6, 8, 5, 7, 9, 1, 3],
                    [1, 8, 9, 6, 4, 3, 2, 7, 5],
                    [5, 7, 3, 2, 9, 1, 4, 8, 6],
                    [4, 1, 8, 3, 2, 9, 5, 6, 7],
                    [6, 3, 7, 4, 8, 5, 1, 2, 9],
                    [9, 5, 2, 1, 7, 6, 3, 4, 8],
                    [7, 6, 4, 5, 3, 2, 8, 9, 1],
                    [3, 2, 1, 9, 6, 8, 7, 5, 4],
                    [8, 9, 5, 7, 1, 4, 6, 0, 0]];

var incompleteGrid = [[2, 0, 0, 0, 0, 7, 0, 4, 0],
                      [0, 0, 0, 0, 0, 9, 0, 0, 1],
                      [3, 7, 0, 0, 0, 6, 0, 0, 0],
                      [0, 9, 0, 0, 0, 0, 0, 0, 0],
                      [1, 0, 0, 5, 7, 0, 2, 0, 0],
                      [0, 0, 0, 0, 2, 0, 0, 3, 0],
                      [0, 0, 0, 0, 0, 0, 1, 0, 0],
                      [8, 0, 5, 0, 3, 0, 0, 2, 0],
                      [0, 4, 0, 0, 0, 0, 7, 0, 0]];

//isValid();

//solve();

//generate();