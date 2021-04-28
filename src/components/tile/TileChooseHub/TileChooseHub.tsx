import { BaseHub } from "components/hub/BaseHub/BaseHub";
import { HubBackdrop } from "components/hub/HubBackdrop/HubBackdrop";
import { ShellPanelType } from "enum/ShellPanelType";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { TilePreset } from "models/tile/TilePreset";
import React from "react";
import { TileChooserGrid } from "../TileChooserGrid/TileChooserGrid";
import { TileChooserItem } from "../TileChooserItem/TileChooserItem";
import style from "./style.module.css";

const className = style.tileChooseHub;

export const TileChooseHub = observer(() => {
    const store = useStore();

    const handleApplyPreset = (preset: TilePreset) => {
        store.tile.applyPreset(preset);
        store.shell.setActivePanel(ShellPanelType.None);
    };

    const handleResetPreset = () => {
        store.tile.resetPreset();
        store.shell.setActivePanel(ShellPanelType.None);
    };

    return (
        <BaseHub show={store.shell.activePanel === ShellPanelType.TileHub}>
            <HubBackdrop>
                <TileChooserGrid>
                    {/* TODO: locale */}
                    <TileChooserItem
                        active={store.tile.activePreset === null}
                        name="нет"
                        onClick={handleResetPreset}
                    />
                    {store.tile.presets.map((preset) => (
                        <TileChooserItem
                            key={preset.id}
                            onClick={() => handleApplyPreset(preset)}
                            preset={preset}
                            active={preset.id === store.tile.activePreset?.id}
                        />
                    ))}
                </TileChooserGrid>
            </HubBackdrop>
        </BaseHub>
    );
});
