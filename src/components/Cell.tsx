import React from 'react';
import './Cell.scss';

type Props = { id: string; isAlive: boolean };

export const Cell: React.FC<Props> = ({ id, isAlive }) => (
    <td id={id} className={`cell ${isAlive ? 'alive-cell' : ''}`} />
);
