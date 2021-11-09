import React from "react";
import style from "./style.module.css";

interface IHubBackdropProps {
    children: React.ReactNode;
}

const className = style.hubBackdrop;

export const HubBackdrop = (props: IHubBackdropProps) => (
    <div className={className}>{props.children}</div>
);
