import { v4 } from "uuid";

interface IEventBusListener<T = any> {
    id: string;
    type: string;
    callback: (payload: T) => void;
}

export class EventBus {
    listeners: IEventBusListener[] = [];

    add<K>(type: string, callback: (payload: K) => void) {
        const listener = { id: v4(), type, callback };
        this.listeners.push(listener);
        return listener;
    }

    async dispatch<T = any>(type: string, payload?: T) {
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
