import { configure, addDecorator, addParameters } from "@storybook/react";
import { addReadme } from "storybook-readme/html";
const viewports = {
    FullHD: {
        name: "1920x1080",
        styles: {
            width: "1920px",
            height: "1080px",
        },
    },
    HD: {
        name: "1280x768",
        styles: {
            width: "1280px",
            height: "768px",
        },
    },
    Medium: {
        name: "1024x768",
        styles: {
            width: "1024px",
            height: "768px",
        },
    },
    Small: {
        name: "800x480",
        styles: {
            width: "800px",
            height: "480px",
        },
    },
};

addParameters({
    viewport: { viewports },
});

addDecorator(addReadme);
configure(require.context("../src", true, /\.stories\.tsx$/), module);
