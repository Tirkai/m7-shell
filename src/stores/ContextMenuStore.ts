import { makeAutoObservable } from "mobx";
import { ContextMenuItemModel } from "models/contextMenu/ContextMenuItemModel";
import { Point2D } from "models/shape/Point2D";
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

    items: ContextMenuItemModel[] = [];

    showContextMenu(point: Point2D, items: ContextMenuItemModel[]) {
        try {
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
        } catch (e) {
            console.error(e);
        }
    }

    hideContextMenu() {
        this.isShow = false;
    }
}
