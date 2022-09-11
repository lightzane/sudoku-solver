import { Board } from "../types/board.type";

/**
 * Print the board on Terminal in a `Sudoku` format
 * @param board Sudoku board to be printed
 */
export function p(board: Board) {
    for (const y in board) {
        if (+y % 3 === 0 && +y > 0) {
            console.log('');
        }

        const rowString = board[y].join('  '); // will now have total of 24 length

        const b1 = rowString.substring(0, 8);
        const b2 = rowString.substring(9, 16);
        const b3 = rowString.substring(17);

        let r = b1.concat('  ').concat(b2).concat('  ').concat(b3);

        r = r.replace(/0/gi, '.');

        console.log(r);
    }
}
