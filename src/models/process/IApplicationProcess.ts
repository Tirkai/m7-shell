import { ExternalApplication } from "models/app/ExternalApplication";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";

export interface IApplicationProcess {
    app: ExternalApplication;
    url: string;
    name: string;
    viewportId: string;
    position: { x: number; y: number };
    area: string;
    type: ApplicationWindowType;
}
