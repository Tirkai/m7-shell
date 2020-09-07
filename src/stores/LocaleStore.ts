import { strings } from "locale";
import { observable } from "mobx";
import moment from "moment";
import { AppStore } from "./AppStore";

export class LocaleStore {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        this.setLocale(this.language);
    }

    @observable
    language: string = window.navigator.language;

    setLocale(locale: string) {
        strings.setLanguage(locale);
        moment.locale(locale);
    }
}
