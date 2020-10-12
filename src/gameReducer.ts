import { Reducer } from 'react';
import { calculateNextGeneration, Field, getFieldKey } from './gameService';
import { AMOUNT_OF_HISTORY_RECORDS_TO_STORE, CELL_SIZE, MAX_CELLS_TO_DISPLAY } from './config';

export const initFieldSize = (): number => {
    const amountOfCellsToDisplayOnThisDevice = Math.floor(window.innerWidth / CELL_SIZE);

    return amountOfCellsToDisplayOnThisDevice > MAX_CELLS_TO_DISPLAY
        ? MAX_CELLS_TO_DISPLAY
        : amountOfCellsToDisplayOnThisDevice;
};

type GameState = {
    fieldState: Field;
    fieldSize: number;
    history: Field[];
};

export const gameInitialState: GameState = {
    fieldState: {},
    fieldSize: initFieldSize(),
    history: [],
};

export enum GameActionType {
    AddAliveCell = 'AddAliveCell',
    TriggerNextGeneration = 'TriggerNextGeneration',
    Reset = 'Reset',
    IncreaseFieldSize = 'IncreaseFieldSize',
    DecreaseFieldSize = 'DecreaseFieldSize',
    RunPreset = 'RunPreset',
    GoToPreviousGeneration = 'GoToPreviousGeneration',
}

export type GameAction = {
    type: GameActionType;
    payload: any; // FIXME we can introduce specific type for every action to type payload. Skipping this for speed.
};

export const gameReducer: Reducer<GameState, GameAction> = (state, action: GameAction): GameState => {
    switch (action.type) {
        case GameActionType.TriggerNextGeneration: {
            const { fieldState, fieldSize, history } = state;
            const updatedField = calculateNextGeneration(fieldState, fieldSize);

            return {
                ...state,
                fieldState: updatedField,
                // game cycle can be indefinite, se we cannot track all possible history, hence limiting it to last X records
                history: [...history.slice(-AMOUNT_OF_HISTORY_RECORDS_TO_STORE), fieldState],
            };
        }

        case GameActionType.AddAliveCell: {
            const { fieldState } = state;
            const { x, y } = action.payload;

            // FIXME: does user interaction considered to be a new generation???
            // If so, we should create a new history record here

            return {
                ...state,
                fieldState: { ...fieldState, [getFieldKey(x, y)]: true },
            };
        }

        case GameActionType.Reset: {
            return {
                ...gameInitialState,
            };
        }

        case GameActionType.IncreaseFieldSize: {
            const { fieldSize } = state;

            return {
                ...state,
                fieldSize: fieldSize + 1,
            };
        }

        case GameActionType.DecreaseFieldSize: {
            const { fieldSize } = state;

            return {
                ...state,
                fieldSize: fieldSize - 1,
            };
        }

        case GameActionType.GoToPreviousGeneration: {
            const { history } = state;
            const previousFieldState = history[history.length - 1];

            return {
                ...state,
                fieldState: previousFieldState,
                history: history.filter((item) => item !== previousFieldState),
            };
        }

        case GameActionType.RunPreset: {
            const updatedFieldState = action.payload;

            return {
                ...state,
                fieldState: updatedFieldState,
                history: [],
            };
        }

        default:
            return state;
    }
};
