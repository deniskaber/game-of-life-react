import React, { useEffect, useReducer, useState } from 'react';
import { GameControlsBlock } from './components/GameControlsBlock';
import { GameField } from './components/GameField';
import {
    Field,
    generateBeaconPreset,
    generateGliderPreset,
    generatePulsarPreset,
    SupportedTemplate,
} from './gameService';
import useWindowSize from './hooks/useWindowSize';
import { GameActionType, gameInitialState, gameReducer } from './gameReducer';
import { CELL_SIZE } from './config';
import './App.scss';

const SIMULATION_STEP_INTERVAL = 500; // time interval before next step in milliseconds

const App: React.FC = () => {
    const [isGameActive, setIsGameActive] = useState(false);
    const [state, dispatch] = useReducer(gameReducer, gameInitialState);
    const [maxFieldSize, setMaxFieldSize] = useState(state.fieldSize);

    const windowSize = useWindowSize();

    useEffect(() => {
        let intervalRef: undefined | number;

        if (isGameActive) {
            intervalRef = window.setInterval(() => {
                dispatch({
                    type: GameActionType.TriggerNextGeneration,
                    payload: null,
                });
            }, SIMULATION_STEP_INTERVAL);
        }

        return () => {
            clearInterval(intervalRef);
        };
    }, [isGameActive]);

    useEffect(() => {
        const amountOfCellsToDisplayOnThisDevice = Math.floor(windowSize.width / CELL_SIZE);
        setMaxFieldSize(amountOfCellsToDisplayOnThisDevice);
    }, [windowSize.width]);

    const handleCellClick = ({ x, y }: { x: number; y: number }) => {
        dispatch({
            type: GameActionType.AddAliveCell,
            payload: { x, y },
        });
    };

    const handleClickReset = () => {
        dispatch({
            type: GameActionType.Reset,
            payload: null,
        });
    };

    const handleAddTemplate = (template: SupportedTemplate) => {
        let updatedField: Field | undefined;

        const { fieldSize } = state;

        switch (template) {
            case SupportedTemplate.glider: {
                updatedField = generateGliderPreset(fieldSize);
                break;
            }
            case SupportedTemplate.pulsar: {
                updatedField = generatePulsarPreset(fieldSize);
                break;
            }
            case SupportedTemplate.beacon: {
                updatedField = generateBeaconPreset(fieldSize);
                break;
            }
            default:
                break;
        }

        if (!updatedField) {
            return;
        }

        dispatch({
            type: GameActionType.RunPreset,
            payload: updatedField,
        });

        setIsGameActive(true);
    };

    const handleClickNextStep = () => {
        dispatch({
            type: GameActionType.TriggerNextGeneration,
            payload: null,
        });
    };

    const handleClickPreviousStep = () => {
        dispatch({
            type: GameActionType.GoToPreviousGeneration,
            payload: null,
        });
    };

    const handleAddRow = () => {
        dispatch({
            type: GameActionType.IncreaseFieldSize,
            payload: null,
        });
    };

    const handleRemoveRow = () => {
        dispatch({
            type: GameActionType.DecreaseFieldSize,
            payload: null,
        });
    };

    return (
        <main className="page-layout">
            <GameControlsBlock>
                <span className="controls-label">Simulation</span>
                <div>
                    <button className="controls-button" onClick={() => setIsGameActive(!isGameActive)}>
                        {!isGameActive ? 'Start' : 'Stop'}
                    </button>
                    <button className="controls-button" onClick={handleClickReset}>
                        Reset
                    </button>
                </div>
            </GameControlsBlock>
            <GameControlsBlock>
                <span className="controls-label">Field size</span>
                <div>
                    <button
                        className="controls-button"
                        disabled={state.fieldSize >= maxFieldSize}
                        onClick={handleAddRow}
                    >
                        Increase
                    </button>
                    <button className="controls-button" disabled={state.fieldSize < 2} onClick={handleRemoveRow}>
                        Decrease
                    </button>
                </div>
            </GameControlsBlock>
            <GameControlsBlock>
                <span className="controls-label">Generations</span>
                <div>
                    <button
                        className="controls-button"
                        disabled={!state.history.length}
                        onClick={handleClickPreviousStep}
                    >
                        Previous
                    </button>
                    <button className="controls-button" onClick={handleClickNextStep}>
                        Next
                    </button>
                </div>
            </GameControlsBlock>
            <GameControlsBlock>
                <span className="controls-label">Templates</span>
                <div>
                    <button className="controls-button" onClick={() => handleAddTemplate(SupportedTemplate.glider)}>
                        Glider
                    </button>
                    <button className="controls-button" onClick={() => handleAddTemplate(SupportedTemplate.pulsar)}>
                        Pulsar
                    </button>
                    <button className="controls-button" onClick={() => handleAddTemplate(SupportedTemplate.beacon)}>
                        Beacon
                    </button>
                </div>
            </GameControlsBlock>
            <GameField fieldSize={state.fieldSize} field={state.fieldState} onCellClick={handleCellClick} />
        </main>
    );
};

export default App;
