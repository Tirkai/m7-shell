export interface IPortalApplicationResponse<T> {
    id: string;
    name: string;
    description: string;
    guiUrl: string;
    iconUrl: string;
    readOnly: boolean;
    shellParams?: T;
}
