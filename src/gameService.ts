export type Field = Record<string, boolean>;

export const getConnectionCount = (x: number, y: number, field: Field, fieldSize: number): number => {
    let count = 0;

    // TODO: add support for field bounds
    if (field[`${x - 1}_${y - 1}`]) {
        count += 1;
    }
    if (field[`${x - 1}_${y}`]) {
        count += 1;
    }
    if (field[`${x - 1}_${y + 1}`]) {
        count += 1;
    }
    if (field[`${x}_${y - 1}`]) {
        count += 1;
    }
    if (field[`${x}_${y + 1}`]) {
        count += 1;
    }
    if (field[`${x + 1}_${y - 1}`]) {
        count += 1;
    }
    if (field[`${x + 1}_${y}`]) {
        count += 1;
    }
    if (field[`${x + 1}_${y + 1}`]) {
        count += 1;
    }

    return count;
};

export const updateGameStep = (
    field: Field,
    fieldSize: number,
): {
    updatedField: Field;
    aliveCellsCount: number;
} => {
    const updatedField: Field = {};
    let aliveCellsCount = 0;

    for (let x = 0; x < fieldSize; x++) {
        for (let y = 0; y < fieldSize; y++) {
            // TODO: this can be encapsulated to a separate function
            const key = `${x}_${y}`;
            const isAlive = field[key];
            const connectionCount = getConnectionCount(x, y, field, fieldSize);

            let newIsAlive = false;

            if (isAlive && (connectionCount === 2 || connectionCount === 3)) {
                newIsAlive = true;
                aliveCellsCount += 1;
            } else if (!isAlive && connectionCount === 3) {
                newIsAlive = true;
                aliveCellsCount += 1;
            }

            updatedField[key] = newIsAlive;
        }
    }

    return {
        updatedField,
        aliveCellsCount,
    };
};
