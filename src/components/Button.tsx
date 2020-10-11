import React, { HTMLAttributes } from "react";

export const Button: React.FC<HTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => (
    <button className={`controls-button ${className || ""}`} {...props} />
);
