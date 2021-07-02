import { SVGIcon } from "@algont/m7-ui";
import { cross } from "assets/icons";
import { strings } from "locale";
import { groupBy } from "lodash";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React, { useMemo } from "react";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import { TaskGroup } from "../TaskGroup/TaskGroup";
import style from "./style.module.css";

interface ITaskListProps {
    processes: ApplicationProcess[];
    viewports: VirtualViewportModel[];
    viewportsHash: string;
    processesHash: string;
    currentViewport: VirtualViewportModel;
    onFocus: (appWindow: ApplicationWindow) => void;
    onKillProcess: (appProcess: ApplicationProcess) => void;
}

const className = style.taskList;

export const TaskList = (props: ITaskListProps) => {
    const createCloseApplicationContextMenuItem = (
        appProcess: ApplicationProcess,
    ) => [
        new ContextMenuItemModel({
            icon: <SVGIcon source={cross} color="white" />,
            content: strings.application.actions.close,
            onClick: () => props.onKillProcess(appProcess),
        }),
    ];

    const memoTasksGroup = () => {
        const groups = groupBy(props.processes, "window.viewport.id");

        const groupedProcessesByViewport = Object.entries(groups).map(
            ([key, value]) => ({
                key,
                value,
            }),
        );

        const sortedGroups = groupedProcessesByViewport.sort(
            (first, second) => {
                const firstIndex = first.value[0].window.viewport.index;
                const secondIndex = second.value[0].window.viewport.index;
                return firstIndex - secondIndex;
            },
        );
        return sortedGroups;
    };

    const tasksGroups = useMemo(memoTasksGroup, [
        props.processesHash,
        props.viewportsHash,
        props.processes,
    ]);

    return (
        <div className={className}>
            <div className={style.container}>
                {tasksGroups.map((group, groupIndex) => (
                    <TaskGroup
                        key={group.key}
                        active={group.key === props.currentViewport.id}
                    >
                        {group.value.map((appProcess) => (
                            <TaskBarItem
                                key={appProcess.id}
                                name={appProcess.app.name}
                                displayHint={true}
                                focused={appProcess.window.isFocused}
                                onClick={() => props.onFocus(appProcess.window)}
                                menu={createCloseApplicationContextMenuItem(
                                    appProcess,
                                )}
                            >
                                <SVGIcon
                                    source={appProcess.app.icon}
                                    color="white"
                                />
                            </TaskBarItem>
                        ))}
                    </TaskGroup>
                ))}
            </div>
        </div>
    );
};
