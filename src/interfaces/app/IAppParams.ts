import { ApplicationPlace } from "enum/ApplicationPlace";

export interface IAppParams {
    width?: number;
    height?: number;
    maximize?: boolean;
    item_place?: ApplicationPlace;
}
