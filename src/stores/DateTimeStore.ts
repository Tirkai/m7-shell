import { makeAutoObservable } from "mobx";
import moment from "moment";
import { AppStore } from "./AppStore";
export class DateTimeStore {
    date: string;
    time: string;

    get computedTime() {
        return this.time;
    }

    get computedDate() {
        return this.date;
    }

    private timeFormat = "H:mm";
    private dateFormat = "D.MM.YYYY";

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);

        this.date = moment().format(this.dateFormat);
        this.time = moment().format(this.timeFormat);
        this.init();
    }

    init() {
        try {
            const timeout = 1000;
            setInterval(() => {
                this.setDate(moment().format(this.dateFormat));
                this.setTime(moment().format(this.timeFormat));
            }, timeout);
        } catch (e) {
            console.error(e);
        }
    }

    setDate(value: string) {
        this.date = value;
    }

    setTime(value: string) {
        this.time = value;
    }
}
