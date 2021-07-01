import { SVGIcon } from "@algont/m7-ui";
import { cross } from "assets/icons";
import { useStore } from "hooks/useStore";
import { strings } from "locale";
import { groupBy } from "lodash";
import { observer } from "mobx-react";
import { ApplicationProcess } from "models/ApplicationProcess";
import { ContextMenuItemModel } from "models/ContextMenuItemModel";
import { VirtualViewportModel } from "models/virtual/VirtualViewportModel";
import { ApplicationWindow } from "models/window/ApplicationWindow";
import React, { useMemo } from "react";
import { TaskBarItem } from "../TaskBarItem/TaskBarItem";
import { TaskGroup } from "../TaskGroup/TaskGroup";
import style from "./style.module.css";

interface ITaskListOverflowState {
    isOverflow: boolean;
    sliceCount: number;
}

interface ITaskListProps {
    processes: ApplicationProcess[];
    // processesCount: number;
    viewports: VirtualViewportModel[];
    // viewportsCount: number;
    viewportsHash: string;
    processesHash: string;
    currentViewport: VirtualViewportModel;
    onFocus: (appWindow: ApplicationWindow) => void;
    onKillProcess: (appProcess: ApplicationProcess) => void;
}

const className = style.taskList;

export const TaskList = observer((props: ITaskListProps) => {
    const store = useStore();

    // const [isOverflow, setOverflow] = useState(false);

    // const [sliceCount, setSliceCount] = useState(0);

    // const [listOverflow, setListOverflow] = useState<ITaskListOverflowState>({
    //     isOverflow: false,
    //     sliceCount: 0,
    // });

    const createCloseApplicationContextMenuItem = (
        appProcess: ApplicationProcess,
    ) => [
        new ContextMenuItemModel({
            icon: <SVGIcon source={cross} color="white" />,
            content: strings.application.actions.close,
            onClick: () => props.onKillProcess(appProcess),
        }),
    ];

    // const rootRef = useRef<HTMLDivElement | null>(null);
    // const containerRef = useRef<HTMLDivElement | null>(null);

    // useEffect(() => {
    //     if (rootRef && containerRef) {
    //         const rootRect = rootRef.current?.getBoundingClientRect();
    //         const containerRect = containerRef.current?.getBoundingClientRect();

    //         const rootWidth = rootRect?.width ?? 0;
    //         const containerWidth = containerRect?.width ?? 0;
    //         console.log({ rootWidth, containerWidth });

    //         const taskGroupWidth = 100;
    //         const taskItemWidth = 48;

    //         const isOverflowWidth =
    //             rootWidth - taskGroupWidth <= containerWidth;

    //         if (isOverflowWidth && !isOverflow) {
    //             setOverflow(true);
    //             setSliceCount(props.processesCount);
    //         }

    //         if (!isOverflowWidth) {
    //             setOverflow(false);
    //         }
    //     }
    // }, [props.processesCount, props.viewportsCount]);

    const tasksGroups = useMemo(() => {
        // const slicedProcesses = isOverflow
        //     ? props.processes.slice(0, sliceCount)
        //     : props.processes;

        const groups = groupBy(props.processes, "window.viewport.id");

        // TODO: optimize
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
    }, [props.processesHash, props.viewportsHash]);

    // const handleShowOverflowMenu = (e: React.MouseEvent) => {
    //     console.log(props.processes, sliceCount);

    //     const sliceProcesses = props.processes.slice(sliceCount);

    //     store.contextMenu.showContextMenu(
    //         new Point2D(e.pageX, e.pageY),
    //         sliceProcesses.map(
    //             (item) =>
    //                 new ContextMenuItemModel({
    //                     icon: (
    //                         <SVGIcon
    //                             source={item.app.icon}
    //                             size={{ width: "16px", height: "16px" }}
    //                             color="white"
    //                         />
    //                     ),
    //                     content: item.app.name,
    //                     onClick: () => props.onFocus(item.window),
    //                 }),
    //         ),
    //     );
    // };

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
});
