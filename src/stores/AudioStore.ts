import { makeAutoObservable } from "mobx";
import { AudioModel } from "models/AudioModel";
import { AppStore } from "stores/AppStore";
export class AudioStore {
    private store: AppStore;
    private localStorageVolumeKey = "VOLUME";
    private localStorageMuteKey = "MUTE";

    constructor(store: AppStore) {
        this.store = store;

        makeAutoObservable(this);
    }

    audioPlayer: HTMLAudioElement | null = null;

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

                const volume = parseFloat(
                    localStorage.getItem(this.localStorageVolumeKey) ?? "1",
                );

                const mute = parseInt(
                    localStorage.getItem(this.localStorageMuteKey) ?? "0",
                );

                if (!isNaN(volume)) {
                    this.setVolume(volume);
                }

                if (!isNaN(mute)) {
                    this.setMute(!!mute);
                }
            } else {
                this.audioPlayer = null;
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
            // TOdo
            // this.store.message.showMessage(
            //     strings.error.anOccurredError,
            //     serviceErrorText,
            // );
        }
    }

    setVolume(value: number) {
        try {
            this.volume = value;
            if (this.audioPlayer) {
                this.audioPlayer.volume = this.volume;
            }

            this.setMute(this.volume <= 0);

            localStorage.setItem(
                this.localStorageVolumeKey,
                this.volume.toString(),
            );
        } catch (e) {
            console.error(e);
        }
    }

    setMute(value: boolean) {
        try {
            this.isMute = value;

            if (this.volume <= 0) {
                this.volume = 0.01;
            }

            const localStorageSavedValue = (this.isMute ? 1 : 0).toString();

            localStorage.setItem(
                this.localStorageMuteKey,
                localStorageSavedValue,
            );
        } catch (e) {
            console.error(e);
        }
    }
}
