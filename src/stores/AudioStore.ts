import { action, computed, observable } from "mobx";
import { AudioModel } from "models/AudioModel";
import { AppStore } from "stores/AppStore";
export class AudioStore {
    private store: AppStore;
    private localStorageVolumeKey = "VOLUME";
    private localStorageMuteKey = "MUTE";

    constructor(store: AppStore) {
        this.store = store;
    }

    @observable
    audioPlayer: HTMLAudioElement | null = null;

    @observable
    queue: AudioModel[] = [];

    @observable
    volume: number = 1;

    @observable
    isMute: boolean = false;

    @computed
    get isSoundDisable() {
        return this.isMute || this.volume <= 0;
    }

    @action
    setAudio(audio: HTMLAudioElement) {
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
    }

    @computed
    get isPlaying() {
        return (
            (this.audioPlayer?.duration ?? 0) > 0 &&
            !(this.audioPlayer?.paused ?? true)
        );
    }

    rewindQueue() {
        const soundsInQueue = this.queue.filter((item) => item.awaitQueue);

        const [sound] = soundsInQueue;
        if (sound) {
            this.queue.shift();
            if (sound.awaitQueue) {
                this.playAudio(sound);
            } else this.rewindQueue();
        }
    }

    @action
    playAudio(audio: AudioModel) {
        if (this.audioPlayer && !this.isSoundDisable) {
            if (!this.isPlaying) {
                this.audioPlayer.src = audio.source;
                this.audioPlayer.play();
            } else {
                this.queue.push(audio);
            }
        }
    }

    @action
    setVolume(value: number) {
        this.volume = value;
        if (this.audioPlayer) {
            this.audioPlayer.volume = this.volume;
        }

        this.setMute(this.volume <= 0);

        localStorage.setItem(
            this.localStorageVolumeKey,
            this.volume.toString(),
        );
    }

    @action
    setMute(value: boolean) {
        this.isMute = value;

        const localStorageSavedValue = (this.isMute ? 1 : 0).toString();

        localStorage.setItem(this.localStorageMuteKey, localStorageSavedValue);
    }
}
