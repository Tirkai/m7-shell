import { ExternalApplication } from "models/ExternalApplication";

export interface IApplicationProcess {
    app: ExternalApplication;
    url: string;
    name: string;
    viewportId: string;
}
