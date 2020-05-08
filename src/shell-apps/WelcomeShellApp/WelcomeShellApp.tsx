import { Typography } from "@material-ui/core";
import React, { Component } from "react";
import style from "./style.module.css";
export class WelcomeShellApp extends Component {
    render() {
        return (
            <div className={style.welcome}>
                <Typography variant="h4" gutterBottom>
                    Привет :з
                </Typography>
                <p>Через меню в левом нижнем углу можно запустить приложения</p>
                <p>Есть 2 типа приложений:</p>
                <ul>
                    <li>
                        <b>ExternalApplication</b> - внешние приложения который
                        подключаются в iframe. Подходит любой веб-ресурс который
                        отдает статику.
                    </li>
                    <li>
                        <b>ShellApplication</b> - внутренние приложения
                        m7-shell. Являются React компонентами, которые можно
                        выносить в отдельный пакет
                    </li>
                </ul>
                <p>
                    Данный экран приветствия является ShellApplication и
                    находится в директории src/shell-apps.
                </p>
                <p>
                    Из ExternalApplication сейчас добавлены настройки
                    АССаД-Видео, но они могут быть не доступны из за того что
                    виртуалка во внутренней сети и надо настраивать хосты
                </p>
                <p>
                    Некоторые штуки могут не работать, но если вдруг обнаружится
                    какой то косяк, то отпишите мне{" "}
                    <a href="http://t.me/Tirkai">в телегу</a>
                </p>

                <p>Спасибо :3</p>
                <p>
                    Из того что точно косячит и я это вскоре исправлю
                    <ul>
                        <li>Приоритезация рендера окон</li>
                        <li>
                            ResizeHandlers может перекрывать
                            AppWindowHeaderActions
                        </li>
                        <li>
                            Потеря фокуса при Drag And Drop при перемещении окон
                            поверх других с более высоким приоритетом отрисовки
                        </li>
                    </ul>
                </p>
            </div>
        );
    }
}
