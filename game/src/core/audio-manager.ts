export type AudioChannel = 'bgm' | 'bgs' | 'me' | 'se';

export interface AudioTrackOptions {
    volume?: number;
    loop?: boolean;
}

export class AudioManager {
    private bgmAudio: HTMLAudioElement | null = null;
    private bgsAudio: HTMLAudioElement | null = null;
    private meAudio: HTMLAudioElement | null = null;

    private sePool: HTMLAudioElement[] = [];

    private volumes: Record<AudioChannel, number> = {
        bgm: 1.0,
        bgs: 1.0,
        me: 1.0,
        se: 1.0
    };

    private globalVolume: number = 1.0;

    constructor() {}

    public playBgm(src: string, options: AudioTrackOptions = {}): void {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio = null;
        }

        this.bgmAudio = new Audio(src);
        this.bgmAudio.loop = options.loop ?? true;
        this.bgmAudio.volume = (options.volume ?? 1.0) * this.volumes.bgm * this.globalVolume;

        this.bgmAudio.play().catch(error => {
            console.warn(`AudioManager: Failed to play BGM (${src}):`, error);
        });
    }

    public stopBgm(): void {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio = null;
        }
    }

    public playBgs(src: string, options: AudioTrackOptions = {}): void {
        if (this.bgsAudio) {
            this.bgsAudio.pause();
            this.bgsAudio = null;
        }

        this.bgsAudio = new Audio(src);
        this.bgsAudio.loop = options.loop ?? true;
        this.bgsAudio.volume = (options.volume ?? 1.0) * this.volumes.bgs * this.globalVolume;

        this.bgsAudio.play().catch(error => {
            console.warn(`AudioManager: Failed to play BGS (${src}):`, error);
        });
    }

    public stopBgs(): void {
        if (this.bgsAudio) {
            this.bgsAudio.pause();
            this.bgsAudio = null;
        }
    }

    public playME(src: string, options: AudioTrackOptions = {}): Promise<void> {
        return new Promise((resolve) => {
            if (this.meAudio) {
                this.meAudio.pause();
                this.meAudio = null;
            }

            this.meAudio = new Audio(src);
            this.meAudio.loop = options.loop ?? false;
            this.meAudio.volume = (options.volume ?? 1.0) * this.volumes.me * this.globalVolume;

            this.meAudio.play().catch(error => {
                console.warn(`AudioManager: Failed to play ME (${src}):`, error);
                resolve();
            });
        });
    }

    public stopMe(): void {
        if (this.meAudio) {
            this.meAudio.pause();
            this.meAudio = null;
        }
    }

    public playSe(src: string, options: AudioTrackOptions = {}): void {
        const se = new Audio(src);
        se.loop = options.loop ?? false;
        se.volume = (options.volume ?? 1.0) * this.volumes.se * this.globalVolume;

        se.onended = () => {
            const index = this.sePool.indexOf(se);
            if (index !== -1) {
                this.sePool.splice(index, 1);
            }
        };

        this.sePool.push(se);
        se.play().catch(error => {
            console.warn(`AudioManager: Failed to play SE (${src}):`, error);
        });
    }

    public setChannelVolume(channel: AudioChannel, volume: number): void {
        this.volumes[channel] = Math.max(0, Math.min(1, volume));
        this.updateActiveVolumes();
    }

    public setGlobalVolume(volume: number): void {
        this.globalVolume = Math.max(0, Math.min(1, volume));
    }

    public getChannelVolume(channel: AudioChannel): number {
        return this.volumes[channel];
    }

    public updateActiveVolumes(): void {
        if (this.bgmAudio) {
            this.bgmAudio.volume = this.volumes.bgm * this.globalVolume;
        }
        if (this.bgsAudio) {
            this.bgsAudio.volume = this.volumes.bgs * this.globalVolume;
        }
        if (this.meAudio) {
            this.meAudio.volume = this.volumes.me * this.globalVolume;
        }
        this.sePool.forEach(se => {
            se.volume = this.volumes.se * this.globalVolume;
        });
    }
}