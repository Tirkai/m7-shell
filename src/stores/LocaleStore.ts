import { strings } from "locale";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import { AppStore } from "./AppStore";

export class LocaleStore {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        this.setLocale(this.language);
    }

    language: string = window.navigator.language;

    setLocale(locale: string) {
        try {
            strings.setLanguage(locale);
            moment.locale(locale);
        } catch (e) {
            console.error(e);
        }
    }
}
