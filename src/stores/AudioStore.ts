import { isEmpty } from "lodash";
import { makeAutoObservable } from "mobx";
import { AudioModel } from "models/audio/AudioModel";
import { AuthEventType } from "models/auth/AuthEventType";
import { UserDatabasePropKey } from "models/userDatabase/UserDatabasePropKey";
import { AppStore } from "stores/AppStore";

interface IStoragedAudioData {
    [UserDatabasePropKey.Audio]: {
        volume: number;
        isMute: boolean;
    };
}

export class AudioStore {
    private store: AppStore;

    constructor(store: AppStore) {
        this.store = store;

        this.store.sharedEventBus.eventBus.add(AuthEventType.OnLogout, () =>
            this.onLogout(),
        );

        this.store.sharedEventBus.eventBus.add(AuthEventType.OnLogin, () =>
            this.onLogin(),
        );

        makeAutoObservable(this);
    }

    onLogin() {
        this.store.userDatabase
            .load<IStoragedAudioData>([UserDatabasePropKey.Audio])
            .then(({ result }) => {
                if (result && !isEmpty(result)) {
                    const data = result[UserDatabasePropKey.Audio];
                    this.setVolume(data.volume);
                    this.setMute(data.isMute);
                }
            });
    }

    onLogout() {
        this.setVolume(1);
        this.setMute(false);
    }

    audioPlayer: HTMLAudioElement = new Audio();

    queue: AudioModel[] = [];

    volume: number = 1;

    isMute: boolean = false;

    get isSoundDisable() {
        return this.isMute || this.volume <= 0;
    }

    setAudio(audio: HTMLAudioElement) {
        try {
            if (audio) {
                this.audioPlayer = audio;
                this.audioPlayer.onended = () => this.rewindQueue();
            }
        } catch (e) {
            console.error(e);
        }
    }

    get isPlaying() {
        return (
            (this.audioPlayer?.duration ?? 0) > 0 &&
            !(this.audioPlayer?.paused ?? true)
        );
    }

    rewindQueue() {
        try {
            const soundsInQueue = this.queue.filter((item) => item.awaitQueue);

            const [sound] = soundsInQueue;
            if (sound) {
                this.queue.shift();
                if (sound.awaitQueue) {
                    this.playAudio(sound);
                } else this.rewindQueue();
            }
        } catch (e) {
            console.error(e);
        }
    }

    playAudio(audio: AudioModel) {
        try {
            if (this.audioPlayer && !this.isSoundDisable) {
                if (!this.isPlaying) {
                    this.audioPlayer.src = audio.source;
                    this.audioPlayer.play();
                } else {
                    this.queue.push(audio);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    setVolume(value: number) {
        try {
            this.volume = value;
            if (this.audioPlayer) {
                this.audioPlayer.volume = this.volume;
            }

            this.setMute(this.volume <= 0);
        } catch (e) {
            console.error(e);
        }
    }

    saveUserAudio() {
        this.store.userDatabase.save([
            {
                name: UserDatabasePropKey.Audio,
                value: {
                    volume: this.volume,
                    isMute: this.isMute,
                },
            },
        ]);
    }

    setMute(value: boolean) {
        try {
            this.isMute = value;

            if (this.volume <= 0) {
                this.volume = 0.01;
            }
        } catch (e) {
            console.error(e);
        }
    }
}
