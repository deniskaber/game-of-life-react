import React, { useCallback, useEffect, useState } from "react";
import { GameControlsBlock } from "./components/GameControlsBlock";
import GameField from "./components/GameField";
import {
    Field,
    generateBeaconPreset,
    generateGliderPreset,
    generatePulsarPreset,
    SupportedTemplate,
    updateGameStep,
} from "./gameService";
import "./App.scss";

const CELL_SIZE = 24; // size of 1 cell in pixels. Should be aligned with styles
const MAX_CELLS_TO_DISPLAY = 25; // amount of cells to display on big screens
const SIMULATION_STEP_INTERVAL = 1000; // time interval before next step in milliseconds

const initFieldSize = (): number => {
    const amountOfCellsToDisplayOnThisDevice = Math.floor(window.innerWidth / CELL_SIZE);

    return amountOfCellsToDisplayOnThisDevice > MAX_CELLS_TO_DISPLAY
        ? MAX_CELLS_TO_DISPLAY
        : amountOfCellsToDisplayOnThisDevice;
};

function App() {
    const [fieldSize, setFieldSize] = useState<number>(initFieldSize);
    const [field, setField] = useState<Field>({});
    const [isGameActive, setIsGameActive] = useState(false);
    const [history, setHistory] = useState<Field[]>([]);

    const calculateNextStep = useCallback(() => {
        const { updatedField, aliveCellsCount } = updateGameStep(field, fieldSize);

        setField(updatedField);
        setHistory((prevHistory) => [...prevHistory, field]);

        if (aliveCellsCount === 0) {
            setIsGameActive(false);
            alert("Simulation is finished");
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

    const handleCellClick = useCallback(({ x, y }: { x: number; y: number }) => {
        setField((prevValue) => {
            return {
                ...prevValue,
                [`${x}_${y}`]: true,
            };
        });
        // FIXME: does user interaction considered to be a new generation???
        // If so, we should create a new history record here
    }, []);

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

    return (
        <main className="page-layout">
            <GameControlsBlock>
                <span className="controls-label">Start / stop game</span>
                <button className="controls-button" onClick={() => setIsGameActive(!isGameActive)}>
                    {!isGameActive ? "Start" : "Stop"}
                </button>
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
}

export default App;
