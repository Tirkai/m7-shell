import { strings } from "locale";
import { observable } from "mobx";
import moment from "moment";

export class LocaleStore {
    @observable
    language: string = window.navigator.language;

    constructor() {
        this.setLocale(this.language);
    }

    setLocale(locale: string) {
        strings.setLanguage(locale);
        moment.locale(locale);
    }
}
