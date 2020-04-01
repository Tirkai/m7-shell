import { IBrowserRoute } from "interfaces/common/IBrowserRoute";
import { ExamplePage } from "pages/ExamplePage";

export const routes: IBrowserRoute[] = [
    {
        path: "/",
        exact: true,
        component: ExamplePage,
    },
];
