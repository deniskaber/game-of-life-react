import React from 'react';
import './GameControlsBlock.scss';

export const GameControlsBlock: React.FC<{}> = ({ children }) => {
    return <div className="controls-container">{children}</div>;
};
