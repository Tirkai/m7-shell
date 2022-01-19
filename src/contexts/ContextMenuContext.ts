import { Point2D } from "models/shape/Point2D";
import React from "react";

interface IContextMenuContextOptions {
    showMenu: (position: Point2D, items: React.ReactNode) => void;
    closeMenu: () => void;
    invokeWithClose: (callback: () => void) => void;

    transformEventAnchorToPoint: (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => Point2D;
}

// Это звучит как минимум забавно
export const ContextMenuContext =
    React.createContext<IContextMenuContextOptions>({
        showMenu: (_position: Point2D, _items: React.ReactNode) => undefined,
        transformEventAnchorToPoint: (
            _event: React.MouseEvent<HTMLElement, MouseEvent>,
        ) => new Point2D(0, 0),
        closeMenu: () => undefined,
        invokeWithClose: () => undefined,
    });
