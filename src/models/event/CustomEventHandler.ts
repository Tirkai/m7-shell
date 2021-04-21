import { v4 } from "uuid";

interface ICustomEventOptions {
    once?: boolean;
}

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

    async dispatch<K = any>(type: T, payload?: K) {
        return new Promise<null>((resolve) => {
            this.listeners
                .filter((item) => item.type === type)
                .forEach((item) => item.callback(payload));
            resolve(null);
        });
    }

    remove(id: string) {
        const index = this.listeners.findIndex((item) => item.id === id);
        this.listeners.splice(index, 1);
    }
}
