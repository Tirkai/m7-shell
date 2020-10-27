import {
    ContentWithFooterLayout,
    ContentWithHeaderLayout,
    FormItem,
    PageHeader,
} from "@algont/m7-ui";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    DialogTitle,
    ListItem,
    Switch,
    TextField,
} from "@material-ui/core";
import classNames from "classnames";
import { FormKeyValueRow } from "components/formLayout/FormKeyValueRow/FormKeyValueRow";
import { DisplayModeType } from "enum/DisplayModeType";
import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Application } from "models/Application";
import React, { Component } from "react";
import {
    AutorunModeType,
    LaunchQueryBuilderStore,
} from "./LaunchQueryBuilderStore";
import style from "./style.module.css";

const store = new LaunchQueryBuilderStore();

@inject("store")
@observer
export class LaunchQueryBuilder extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    state = {
        showAppDialog: false,
    };

    handleChangeEnableAutoLogin = (value: boolean) => {
        store.setEnableAutoLogin(value);
    };

    handleChangeEnableAutoRun = (value: boolean) => {
        store.setEnableAutoRun(value);
    };

    handleShowChooseAppDialog = (value: boolean) => {
        this.setState({
            showAppDialog: value,
        });
    };

    handleSelectApplication = (app: Application) => {
        store.setAutoRunApp(app);

        this.setState({
            showAppDialog: false,
        });
    };

    handleChangeAutorunUrl = (value: string) => {
        store.setautoRunUrl(value);
    };

    handleSetAutorunType = (type: string) => {
        const mode = (type as unknown) as AutorunModeType;
        if (mode) {
            store.setAutoRunMode(mode);
        }
    };

    handleChangeFullscreen = (value: boolean) => {
        store.setAutoRunFullscreen(value);
    };

    handleChangeLogin = (value: string) => {
        store.setLogin(value);
    };

    handleChangePassword = (value: string) => {
        store.setPassword(value);
    };

    handleChangeDisplayMode = (value: string) => {
        const mode = value as DisplayModeType;
        store.setDisplayMode(mode);
    };

    componentWillUnmount() {
        store.reset();
    }

    render() {
        return (
            <>
                <ContentWithHeaderLayout
                    header={<PageHeader title={"Launch Query Builder"} />}
                    layoutUnitType="percent"
                    content={
                        <ContentWithFooterLayout
                            layoutUnitType="percent"
                            content={
                                <>
                                    <Accordion
                                        expanded={store.enableAutoRun}
                                        classes={{
                                            root: style.accordion,
                                            expanded: style.accordionExpanded,
                                        }}
                                    >
                                        <AccordionSummary
                                            classes={{
                                                content: style.summary,
                                                expanded: style.summaryExpanded,
                                            }}
                                        >
                                            <FormKeyValueRow>
                                                <span>Autorun</span>
                                                <span>
                                                    <Switch
                                                        color="primary"
                                                        value={
                                                            store.enableAutoRun
                                                        }
                                                        onChange={(event) =>
                                                            this.handleChangeEnableAutoRun(
                                                                event.target
                                                                    .checked,
                                                            )
                                                        }
                                                    />
                                                </span>
                                            </FormKeyValueRow>
                                        </AccordionSummary>
                                        <AccordionDetails
                                            classes={{
                                                root: style.details,
                                            }}
                                        >
                                            {store.enableAutoRun ? (
                                                <>
                                                    <FormItem>
                                                        <FormKeyValueRow>
                                                            <span>
                                                                Autorun Type
                                                            </span>
                                                            <span>
                                                                <ButtonGroup
                                                                    variant="outlined"
                                                                    color="primary"
                                                                >
                                                                    <Button
                                                                        className={classNames(
                                                                            {
                                                                                [style.activeButton]:
                                                                                    store.autoRunMode ===
                                                                                    AutorunModeType.App,
                                                                            },
                                                                        )}
                                                                        onClick={() =>
                                                                            this.handleSetAutorunType(
                                                                                AutorunModeType.App,
                                                                            )
                                                                        }
                                                                    >
                                                                        App
                                                                    </Button>
                                                                    <Button
                                                                        className={classNames(
                                                                            {
                                                                                [style.activeButton]:
                                                                                    store.autoRunMode ===
                                                                                    AutorunModeType.Url,
                                                                            },
                                                                        )}
                                                                        onClick={() =>
                                                                            this.handleSetAutorunType(
                                                                                AutorunModeType.Url,
                                                                            )
                                                                        }
                                                                    >
                                                                        Url
                                                                    </Button>
                                                                </ButtonGroup>
                                                            </span>
                                                        </FormKeyValueRow>
                                                    </FormItem>
                                                    <>
                                                        {store.autoRunMode ===
                                                            AutorunModeType.App &&
                                                        store.enableAutoRun ? (
                                                            <FormItem>
                                                                <FormKeyValueRow>
                                                                    <span>
                                                                        App
                                                                    </span>
                                                                    <span>
                                                                        <Button
                                                                            color="primary"
                                                                            variant="contained"
                                                                            onClick={() =>
                                                                                this.handleShowChooseAppDialog(
                                                                                    true,
                                                                                )
                                                                            }
                                                                        >
                                                                            {store.autoRunApp
                                                                                ? "App: " +
                                                                                  store
                                                                                      .autoRunApp
                                                                                      .name
                                                                                : "Choose"}
                                                                        </Button>
                                                                    </span>
                                                                </FormKeyValueRow>
                                                            </FormItem>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </>
                                                    <>
                                                        {store.autoRunMode ===
                                                            AutorunModeType.Url &&
                                                        store.enableAutoRun ? (
                                                            <FormItem>
                                                                <FormKeyValueRow>
                                                                    <span>
                                                                        URL
                                                                    </span>
                                                                    <span>
                                                                        <TextField
                                                                            value={
                                                                                store.autoRunUrl
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                this.handleChangeAutorunUrl(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </span>
                                                                </FormKeyValueRow>
                                                            </FormItem>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </>
                                                    <FormItem>
                                                        <FormKeyValueRow>
                                                            <span>
                                                                Fullscreen
                                                            </span>
                                                            <span>
                                                                <Switch
                                                                    color="primary"
                                                                    value={
                                                                        store.autoRunFullscreen
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        this.handleChangeFullscreen(
                                                                            event
                                                                                .target
                                                                                .checked,
                                                                        )
                                                                    }
                                                                />
                                                            </span>
                                                        </FormKeyValueRow>
                                                    </FormItem>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        classes={{
                                            root: style.accordion,
                                            expanded: style.accordionExpanded,
                                        }}
                                        expanded={store.enableAutoLogin}
                                    >
                                        <AccordionSummary
                                            classes={{
                                                content: style.summary,
                                                expanded: style.summaryExpanded,
                                            }}
                                        >
                                            <FormKeyValueRow>
                                                <span>Auto login</span>
                                                <span>
                                                    <Switch
                                                        color="primary"
                                                        value={
                                                            store.enableAutoLogin
                                                        }
                                                        onChange={(event) =>
                                                            this.handleChangeEnableAutoLogin(
                                                                event.target
                                                                    .checked,
                                                            )
                                                        }
                                                    />
                                                </span>
                                            </FormKeyValueRow>
                                        </AccordionSummary>
                                        <AccordionDetails
                                            classes={{
                                                root: style.details,
                                            }}
                                        >
                                            <FormItem>
                                                <FormKeyValueRow>
                                                    <span>Login</span>
                                                    <span>
                                                        <TextField
                                                            value={store.login}
                                                            onChange={(e) =>
                                                                this.handleChangeLogin(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                </FormKeyValueRow>
                                            </FormItem>
                                            <FormItem>
                                                <FormKeyValueRow>
                                                    <span>Password</span>
                                                    <span>
                                                        <TextField
                                                            value={
                                                                store.password
                                                            }
                                                            onChange={(e) =>
                                                                this.handleChangePassword(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                </FormKeyValueRow>
                                            </FormItem>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion
                                        classes={{
                                            root: style.accordion,
                                            expanded: style.accordionExpanded,
                                        }}
                                        expanded={false}
                                    >
                                        <AccordionSummary
                                            classes={{
                                                content: style.summary,
                                                expanded: style.summaryExpanded,
                                            }}
                                        >
                                            <FormKeyValueRow>
                                                <span>Display Mode</span>
                                                <span>
                                                    <ButtonGroup
                                                        color="primary"
                                                        variant="outlined"
                                                    >
                                                        <Button
                                                            onClick={() =>
                                                                this.handleChangeDisplayMode(
                                                                    DisplayModeType.Default,
                                                                )
                                                            }
                                                            className={classNames(
                                                                {
                                                                    [style.activeButton]:
                                                                        store.displayMode ===
                                                                        DisplayModeType.Default,
                                                                },
                                                            )}
                                                            value={
                                                                store.displayMode
                                                            }
                                                        >
                                                            Default
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                this.handleChangeDisplayMode(
                                                                    DisplayModeType.Embed,
                                                                )
                                                            }
                                                            className={classNames(
                                                                {
                                                                    [style.activeButton]:
                                                                        store.displayMode ===
                                                                        DisplayModeType.Embed,
                                                                },
                                                            )}
                                                            value={
                                                                store.displayMode
                                                            }
                                                        >
                                                            Embed
                                                        </Button>
                                                    </ButtonGroup>
                                                </span>
                                            </FormKeyValueRow>
                                        </AccordionSummary>
                                    </Accordion>
                                </>
                            }
                            footer={<TextField value={store.query} />}
                        />
                    }
                />
                <Dialog
                    open={this.state.showAppDialog}
                    fullWidth
                    onClose={() => this.handleShowChooseAppDialog(false)}
                >
                    <DialogTitle>Application</DialogTitle>
                    <DialogContent>
                        {this.store.applicationManager.applications.map(
                            (item) => (
                                <ListItem
                                    button
                                    onClick={() =>
                                        this.handleSelectApplication(item)
                                    }
                                >
                                    {item.name}
                                </ListItem>
                            ),
                        )}
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}
