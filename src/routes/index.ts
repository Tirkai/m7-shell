import { IBrowserRoute } from "interfaces/common/IBrowserRoute";
import { MainPage } from "pages/MainPage";

export const routes: IBrowserRoute[] = [
    {
        path: "/",
        exact: true,
        component: MainPage,
    },
];
