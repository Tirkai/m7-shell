import { IAppParams } from "interfaces/app/IAppParams";
import { INotificationAppRelationResponse } from "interfaces/response/INotificationAppRelationResponse";
import { IPortalApplicationResponse } from "interfaces/response/IPortalApplicationResponse";
import { ExternalApplication } from "models/ExternalApplication";

export class ApplicationFactory {
    static createExternalApplication(
        options: IPortalApplicationResponse<IAppParams>,
    ) {
        return new ExternalApplication({
            id: options.id,
            name: options.name,
            url: options.guiUrl,
            icon: options.iconUrl,
            key: options.id,
            place: options.shellParams?.item_place,
        });
    }

    static createNotificationAppRelation(
        options: INotificationAppRelationResponse,
    ) {
        return new ExternalApplication({
            id: options.app_id,
            name: options.app_name,
            url: "",
            icon: options.app_params.ICON_URL,
            key: options.app_id,
        });
    }
}
