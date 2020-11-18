import classNames from 'classnames';
import React, { Component } from "react";
import style from "./style.module.css";
import { IStore } from 'interfaces/common/IStore'
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
const className = style.appsShellMenu;
@inject('store') @observer
export class AppsShellMenu extends Component<IStore> {
    
    @computed
    get store(){
        return this.props.store!;
    }
    
    render() {
        return (
            <div className={classNames(className)}>
            
            </div>
        );
    }
}
