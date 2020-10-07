import React, { useEffect, useState } from "react";
import { GameControls } from "./components/GameControls";
import GameField from "./components/GameField";
import { Field, updateGameStep } from "./gameService";
import "./App.scss";

const CELL_SIZE = 24; // size of 1 cell in pixels. Should be aligned with styles
const MAX_CELLS_TO_DISPLAY = 25; // amount of cells to display on big screens
const SIMULATION_STEP_INTERVAL = 1000; // time interval before next step in milliseconds

function App() {
    const [fieldSize, setFieldSize] = useState<number | null>(null);
    const [field, setField] = useState<Field>({});
    const [isGameActive, setIsGameActive] = useState(false);

    useEffect(() => {
        const amountOfCellsToDisplayOnThisDevice = Math.floor(window.innerWidth / CELL_SIZE);

        const calculatedFieldSize =
            amountOfCellsToDisplayOnThisDevice > MAX_CELLS_TO_DISPLAY
                ? MAX_CELLS_TO_DISPLAY
                : amountOfCellsToDisplayOnThisDevice;
        setFieldSize(calculatedFieldSize);
    }, []);

    useEffect(() => {
        let timeoutRef: undefined | number;

        if (isGameActive && fieldSize) {
            timeoutRef = window.setTimeout(() => {
                const { updatedField, aliveCellsCount } = updateGameStep(field, fieldSize);

                setField(updatedField);

                if (aliveCellsCount === 0) {
                    setIsGameActive(false);
                    alert("Simulation is finished");
                }
            }, SIMULATION_STEP_INTERVAL);
        }

        return () => {
            clearTimeout(timeoutRef);
        };
    }, [isGameActive, fieldSize, field]);

    const handleCellClick = ({ x, y }: { x: number; y: number }) => {
        setField((prevValue) => {
            return {
                ...prevValue,
                [`${x}_${y}`]: true,
            };
        });
    };

    if (!fieldSize) {
        return null;
    }

    return (
        <main className="page-layout">
            <GameControls
                isGameActive={isGameActive}
                onGameStart={() => setIsGameActive(true)}
                onGameStop={() => setIsGameActive(false)}
            />
            <GameField fieldSize={fieldSize} field={field} onCellClick={handleCellClick} />
        </main>
    );
}

export default App;
