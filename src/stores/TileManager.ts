import { TileFactory } from "factories/TileFactory";
import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ProcessEventType } from "models/process/ProcessEventType";
import { TileCell } from "models/tile/TileCell";
import { TileEventType } from "models/tile/TileEventType";
import { TilePreset } from "models/tile/TilePreset";
import { TileTemplate } from "models/tile/TileTemplate";
import { VirtualViewportEventType } from "models/virtual/VirtualViewportEventType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { IApplicationWindow } from "models/window/IApplicationWindow";
import { TileWindowModel } from "models/window/TileWindowModel";
import { registeredTileTemplates } from "registeredTilePresets";
import { AppStore } from "stores/AppStore";

export class TileManager {
    private store: AppStore;
    constructor(store: AppStore) {
        this.store = store;
        makeAutoObservable(this);

        this.templates = registeredTileTemplates;

        const [firstTemplate] = registeredTileTemplates;

        this.defaultTileTemplate = firstTemplate;

        this.store.sharedEventBus.eventBus.add(
            ProcessEventType.OnInstantiateProcess,
            (appProcess: ApplicationProcess) => {
                this.onProcessStart(appProcess);
            },
        );

        this.store.sharedEventBus.eventBus.add(
            VirtualViewportEventType.OnAddViewportFrame,
            (viewport: VirtualViewportModel) => {
                this.onAddViewportFrame(viewport);
            },
        );

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnDragStart,
            (tileWindow: TileWindowModel) => {
                //
            },
        );

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnDragStop,
            (tileWindow: TileWindowModel) => this.onDragStop(tileWindow),
        );

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnClose,
            (appWindow: ApplicationWindow) => this.onWindowClose(appWindow),
        );
    }

    templates: TileTemplate[] = [];

    defaultTileTemplate: TileTemplate;

    activeCell: TileCell | null = null;

    setActiveCell(tileCell: TileCell) {
        this.activeCell = tileCell;
    }

    onDragStop(tileWindow: TileWindowModel) {
        const currentPreset = this.store.virtualViewport.currentViewport
            .tilePreset;

        const sourceCell = currentPreset.cells.find(
            (cell) => cell.attachedAppWindow?.id === tileWindow.id,
        );

        if (sourceCell) {
            this.detachWindowFromCell(sourceCell);
        }

        if (this.activeCell) {
            if (this.activeCell.attachedAppWindow) {
                const sourceAttachedWindow = this.activeCell.attachedAppWindow;

                this.activeCell.setAttachedAppWindow(tileWindow);

                this.attachWindowToCell(
                    sourceAttachedWindow,
                    currentPreset,
                    currentPreset.nearbyFreeCell,
                );
            } else {
                this.activeCell.setAttachedAppWindow(tileWindow);
            }
            tileWindow.setArea(this.activeCell.area);
        }
    }

    onAddViewportFrame(viewport: VirtualViewportModel) {
        const preset = TileFactory.createTilePreset(this.defaultTileTemplate);
        viewport.setTilePreset(preset);
    }

    findCellInPresetByAttacheWindowId(preset: TilePreset, id: string) {
        return preset.cells.find((cell) => cell.attachedAppWindow?.id === id);
    }

    onWindowClose(appWindow: ApplicationWindow) {
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
        const preset = appProcess.window.viewport.tilePreset;

        if (!preset.isEmptyPreset) {
            if (preset.freeCells.length) {
                const tileCell = preset.nearbyFreeCell;
                const appWindow = appProcess.window;

                this.store.tile.attachWindowToCell(appWindow, preset, tileCell);
            } else {
                this.store.sharedEventBus.eventBus.dispatch(
                    TileEventType.OnTileGridOverflow,
                    [appProcess],
                );
            }
        }
    }

    applyPresetToViewport(
        template: TileTemplate,
        viewport: VirtualViewportModel,
    ) {
        if (template) {
            const createdPreset = TileFactory.createTilePreset(template);

            this.setDefaultTileTemplate(template);

            this.store.sharedEventBus.eventBus.dispatch(
                TileEventType.OnChangePreset,
                { preset: createdPreset, viewport },
            );
        }
    }

    attachWindowToCell(
        appWindow: IApplicationWindow,
        preset: TilePreset,
        tileCell: TileCell,
    ) {
        if (appWindow instanceof TileWindowModel) {
            if (preset.hasFreeCells) {
                tileCell.setAttachedAppWindow(appWindow);

                appWindow.setArea(tileCell.area);

                // appWindow.setGrid({
                //     startColumn: tileCell.startColumn,
                //     startRow: tileCell.startRow,
                //     endColumn: tileCell.endColumn,
                //     endRow: tileCell.endRow,
                // });

                this.store.sharedEventBus.eventBus.dispatch(
                    TileEventType.OnAttachWindow,
                    { appWindow, tileCell },
                );
            }
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

    setDefaultTileTemplate(template: TileTemplate) {
        this.defaultTileTemplate = template;
    }
}
