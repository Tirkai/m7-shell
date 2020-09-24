import { Moment } from "moment";

export class DevModeModel {
    enabled: boolean;
    expire: Moment;
    constructor(enabled: boolean, expire: Moment) {
        this.enabled = enabled;
        this.expire = expire;
    }
}
