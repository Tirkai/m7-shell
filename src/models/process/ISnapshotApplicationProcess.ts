import { ExternalApplication } from "models/app/ExternalApplication";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";

export interface ISnapshotApplicationProcess {
    process: {
        name: string;
        url: string;
    };
    app: ExternalApplication;
    viewport: {
        viewportId: string;
    };
    window: {
        position: { x: number; y: number };
        size: {
            width: number;
            height: number;
        };
        area: string;
        type: ApplicationWindowType;
    };
}
