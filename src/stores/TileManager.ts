import { TileFactory } from "factories/TileFactory";
import { clone } from "lodash";
import { makeAutoObservable, when } from "mobx";
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
            (appWindow: ApplicationWindow) => {
                const preset = this.store.virtualViewport.currentViewport
                    .tilePreset;
                if (preset) {
                    const cell = this.findCellInPresetByAttacheWindowId(
                        preset,
                        appWindow.id,
                    );
                    if (cell) {
                        this.detachWindowFromCell(cell);
                    }
                }
            },
        );

        // this.store.sharedEventBus.eventBus.add(
        //     ApplicationWindowEventType.OnCollapse,
        //     (appWindow: ApplicationWindow) => {
        //         const cell = this.findCellByAttacheWindowId(appWindow.id);
        //         if (cell) {
        //             this.detachWindowFromCell(cell);
        //         }
        //     },
        // );

        // this.store.sharedEventBus.eventBus.add(
        //     ApplicationWindowEventType.OnFullscreen,
        //     (appWindow: ApplicationWindow) => {
        //         const cell = this.findCellByAttacheWindowId(appWindow.id);
        //         if (cell) {
        //             this.detachWindowFromCell(cell);
        //         }
        //     },
        // );
    }

    presets: TilePreset[] = [];

    // activePreset: TilePreset | null = null;

    // get hasActivePreset() {
    //     return this.activePreset !== null;
    // }

    findCellInPresetByAttacheWindowId(preset: TilePreset, id: string) {
        return preset.cells.find((cell) => cell.attachedAppWindow?.id === id);
    }

    // get freeCells() {
    //     return (
    //         this.activePreset?.cells.filter(
    //             (item) => !item.hasAttachedWindow,
    //         ) ?? []
    //     );
    // }

    // get hasFreeCells() {
    //     return this.freeCells.length > 0;
    // }

    async onProcessStart(appProcess: ApplicationProcess) {
        console.log("TileManager:onProcessStart");

        // TODO: Think about it
        await when(() => !!appProcess.viewport?.tilePreset);
        const preset = appProcess.viewport?.tilePreset;

        console.log("[PRESET]", preset);

        if (preset?.freeCells) {
            console.log("FREE_CELLS", preset?.freeCells);
            const tileCell = preset.nearbyFreeCell;
            const appWindow = appProcess.window;

            this.store.tile.attachWindowToCell(appWindow, preset, tileCell);
        }
    }

    applyPreset(preset: TilePreset | null) {
        // const clonedPreset = clone(preset);

        if (preset) {
            const clonedPreset = clone(preset);
            const createdPreset = TileFactory.createTilePreset(clonedPreset);
            console.log("APPLY_PRESET", createdPreset);

            this.store.sharedEventBus.eventBus.dispatch(
                TileEventType.OnChangePreset,
                createdPreset,
            );
        } else {
            this.store.sharedEventBus.eventBus.dispatch(
                TileEventType.OnChangePreset,
                null,
            );
        }

        // this.detachAllWindows();
        // this.activePreset = clonedPreset;
    }

    // get nearbyFreeCell() {
    //     return this.freeCells[0] ?? null;
    // }

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
