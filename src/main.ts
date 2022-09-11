import { BOARD_PUZZLE_1 } from "./constants/boards.constant";
import { Board } from "./types/board.type";
import { Coordinate } from "./types/coordinate.type";
import { p } from "./utils/p.util";

const b = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 0],
];

p(b);

/** Checks if the board has already been solved */
function isSolved(board: Board): boolean {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (board[y][x] === 0) {
                return false;
            }
        }
    }
    return true;
}

/** Check if each row is valid */
function isRowValid(board: Board): boolean {
    for (let y = 0; y < 9; y++) {
        const existing: number[] = [];
        for (let x = 0; x < 9; x++) {
            const value = board[y][x];
            if (existing.includes(value)) {
                return false;
            }
            else if (value !== 0) {
                existing.push(value);
            }
        }
    }
    return true;
}

/** Check if each column is valid */
function isColValid(board: Board): boolean {
    for (let y = 0; y < 9; y++) {
        const existing: number[] = [];
        for (let x = 0; x < 9; x++) {
            const value = board[x][y];
            if (existing.includes(value)) {
                return false;
            }
            else if (value !== 0) {
                existing.push(value);
            }
        }
    }
    return true;
}

/** Check if each box is valid */
function isBoxValid(board: Board): boolean {
    const boxCoordinates: Coordinate[] = [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2],
    ];
    for (let y = 0; y < 9; y += 3) {
        for (let x = 0; x < 9; x += 3) {
            const existing: number[] = [];
            // loop in each 9 coordinates of 1 box
            for (let c = 0; c < 9; c++) {
                const coordinate = boxCoordinates[c];
                let [cy, cx] = coordinate;
                cy += y;
                cx += x;
                const value = board[cy][cx];
                if (existing.includes(value)) {
                    return false;
                }
                else if (value !== 0) {
                    existing.push(value);
                }
            }
        }
    }
    return true;
}

/** Checks if all the rows, columns, and boxes are valid */
function isBoardValid(board: Board): boolean {
    return isRowValid(board)
        && isColValid(board)
        && isBoxValid(board);
}

/** Get the first empty value in a board */
function findEmpty(board: Board): Coordinate | null {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (board[y][x] === 0) {
                return [y, x];
            }
        }
    }
    return null;
}

/** Generate posibilities or copies of the board for each empty value (1-9) */
function generatePosibilities(board: Board): Board[] {
    const posibilities = [];
    const firstEmpty = findEmpty(board);
    if (firstEmpty) {
        const [y, x] = firstEmpty;
        // * Must start at 1
        for (let i = 1; i <= 9; i++) {
            const copy = [...board];
            const row = [...copy[y]];
            row[x] = i;
            copy[y] = row;
            posibilities.push(copy);
        }
    }
    return posibilities;
}

/** Filter valid boards in the possibilities */
function filterValidBoards(posibilities: Board[]): Board[] {
    const valid = [];
    for (let i = 0; i < posibilities.length; i++) {
        const board = posibilities[i];
        if (isBoardValid(board)) {
            valid.push(board);
        }
    }
    return valid;
}

function solve(board: Board): Board | null {
    if (isSolved(board)) {
        return board;
    }

    else {
        const posibilities = generatePosibilities(board);
        const validBoards = filterValidBoards(posibilities);
        return searchSolution(validBoards);
    }
}

function searchSolution(posibilities: Board[]): Board | null {
    if (!posibilities.length) {
        return null;
    }

    else {
        const possibility = posibilities.shift();

        if (!possibility) {
            return null;
        }

        const tryPossibility = solve(possibility);

        if (tryPossibility) {
            return tryPossibility;
        }

        else {
            return searchSolution(posibilities);
        }
    }
}

const solution = solve(b);

if (solution) {
    p(solution);
} else {
    console.log('Invalid Sudoku board');
}
