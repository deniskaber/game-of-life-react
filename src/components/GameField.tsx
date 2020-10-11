import React, { MouseEvent, useCallback, useMemo } from 'react';
import { Cell } from './Cell';
import './GameField.scss';
import { getFieldKey } from '../gameService';

type Props = {
    fieldSize: number;
    field: Record<string, boolean>;
    onCellClick: ({ x, y }: { x: number; y: number }) => void;
};

export const GameField: React.FC<Props> = ({ fieldSize, field, onCellClick }) => {
    const handleCellClick = useCallback(
        (e: MouseEvent) => {
            const targetId = (e.target as HTMLTableCellElement).id;
            const [x, y] = targetId.split('_');

            onCellClick({ x: Number(x), y: Number(y) });
        },
        [onCellClick],
    );

    const fieldSizeArray = useMemo(() => new Array(fieldSize).fill(null), [fieldSize]);

    return (
        <table className="game-field" onClick={handleCellClick}>
            <tbody>
                {fieldSizeArray.map((_, x) => {
                    const cells = fieldSizeArray.map((_, y) => {
                        const id = getFieldKey(x, y);
                        return <Cell key={id} id={id} isAlive={field[id]} />;
                    });

                    return <tr key={x}>{cells}</tr>;
                })}
            </tbody>
        </table>
    );
};
