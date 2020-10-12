import { calculateNextGeneration, Field, getConnectionCount } from './gameService';

describe('gameService', () => {
    describe('getConnectionCount', () => {
        it('should return "0" if no alive cells connected to target cell', () => {
            const fieldSize = 3;
            const field = {};

            const connectionCount = getConnectionCount(1, 1, field, fieldSize);
            expect(connectionCount).toBe(0);
        });

        it('should return "2" if 2 alive cells connected to target cell', () => {
            const fieldSize = 3;
            const field = {
                '0_0': true,
                '2_2': true,
            };

            const connectionCount = getConnectionCount(1, 1, field, fieldSize);
            expect(connectionCount).toBe(2);
        });

        it('should return "8" if 8 alive cells connected to target cell', () => {
            const fieldSize = 3;
            const field = {
                '0_0': true,
                '0_1': true,
                '0_2': true,
                '1_0': true,
                '1_2': true,
                '2_0': true,
                '2_1': true,
                '2_2': true,
            };

            const connectionCount = getConnectionCount(1, 1, field, fieldSize);
            expect(connectionCount).toBe(8);
        });

        it('should resolve cell connections on field edges', () => {
            const fieldSize = 3;
            let field: Field = {
                '0_0': true,
                '1_0': true,
                '2_0': true,
            };

            let connectionCount = getConnectionCount(1, 2, field, fieldSize);
            expect(connectionCount).toBe(3);

            field = {
                '0_0': true,
                '0_1': true,
                '1_0': true,
            };

            connectionCount = getConnectionCount(2, 2, field, fieldSize);
            expect(connectionCount).toBe(3);
        });
    });

    describe('calculateNextGeneration', () => {
        it('should correctly handle "block" pattern', () => {
            const fieldSize = 3;
            const field = {
                '0_0': true,
                '0_1': true,
                '1_0': true,
                '1_1': true,
            };

            let nextGeneration = calculateNextGeneration(field, fieldSize);
            expect(nextGeneration).toStrictEqual(field);

            nextGeneration = calculateNextGeneration(nextGeneration, fieldSize);
            expect(nextGeneration).toStrictEqual(field);
        });

        it('should correctly handle "blinker" pattern', () => {
            const fieldSize = 5;
            const field = {
                '2_1': true,
                '2_2': true,
                '2_3': true,
            };

            let nextGeneration = calculateNextGeneration(field, fieldSize);
            expect(nextGeneration).toStrictEqual({
                '1_2': true,
                '2_2': true,
                '3_2': true,
            });

            nextGeneration = calculateNextGeneration(nextGeneration, fieldSize);
            expect(nextGeneration).toStrictEqual({
                '2_1': true,
                '2_2': true,
                '2_3': true,
            });
        });

        it('should correctly handle "glider" pattern when it moves out of field bounds', () => {
            const fieldSize = 5;
            const field = {
                '1_1': true,
                '1_3': true,
                '2_2': true,
                '2_3': true,
                '3_2': true,
            };

            let nextGeneration = calculateNextGeneration(field, fieldSize);
            nextGeneration = calculateNextGeneration(nextGeneration, fieldSize);
            nextGeneration = calculateNextGeneration(nextGeneration, fieldSize);
            nextGeneration = calculateNextGeneration(nextGeneration, fieldSize);

            expect(nextGeneration).toStrictEqual({
                '2_2': true,
                '2_4': true,
                '3_3': true,
                '3_4': true,
                '4_3': true,
            });

            nextGeneration = calculateNextGeneration(nextGeneration, fieldSize);
            nextGeneration = calculateNextGeneration(nextGeneration, fieldSize);
            nextGeneration = calculateNextGeneration(nextGeneration, fieldSize);
            nextGeneration = calculateNextGeneration(nextGeneration, fieldSize);

            expect(nextGeneration).toStrictEqual({
                '0_4': true,
                '3_0': true,
                '3_3': true,
                '4_0': true,
                '4_4': true,
            });
        });
    });
});
