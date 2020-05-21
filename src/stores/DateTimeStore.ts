import { action, computed, observable } from "mobx";
import moment from "moment";
import { AppStore } from "./AppStore";
export class DateTimeStore {
    @observable
    date: string;
    @observable
    time: string;

    @computed
    get computedTime() {
        return this.time;
    }

    @computed
    get computedDate() {
        return this.date;
    }

    private timeFormat = "H:mm";
    private dateFormat = "D.MM.YYYY";

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        this.date = moment().format(this.dateFormat);
        this.time = moment().format(this.timeFormat);
        this.init();
    }

    @action
    init() {
        const timeout = 1000;
        setInterval(() => {
            this.date = moment().format(this.dateFormat);
            this.time = moment().format(this.timeFormat);
        }, timeout);
    }
}
