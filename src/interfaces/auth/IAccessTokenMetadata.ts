import { RoleType } from "enum/RoleType";

export interface IAccessTokenMetadata {
    roles: RoleType[];
    host: string;
    login: string;
    created: string;
    id: string;
    expire: string;
    level: string;
}
