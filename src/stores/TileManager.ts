import { clone } from "lodash";
import { makeAutoObservable } from "mobx";
import { ApplicationWindow } from "models/ApplicationWindow";
import { TileCell } from "models/tile/TileCell";
import { TilePreset } from "models/tile/TilePreset";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { registeredTilePresets } from "registeredTilePresets";
import { AppStore } from "stores/AppStore";

export class TileManager {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        this.presets = registeredTilePresets;
    }

    presets: TilePreset[] = [];

    activePreset: TilePreset | null = null;

    get hasActivePreset() {
        return this.activePreset !== null;
    }

    get freeCells() {
        return (
            this.activePreset?.cells.filter(
                (item) => !item.hasAttachedWindow,
            ) ?? []
        );
    }

    get hasFreeCells() {
        return this.freeCells.length > 0;
    }

    applyPreset(preset: TilePreset) {
        // this.activePreset?.cells.forEach((item) =>
        //     item.setAttachedAppWindow(null),
        // );

        const clonedPreset = clone(preset);

        this.detachAllWindows();
        this.activePreset = clonedPreset;
    }

    get nearbyFreeCell() {
        return this.freeCells[0] ?? null;
    }

    attachWindowToTileCell(appWindow: ApplicationWindow, tileCell: TileCell) {
        if (this.hasFreeCells) {
            appWindow.setSize(tileCell.width, tileCell.height);
            appWindow.setPosition(tileCell.x, tileCell.y);

            // TODO: IMPORTANT
            // Clear events
            appWindow.eventTarget.add(ApplicationWindowEventType.OnClose, () =>
                tileCell.setAttachedAppWindow(null),
            );

            appWindow.eventTarget.add(
                ApplicationWindowEventType.OnFullscreen,
                () => {
                    tileCell.setAttachedAppWindow(null);
                },
            );

            appWindow.eventTarget.add(
                ApplicationWindowEventType.OnCollapse,
                () => {
                    tileCell.setAttachedAppWindow(null);
                },
            );

            tileCell.setAttachedAppWindow(appWindow);
        }
    }

    detachAllWindows() {
        console.log("DETACH_ALL_WINDOWS", this.activePreset);

        this.activePreset?.cells.forEach((item) =>
            item.setAttachedAppWindow(null),
        );
    }

    resetPreset() {
        this.activePreset = null;
    }
}
