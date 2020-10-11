import React from "react";
import "./GameControlsBlock.scss";

type Props = {};

export const GameControlsBlock: React.FC<Props> = ({ children }) => {
    return <div className="controls-container">{children}</div>;
};
