import { v4 } from "uuid";

interface IContextMenuItemModelOptions {
    icon?: string;
    content: string;
    onClick: () => void;
}

export class ContextMenuItemModel {
    id: string;
    icon?: string;
    content: string;
    onClick: () => any;

    constructor(options: IContextMenuItemModelOptions) {
        this.id = v4();
        this.icon = options.icon;
        this.content = options.content;
        this.onClick = options.onClick;
    }
}
