import { BaseHub } from "components/hub/BaseHub/BaseHub";
import { HubBackdrop } from "components/hub/HubBackdrop/HubBackdrop";
import { ShellPanelType } from "enum/ShellPanelType";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react";
import { TileTemplate } from "models/tile/TileTemplate";
import React from "react";
import { TileChooserGrid } from "../TileChooserGrid/TileChooserGrid";
import { TileChooserItem } from "../TileChooserItem/TileChooserItem";
import style from "./style.module.css";

const className = style.tileChooseHub;

export const TileChooseHub = observer(() => {
    const store = useStore();

    const handleApplyPreset = (template: TileTemplate) => {
        store.tile.applyPreset(template);
        store.shell.setActivePanel(ShellPanelType.None);
    };

    // const handleResetPreset = () => {
    //     store.tile.applyPreset(null);
    //     store.shell.setActivePanel(ShellPanelType.None);
    // };

    return (
        <BaseHub show={store.shell.activePanel === ShellPanelType.TileHub}>
            <HubBackdrop>
                <TileChooserGrid>
                    {/* TODO: locale */}
                    {/* <TileChooserItem
                        active={
                            !store.virtualViewport.currentViewport.tilePreset
                        }
                        name="нет"
                        onClick={handleResetPreset}
                    /> */}
                    {store.tile.templates.map((template) => (
                        <TileChooserItem
                            key={template.id}
                            onClick={() => handleApplyPreset(template)}
                            template={template}
                            active={
                                template.alias ===
                                store.virtualViewport.currentViewport.tilePreset
                                    ?.alias
                            }
                        />
                    ))}
                </TileChooserGrid>
            </HubBackdrop>
        </BaseHub>
    );
});
