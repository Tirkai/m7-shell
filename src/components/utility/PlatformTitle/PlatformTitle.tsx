import React, { useEffect } from "react";

interface IPlatformTitleProps {
    title: string;
}

export const PlatformTitle = (props: IPlatformTitleProps) => {
    useEffect(() => {
        document.title = props.title;
    }, [props.title]);

    return <></>;
};
