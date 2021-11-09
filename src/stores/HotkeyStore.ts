import { makeAutoObservable } from "mobx";
import { KeyboardBinding } from "models/hotkey/KeyboardBinding";
import { KeyboardEventType } from "models/hotkey/KeyboardEventType";
import { AppStore } from "stores/AppStore";

export class HotkeyStore {
    private store: AppStore;

    keyBindings: KeyboardBinding[] = [];

    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        this.keyBindings = [
            new KeyboardBinding({
                inputKey: "ArrowLeft",
                useControl: true,
                eventName: KeyboardEventType.ArrowLeftWithControl,
                actionHandler: (eventName) => this.actionHandler(eventName),
            }),
            new KeyboardBinding({
                inputKey: "ArrowRight",
                useControl: true,
                eventName: KeyboardEventType.ArrowRightWithControl,
                actionHandler: (eventName) => this.actionHandler(eventName),
            }),
            new KeyboardBinding({
                inputKey: "ArrowUp",
                useControl: true,
                eventName: KeyboardEventType.ArrowUpWithControl,
                actionHandler: (eventName) => this.actionHandler(eventName),
            }),
            new KeyboardBinding({
                inputKey: "ArrowDown",
                useControl: true,
                eventName: KeyboardEventType.ArrowDownWithControl,
                actionHandler: (eventName) => this.actionHandler(eventName),
            }),
            new KeyboardBinding({
                inputKey: "ArrowDown",
                useControl: true,
                eventName: KeyboardEventType.ArrowDownWithControl,
                actionHandler: (eventName) => this.actionHandler(eventName),
            }),
        ];

        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this.keyboardHandler(
                event.key,
                event.ctrlKey,
                event.shiftKey,
                event.altKey,
            );
        });
    }

    actionHandler(eventName: string) {
        this.store.sharedEventBus.eventBus.dispatch(eventName);
    }

    keyboardHandler(
        inputKey: string,
        useControl: boolean,
        useShift: boolean,
        useAlt: boolean,
    ) {
        const matchedHandlers = this.keyBindings.filter(
            (item) =>
                item.inputKey === inputKey &&
                item.useControl === useControl &&
                item.useShift === useShift &&
                item.useAlt === useAlt,
        );

        matchedHandlers.forEach((handler) => handler.invoke());
    }
}
