import React from "react";

interface ITileContext {
    count: number;
}

export const TileContext = React.createContext<ITileContext>({ count: 0 });
