import { AudioSource } from "constants/audio";

interface IAudioModelOptions {
    source: AudioSource;
    awaitQueue: boolean;
}

export class AudioModel {
    source: AudioSource;
    awaitQueue: boolean;
    constructor(options: IAudioModelOptions) {
        this.source = options.source;
        this.awaitQueue = options.awaitQueue;
    }
}
