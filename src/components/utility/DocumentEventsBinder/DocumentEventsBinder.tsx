import { useStore } from "hooks/useStore";
import React, { Fragment, useEffect } from "react";

export const DocumentEventsBinder = () => {
    const store = useStore();

    const onMount = () => {
        document.addEventListener(
            "touchmove",
            (event) => {
                event.preventDefault();
            },
            { passive: false },
        );

        document.addEventListener(
            "mousewheel",
            (event) => {
                event.preventDefault();
            },
            { passive: false },
        );
        document.addEventListener(
            "wheel",
            (event) => {
                event.preventDefault();
            },
            { passive: false },
        );

        document.addEventListener(
            "contextmenu",
            (event) => {
                event.preventDefault();
            },
            { passive: false },
        );

        const getCloseBrowserWindowDenied = () =>
            store.applicationManager.executedApplications.length > 0;

        window.onbeforeunload = () => getCloseBrowserWindowDenied();
    };

    useEffect(onMount, []);

    return <Fragment />;
};
