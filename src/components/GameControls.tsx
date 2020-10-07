import React from "react";
import "./GameControls.scss";

type Props = {
    isGameActive: boolean;
    onGameStart: () => void;
    onGameStop: () => void;
};

export const GameControls: React.FC<Props> = ({ isGameActive, onGameStart, onGameStop }) => {
    return (
        <>
            <div className="controls-container">
                <span className="controls-label">Start / stop game</span>
                <button className="controls-button" onClick={isGameActive ? onGameStop : onGameStart}>
                    {!isGameActive ? "Start" : "Stop"}
                </button>
            </div>
        </>
    );
};
