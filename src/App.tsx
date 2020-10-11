import React, { useCallback, useEffect, useState } from 'react';
import { GameControlsBlock } from './components/GameControlsBlock';
import { GameField } from './components/GameField';
import {
    Field,
    generateBeaconPreset,
    generateGliderPreset,
    generatePulsarPreset,
    getFieldKey,
    SupportedTemplate,
    calculateNextGameState,
} from './gameService';
import useWindowSize from './hooks/useWindowSize';
import './App.scss';

const CELL_SIZE = 24; // size of 1 cell in pixels. Should be aligned with styles
const MAX_CELLS_TO_DISPLAY = 25; // amount of cells to display on big screens
const SIMULATION_STEP_INTERVAL = 500; // time interval before next step in milliseconds
const AMOUNT_OF_HISTORY_RECORDS_TO_STORE = 1000;

const initFieldSize = (): number => {
    const amountOfCellsToDisplayOnThisDevice = Math.floor(window.innerWidth / CELL_SIZE);

    return amountOfCellsToDisplayOnThisDevice > MAX_CELLS_TO_DISPLAY
        ? MAX_CELLS_TO_DISPLAY
        : amountOfCellsToDisplayOnThisDevice;
};

const App: React.FC<{}> = () => {
    const [fieldSize, setFieldSize] = useState<number>(initFieldSize);
    const [field, setField] = useState<Field>({});
    const [isGameActive, setIsGameActive] = useState(false);
    const [history, setHistory] = useState<Field[]>([]);
    const windowSize = useWindowSize();
    const [maxFieldSize, setMaxFieldSize] = useState(fieldSize);

    const calculateNextStep = useCallback(() => {
        const { updatedField, aliveCellsCount } = calculateNextGameState(field, fieldSize);

        setField(updatedField);
        // game cycle can be indefinite, se we cannot possible track all history.
        setHistory((prevHistory) => [...prevHistory.slice(-AMOUNT_OF_HISTORY_RECORDS_TO_STORE), field]);

        if (aliveCellsCount === 0) {
            setIsGameActive(false);

            // show alert after rerender with empty field, when it clean and nice
            setTimeout(() => {
                alert('Simulation is finished');
            });
        }
    }, [fieldSize, field]);

    useEffect(() => {
        let timeoutRef: undefined | number;

        if (isGameActive) {
            timeoutRef = window.setTimeout(calculateNextStep, SIMULATION_STEP_INTERVAL);
        }

        return () => {
            clearTimeout(timeoutRef);
        };
    }, [isGameActive, calculateNextStep]);

    useEffect(() => {
        const amountOfCellsToDisplayOnThisDevice = Math.floor(windowSize.width / CELL_SIZE);
        setMaxFieldSize(amountOfCellsToDisplayOnThisDevice);
    }, [windowSize.width]);

    const handleCellClick = ({ x, y }: { x: number; y: number }) => {
        setField((prevValue) => {
            return {
                ...prevValue,
                [getFieldKey(x, y)]: true,
            };
        });
        // FIXME: does user interaction considered to be a new generation???
        // If so, we should create a new history record here
    };

    const handleClickReset = () => {
        setField({});
        setHistory([]);
        setIsGameActive(false);
    };

    const handleAddTemplate = (template: SupportedTemplate) => {
        let updatedField: Field | undefined;

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

        if (updatedField) {
            const hasValues = Object.values(updatedField).length > 0;
            if (!hasValues) {
                return;
            }

            setField(updatedField);
            setHistory([]);
            setIsGameActive(true);
        }
    };

    const handleClickNextStep = () => {
        calculateNextStep();
    };

    const handleClickPreviousStep = () => {
        const previousState = history[history.length - 1];

        setField(previousState);
        setHistory(history.filter((item) => item !== previousState));
    };

    const handleAddRow = () => {
        setFieldSize((prevValue) => prevValue + 1);
    };

    const handleRemoveRow = () => {
        setFieldSize((prevValue) => prevValue - 1);
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
                    <button className="controls-button" disabled={fieldSize >= maxFieldSize} onClick={handleAddRow}>
                        Increase
                    </button>
                    <button className="controls-button" disabled={fieldSize < 2} onClick={handleRemoveRow}>
                        Decrease
                    </button>
                </div>
            </GameControlsBlock>
            <GameControlsBlock>
                <span className="controls-label">Generations</span>
                <div>
                    <button className="controls-button" disabled={!history.length} onClick={handleClickPreviousStep}>
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
            <GameField fieldSize={fieldSize} field={field} onCellClick={handleCellClick} />
        </main>
    );
};

export default App;
