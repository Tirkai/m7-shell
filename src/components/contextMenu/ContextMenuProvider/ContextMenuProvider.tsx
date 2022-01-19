import { ContextMenuContext } from "contexts/ContextMenuContext";
import { Point2D } from "models/shape/Point2D";
import React, { useState } from "react";
import { ShellContextMenu } from "../ShellContextMenu/ShellContextMenu";
import { ShellContextMenuOverlay } from "../ShellContextMenuOverlay/ShellContextMenuOverlay";

interface IContextMenuProviderProps {
    children: React.ReactNode;
}

export const ContextMenuProvider = (props: IContextMenuProviderProps) => {
    const [isShow, setShow] = useState<boolean>(false);
    const [position, setPosition] = useState<Point2D>(new Point2D(0, 0));
    const [content, setContent] = useState<React.ReactNode | null>(null);

    const showMenu = (position: Point2D, items: React.ReactNode) => {
        setShow(true);
        setPosition(position);
        setContent(items);
    };

    const closeMenu = () => {
        setShow(false);
    };

    const invokeWithClose = (callback: () => any) => {
        callback();
        closeMenu();
    };

    const transformEventAnchorToPoint = (
        event: React.MouseEvent<HTMLElement, MouseEvent>,
    ) => {
        const { pageX, pageY } = event;
        return new Point2D(pageX, pageY);
    };

    return (
        <ContextMenuContext.Provider
            value={{
                showMenu,
                transformEventAnchorToPoint,
                closeMenu,
                invokeWithClose,
            }}
        >
            {props.children}

            <ShellContextMenu isShow={isShow} position={position}>
                {content}
            </ShellContextMenu>
            <ShellContextMenuOverlay isShow={isShow} onClick={closeMenu} />
        </ContextMenuContext.Provider>
    );
};
