import { v4 } from "uuid";

interface ICustomEventListener<T, K = any> {
    id: string;
    type: T;
    callback: (payload: K) => void;
}

export class CustomEventHandler<T> {
    listeners: ICustomEventListener<T>[] = [];

    add<K>(type: T, callback: (payload: K) => void) {
        const listener = { id: v4(), type, callback };
        this.listeners.push(listener);
        return listener;
    }

    dispatch<K = any>(type: T, payload?: K) {
        this.listeners
            .filter((item) => item.type === type)
            .forEach((item) => item.callback(payload));
    }

    remove(id: string) {
        const index = this.listeners.findIndex((item) => item.id === id);
        this.listeners.splice(index, 1);
    }
}
