import { max, min } from "lodash";
import { action, observable } from "mobx";
import { ApplicationWindow } from "models/ApplicationWindow";
import { AppStore } from "./AppStore";

export class WindowManagerStore {
    @observable
    windows: ApplicationWindow[] = [];

    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
    }

    @action
    addWindow(appWindow: ApplicationWindow) {
        appWindow.setDepthIndex(this.windows.length + 1);
        this.windows.push(appWindow);
    }

    @action
    focusWindow(appWindow: ApplicationWindow) {
        if (appWindow.isFocused) return;
        const indexes = [...this.windows.map((item) => item.depthIndex)];

        const minIndex = min(indexes);

        const maxIndex = max(indexes);

        if (minIndex && maxIndex) {
            // const appliedIndexes = [maxIndex + 1];
            this.windows.forEach((item) => {
                let index = 0;
                // appliedIndexes.unshift(item.depthIndex);
                if (item.id == appWindow.id) {
                    index = maxIndex - minIndex + 2;
                    appWindow.setFocused(true);

                    // item.setDepthIndex(maxIndex + 1);
                } else {
                    index = item.depthIndex - minIndex + 1;
                    item.setFocused(false);
                    // item.setDepthIndex(item.depthIndex - minIndex + 1);
                }
                console.log({ minIndex });
                item.setDepthIndex(index);
            });

            // const a = appliedIndexes.map((index) => index - minIndex + 1);
            // console.log({ appliedIndexes, a });
        }

        // if (minIndex && maxIndex) {
        //     const appliedIndexes = [maxIndex + 1];
        //     this.windows.forEach((item) => {
        //         appliedIndexes.unshift(item.depthIndex);
        //         if (item.id === appWindow.id) {
        //             item.setDepthIndex(maxIndex + 1);
        //         }
        //     });

        //     const a = appliedIndexes.map((index) => index - minIndex + 1);
        //     console.log({ appliedIndexes, a });
        // }
        console.log(
            this.windows.map((item) => ({
                name: item.application.name,
                depth: item.depthIndex,
            })),
        );

        // appWindow.setDepthIndex(this.windows.length + 1);

        console.log(indexes);
    }

    @action
    closeWindow(appWindow: ApplicationWindow) {
        const app = this.store.applicationManager.findById(
            appWindow.application.id,
        );
        if (app) {
            app.setExecuted(false);
        }

        this.windows.splice(this.windows.indexOf(appWindow), 1);
    }
}
