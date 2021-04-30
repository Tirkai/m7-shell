import { TileFactory } from "factories/TileFactory";
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
            ProcessEventType.OnInstantiateProcess,
            (appProcess: ApplicationProcess) => {
                this.onProcessStart(appProcess);
            },
        );

        // TODO: IMPORTANT

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnClose,
            (appWindow: ApplicationWindow) => this.onWindowClose(appWindow),
        );
    }

    presets: TilePreset[] = [];

    findCellInPresetByAttacheWindowId(preset: TilePreset, id: string) {
        return preset.cells.find((cell) => cell.attachedAppWindow?.id === id);
    }

    onWindowClose(appWindow: ApplicationWindow) {
        // TODO: Think about it
        const preset = this.store.virtualViewport.currentViewport.tilePreset;
        if (preset) {
            const cell = this.findCellInPresetByAttacheWindowId(
                preset,
                appWindow.id,
            );
            if (cell) {
                this.detachWindowFromCell(cell);
            }
        }
    }

    onProcessStart(appProcess: ApplicationProcess) {
        const preset = appProcess.viewport.tilePreset;

        if (!preset.isEmptyPreset) {
            if (preset.freeCells.length) {
                const tileCell = preset.nearbyFreeCell;
                const appWindow = appProcess.window;

                this.store.tile.attachWindowToCell(appWindow, preset, tileCell);
            } else {
                this.store.sharedEventBus.eventBus.dispatch(
                    TileEventType.OnTileGridOverflow,
                    appProcess,
                );
            }
        }
    }

    applyPreset(preset: TilePreset) {
        if (preset) {
            const clonedPreset = clone(preset);
            const createdPreset = TileFactory.createTilePreset(clonedPreset);

            this.store.sharedEventBus.eventBus.dispatch(
                TileEventType.OnChangePreset,
                createdPreset,
            );
        }
    }

    attachWindowToCell(
        appWindow: ApplicationWindow,
        preset: TilePreset,
        tileCell: TileCell,
    ) {
        if (preset.hasFreeCells) {
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

    detachAllWindows(preset: TilePreset) {
        preset.cells.forEach((item) => this.detachWindowFromCell(item));

        this.store.sharedEventBus.eventBus.dispatch(
            TileEventType.OnDetachAllWindows,
        );
    }
}
