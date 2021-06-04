import React from "react";

interface IConfigConditionProps {
    children: any;
    condition: boolean;
}

export const ConfigCondition = (props: IConfigConditionProps) =>
    props.condition ? props.children : <></>;
