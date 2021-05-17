import { makeAutoObservable } from "mobx";
import { ApplicationProcess } from "models/ApplicationProcess";
import { DisplayMode } from "models/display/DisplayMode";
import { DisplayModeEventType } from "models/display/DisplayModeEventType";
import { ProcessEventType } from "models/process/ProcessEventType";
import { TileCell } from "models/tile/TileCell";
import { TileEventType } from "models/tile/TileEventType";
import { TilePreset } from "models/tile/TilePreset";
import { TileTemplate } from "models/tile/TileTemplate";
import { VirtualViewportEventType } from "models/virtual/VirtualViewportEventType";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import { ApplicationWindowEventType } from "models/window/ApplicationWindowEventType";
import { ApplicationWindowType } from "models/window/ApplicationWindowType";
import { TileWindowModel } from "models/window/TileWindowModel";
import { registeredTileTemplates } from "registeredTilePresets";
import { AppStore } from "stores/AppStore";

interface IApplyPresetToViewportOptions {
    applyDefaultPreset?: boolean;
}

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
            (tileWindow: ApplicationWindow) => this.onDragStop(tileWindow),
        );

        this.store.sharedEventBus.eventBus.add(
            ApplicationWindowEventType.OnClose,
            (appWindow: ApplicationWindow) => this.onWindowClose(appWindow),
        );

        this.store.sharedEventBus.eventBus.add(
            DisplayModeEventType.OnDisplayModeChange,
            (displayMode: DisplayMode) => this.onDisplayModeChange(displayMode),
        );
    }

    templates: TileTemplate[] = [];

    defaultTileTemplate: TileTemplate;

    activeCell: TileCell | null = null;

    setActiveCell(tileCell: TileCell) {
        this.activeCell = tileCell;
    }

    onDisplayModeChange(displayMode: DisplayMode) {
        //
    }

    onDragStop(tileWindow: ApplicationWindow) {
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
        this.applyPresetToViewport(this.defaultTileTemplate, viewport);
    }

    findCellInPresetByAttacheWindowId(preset: TilePreset, id: string) {
        return preset.cells.find((cell) => cell.attachedAppWindow?.id === id);
    }

    findTileTemplateByAlias(alias: string) {
        const template = this.templates.find((item) => item.alias === alias);
        console.log(`FIND_TILE_TEMPLATE_BY_ALIAS`, { alias }, this.templates, {
            template,
        });

        return template;
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
        // Think about it

        const viewport = appProcess.window.viewport;
        const displayMode = viewport.displayMode;
        const preset = viewport.tilePreset;

        const isFullscreen = appProcess.window.isFullScreen;

        if (!isFullscreen) {
            if (displayMode?.enableTileAttach && !isFullscreen) {
                if (preset.freeCells.length) {
                    const tileCell = preset.nearbyFreeCell;
                    const appWindow = appProcess.window;

                    this.store.tile.attachWindowToCell(
                        appWindow,
                        preset,
                        tileCell,
                    );
                } else {
                    this.store.sharedEventBus.eventBus.dispatch(
                        TileEventType.OnTileViewportOverflow,
                        appProcess,
                    );
                }
            }
        } else {
            // TODO
            // Т.к. работа выполняется в основном с viewport, вынести отдельным событием и обрабатывать в ViewportManager
            const currentViewport = this.store.virtualViewport.currentViewport;
            const template = this.store.tile.findTileTemplateByAlias("1x1");
            const newViewport = new VirtualViewportModel({
                displayMode,
            });
            this.store.virtualViewport.insertViewport(
                newViewport,
                this.store.virtualViewport.currentViewport,
            );

            if (template) {
                if (preset.isEmptyPreset) {
                    this.store.tile.applyPresetToViewport(
                        template,
                        newViewport,
                    );
                    this.store.virtualViewport.applyViewportToWindow(
                        newViewport,
                        appProcess.window,
                    );
                    this.store.virtualViewport.removeViewport(currentViewport);
                } else {
                    this.store.tile.applyPresetToViewport(
                        template,
                        newViewport,
                    );

                    this.store.virtualViewport.applyViewportToWindow(
                        newViewport,
                        appProcess.window,
                    );
                }
            } else {
                console.warn("Not found template");
            }
        }
    }

    applyPresetToViewport(
        template: TileTemplate,
        viewport: VirtualViewportModel,
    ) {
        if (template) {
            // const createdPreset = TileFactory.createTilePreset(template);

            this.store.sharedEventBus.eventBus.dispatch(
                TileEventType.OnChangePreset,
                { template, viewport },
            );
        }
    }

    detachWindowFromCells(appWindow: ApplicationWindow, tileCells: TileCell[]) {
        const tileCell = tileCells.find(
            (item) => item.attachedAppWindow?.id === appWindow.id,
        );
        tileCell?.setAttachedAppWindow(null);
        this.store.sharedEventBus.eventBus.dispatch(
            TileEventType.OnDetachWindow,
            { appWindow, tileCell },
        );
    }

    attachWindowToCell(
        appWindow: ApplicationWindow,
        preset: TilePreset,
        tileCell: TileCell,
    ) {
        if (appWindow.type === ApplicationWindowType.Tile) {
            if (preset.hasFreeCells) {
                tileCell.setAttachedAppWindow(appWindow);

                appWindow.setArea(tileCell.area);

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
