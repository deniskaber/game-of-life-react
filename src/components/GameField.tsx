import React, { MouseEvent } from "react";
import { Cell } from "./Cell";
import "./GameField.scss";

type Props = {
    fieldSize: number;
    field: Record<string, boolean>;
    onCellClick: ({ x, y }: { x: number; y: number }) => void;
};

const GameField: React.FC<Props> = ({ fieldSize, field, onCellClick }) => {
    const handleCellClick = (e: MouseEvent) => {
        const targetId = (e.target as HTMLTableCellElement).id;
        const [x, y] = targetId.split("_");

        onCellClick({ x: Number(x), y: Number(y) });
    };

    const fieldSizeArray = new Array(fieldSize).fill(null);

    return (
        <table className="game-field" onClick={handleCellClick}>
            <tbody>
                {fieldSizeArray.map((_, x) => {
                    const cells = fieldSizeArray.map((_, y) => {
                        const id = `${x}_${y}`;
                        return <Cell key={id} id={id} isAlive={field[`${x}_${y}`]} />;
                    });

                    return <tr key={x}>{cells}</tr>;
                })}
            </tbody>
        </table>
    );
};

export default GameField;
