import React from "react";
import { v4 } from "uuid";

interface IContextMenuItemModelOptions {
    icon?: React.ReactNode;
    content: string;
    onClick: () => void;
}

export class ContextMenuItemModel {
    id: string;
    icon?: React.ReactNode;
    content: string;
    onClick: () => any;

    constructor(options: IContextMenuItemModelOptions) {
        this.id = v4();
        this.icon = options.icon;
        this.content = options.content;
        this.onClick = options.onClick;
    }
}
