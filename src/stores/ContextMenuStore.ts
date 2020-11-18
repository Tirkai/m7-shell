import { makeAutoObservable } from "mobx";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { Point2D } from "models/Point2D";
import { AppStore } from "stores/AppStore";

const ITEM_HEIGHT = 40;
const OFFSET = 16;

export class ContextMenuStore {
    private store: AppStore;
    constructor(store: AppStore) {
        makeAutoObservable(this);
        this.store = store;
    }

    point: Point2D = new Point2D(500, 500);

    isShow: boolean = false;

    isReady: boolean = false;

    items: ContextMenuItemModel[] = [];

    showContextMenu(point: Point2D, items: ContextMenuItemModel[]) {
        const windowHeight = window.innerHeight;

        const resultPoint = new Point2D(point.x, point.y);

        if (point.y + items.length * ITEM_HEIGHT > windowHeight - OFFSET) {
            resultPoint.setY(
                windowHeight - items.length * ITEM_HEIGHT - OFFSET,
            );
        }

        this.items = items;
        this.isShow = true;

        this.point = resultPoint;
    }

    hideContextmenu() {
        this.isShow = false;
        this.isReady = false;
    }

    setReady(value: boolean) {
        this.isReady = value;
    }
}
