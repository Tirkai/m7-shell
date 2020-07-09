import { strings } from "locale";
import { observable } from "mobx";
import moment from "moment";

export class LocaleStore {
    @observable
    language: string = "en";

    constructor() {
        this.setLocale(this.language);
    }

    setLocale(locale: string) {
        strings.setLanguage(locale);
        moment.locale(locale);
    }
}
