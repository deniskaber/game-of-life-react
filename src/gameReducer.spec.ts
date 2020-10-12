import { initFieldSize } from './gameReducer';
import { CELL_SIZE, MAX_CELLS_TO_DISPLAY } from './config';

describe('gameReducer', () => {
    describe('initFieldSize', () => {
        it('should calculate fieldSize based on available screen width', () => {
            let amountOfCellsToDisplay: number;

            // small screen
            Object.defineProperty(window, 'innerWidth', {
                configurable: true,
                writable: true,
                value: 300,
            });

            amountOfCellsToDisplay = initFieldSize();
            expect(amountOfCellsToDisplay).toBe(Math.floor(300 / CELL_SIZE));

            // big screen
            Object.defineProperty(window, 'innerWidth', {
                configurable: true,
                writable: true,
                value: 1024,
            });

            amountOfCellsToDisplay = initFieldSize();
            expect(amountOfCellsToDisplay).toBe(MAX_CELLS_TO_DISPLAY);
        });
    });
});
