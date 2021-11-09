import React, { useEffect } from "react";

interface IPlatformTitleProps {
    title: string;
    favicon: string;
}

export const PlatformTitle = (props: IPlatformTitleProps) => {
    useEffect(() => {
        document.title = props.title;

        const faviconElement = document.querySelector(
            "link[rel='shortcut icon']",
        );

        if (faviconElement) {
            faviconElement.setAttribute("href", props.favicon);
        }
    }, [props.title]);

    return <></>;
};
