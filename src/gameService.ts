export type Field = Record<string, boolean>;

export enum SupportedTemplate {
    glider = "glider",
    pulsar = "pulsar",
    beacon = "beacon",
}

export const getFieldKey = (x: number, y: number): string => x + "_" + y;

export const getNeighbourCellCoordinate = (currentValue: number, shift: number, fieldSize: number): number => {
    // FIXME there is an edge case when shift > fieldSize
    let newValue = currentValue + shift;
    if (newValue > fieldSize - 1) {
        newValue -= fieldSize;
    } else if (newValue < 0) {
        newValue += fieldSize;
    }

    return newValue;
};

export const getConnectionCount = (x: number, y: number, field: Field, fieldSize: number): number => {
    let count = 0;

    const xMinusOne = getNeighbourCellCoordinate(x, -1, fieldSize);
    const xPlusOne = getNeighbourCellCoordinate(x, 1, fieldSize);
    const yMinusOne = getNeighbourCellCoordinate(y, -1, fieldSize);
    const yPlusOne = getNeighbourCellCoordinate(y, 1, fieldSize);

    if (field[getFieldKey(xMinusOne, yMinusOne)]) {
        count += 1;
    }
    if (field[getFieldKey(xMinusOne, y)]) {
        count += 1;
    }
    if (field[getFieldKey(xMinusOne, yPlusOne)]) {
        count += 1;
    }
    if (field[getFieldKey(x, yMinusOne)]) {
        count += 1;
    }
    if (field[getFieldKey(x, yPlusOne)]) {
        count += 1;
    }
    if (field[getFieldKey(xPlusOne, yMinusOne)]) {
        count += 1;
    }
    if (field[getFieldKey(xPlusOne, y)]) {
        count += 1;
    }
    if (field[getFieldKey(xPlusOne, yPlusOne)]) {
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
            const key = getFieldKey(x, y);
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

            if (newIsAlive) {
                updatedField[key] = newIsAlive;
            }
        }
    }

    return {
        updatedField,
        aliveCellsCount,
    };
};

export const generateGliderPreset = (fieldSize: number): Field => {
    const field: Field = {};

    if (fieldSize < 3) {
        alert('Unable to add "glider" preset. Field is too small');
        return field;
    }

    const middlePoint = {
        x: Math.floor(fieldSize / 2),
        y: Math.floor(fieldSize / 2),
    };

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 1, fieldSize),
        )
    ] = true;
    field[getFieldKey(middlePoint.x, middlePoint.y)] = true;
    field[getFieldKey(middlePoint.x, getNeighbourCellCoordinate(middlePoint.y, 1, fieldSize))] = true;
    field[getFieldKey(getNeighbourCellCoordinate(middlePoint.x, 1, fieldSize), middlePoint.y)] = true;

    return field;
};

export const generatePulsarPreset = (fieldSize: number): Field => {
    const field: Field = {};

    if (fieldSize < 16) {
        alert('Unable to add "pulsar" preset. Field is too small');
        return field;
    }

    const middlePoint = {
        x: Math.floor(fieldSize / 2),
        y: Math.floor(fieldSize / 2),
    };

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -4, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -3, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -2, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 2, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 3, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 4, fieldSize),
        )
    ] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -4, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -6, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -4, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -4, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -4, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 6, fieldSize),
        )
    ] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -3, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -6, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -3, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -3, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -3, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 6, fieldSize),
        )
    ] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -6, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 6, fieldSize),
        )
    ] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -4, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -3, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -2, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 2, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 3, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 4, fieldSize),
        )
    ] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -4, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -3, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -2, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 2, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 3, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 4, fieldSize),
        )
    ] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -6, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 6, fieldSize),
        )
    ] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 3, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -6, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 3, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 3, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 3, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 6, fieldSize),
        )
    ] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 4, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -6, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 4, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 4, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 4, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 6, fieldSize),
        )
    ] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -4, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -3, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -2, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 2, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 3, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 6, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 4, fieldSize),
        )
    ] = true;

    return field;
};

export const generateBeaconPreset = (fieldSize: number): Field => {
    const field: Field = {};

    if (fieldSize < 4) {
        alert('Unable to add "beacon" preset. Field is too small');
        return field;
    }

    const middlePoint = {
        x: Math.floor(fieldSize / 2),
        y: Math.floor(fieldSize / 2),
    };

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, -1, fieldSize),
        )
    ] = true;
    field[getFieldKey(getNeighbourCellCoordinate(middlePoint.x, -1, fieldSize), middlePoint.y)] = true;
    field[getFieldKey(middlePoint.x, getNeighbourCellCoordinate(middlePoint.y, -1, fieldSize))] = true;

    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 1, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 2, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 1, fieldSize),
        )
    ] = true;
    field[
        getFieldKey(
            getNeighbourCellCoordinate(middlePoint.x, 2, fieldSize),
            getNeighbourCellCoordinate(middlePoint.y, 2, fieldSize),
        )
    ] = true;

    return field;
};
