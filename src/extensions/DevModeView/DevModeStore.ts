import { makeAutoObservable } from "mobx";

export class DevModeStore {
    constructor() {
        makeAutoObservable(this);
    }
}
