import { clone } from "lodash";
import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ProcessEventType } from "models/process/ProcessEventType";
import { TileCell } from "models/tile/TileCell";
import { TileEventType } from "models/tile/TileEventType";
import { TilePreset } from "models/tile/TilePreset";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { registeredTilePresets } from "registeredTilePresets";
import { AppStore } from "stores/AppStore";

export class TileManager {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        this.presets = registeredTilePresets;

        this.store.sharedEventBus.eventBus.add(
            ProcessEventType.StartProcess,
            (appProcess: ApplicationProcess) => {
                this.onProcessStart(appProcess);
            },
        );

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnClose,
            (appWindow: ApplicationWindow) => {
                const cell = this.findCellByAttacheWindowId(appWindow.id);
                if (cell) {
                    this.detachWindowFromCell(cell);
                }
            },
        );

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnCollapse,
            (appWindow: ApplicationWindow) => {
                const cell = this.findCellByAttacheWindowId(appWindow.id);
                if (cell) {
                    this.detachWindowFromCell(cell);
                }
            },
        );

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnFullscreen,
            (appWindow: ApplicationWindow) => {
                const cell = this.findCellByAttacheWindowId(appWindow.id);
                if (cell) {
                    this.detachWindowFromCell(cell);
                }
            },
        );
    }

    presets: TilePreset[] = [];

    activePreset: TilePreset | null = null;

    get hasActivePreset() {
        return this.activePreset !== null;
    }

    findCellByAttacheWindowId(id: string) {
        return this.activePreset?.cells.find(
            (cell) => cell.attachedAppWindow?.id === id,
        );
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

    onProcessStart(appProcess: ApplicationProcess) {
        if (this.hasActivePreset && this.freeCells) {
            const tileCell = this.nearbyFreeCell;
            const appWindow = appProcess.window;

            this.store.tile.attachWindowToCell(appWindow, tileCell);
        }
    }

    applyPreset(preset: TilePreset) {
        const clonedPreset = clone(preset);

        this.detachAllWindows();
        this.activePreset = clonedPreset;

        this.store.sharedEventBus.eventBus.dispatch(
            TileEventType.OnChangePreset,
            clonedPreset,
        );
    }

    get nearbyFreeCell() {
        return this.freeCells[0] ?? null;
    }

    attachWindowToCell(appWindow: ApplicationWindow, tileCell: TileCell) {
        if (this.hasFreeCells) {
            appWindow.setSize(tileCell.width, tileCell.height);
            appWindow.setPosition(tileCell.x, tileCell.y);

            tileCell.setAttachedAppWindow(appWindow);

            this.store.sharedEventBus.eventBus.dispatch(
                TileEventType.OnAttachWindow,
                { appWindow, tileCell },
            );
        }
    }

    detachWindowFromCell(tileCell: TileCell) {
        const appWindow = tileCell.attachedAppWindow;

        tileCell.setAttachedAppWindow(null);
        this.store.sharedEventBus.eventBus.dispatch(
            TileEventType.OnDetachWindow,
            { appWindow, tileCell },
        );
    }

    detachAllWindows() {
        this.activePreset?.cells.forEach((item) =>
            this.detachWindowFromCell(item),
        );

        this.store.sharedEventBus.eventBus.dispatch(
            TileEventType.OnDetachAllWindows,
        );
    }

    resetPreset() {
        this.activePreset = null;
    }
}
