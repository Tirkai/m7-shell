import { IStore } from "interfaces/common/IStore";
import { computed } from "mobx";
import { inject, observer } from "mobx-react";
import { Component } from "react";

@inject("store")
@observer
export class BuildVersion extends Component<IStore> {
    @computed
    get store() {
        return this.props.store!;
    }

    render() {
        return "";
    }
}
