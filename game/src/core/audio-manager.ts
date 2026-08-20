export type AudioChannel = 'bgm' | 'bgs' | 'me' | 'se';

export interface AudioTrackOptions {
    src?: string;
    volume?: number;
    loop?: boolean;
    channel?: AudioChannel;
}

export type TrackInput = string | {
    src: string;
    volume?: number;
    loop?: boolean;
};

export class AudioManager {
    private static bgmAudio: HTMLAudioElement | null = null;
    private static currentBgmSrc: string | null = null;

    private static bgsAudio: HTMLAudioElement | null = null;
    private static currentBgsSrc: string | null = null;

    private static meAudio: HTMLAudioElement | null = null;
    private static sePool: HTMLAudioElement[] = [];

    private static volumes: Record<AudioChannel, number> = {
        bgm: 1.0,
        bgs: 1.0,
        me: 1.0,
        se: 1.0
    };

    private static globalVolume: number = 1.0;

    constructor() {}

    public static playTrack(track: TrackInput, loop?: boolean, fadeInDuration: number = 800, channel: AudioChannel = 'bgm'): void {
        const src = typeof track === 'string' ? track : (track.src || '');
        const options: AudioTrackOptions = typeof track === 'string' ? {} : track;
        const shouldLoop = loop ?? options.loop ?? true;
        const targetChannel = options.channel ?? channel;

        if (targetChannel === 'bgs') {
            AudioManager.playBgs(src, { ...options, loop: shouldLoop }, fadeInDuration);
        } else {
            AudioManager.playBgm(src, { ...options, loop: shouldLoop }, fadeInDuration);
        }
    }

    public static stopTrack(track?: TrackInput, fadeOutDuration: number = 800, channel: AudioChannel = 'bgm'): void {
        const options: AudioTrackOptions = typeof track === 'object' && track !== null ? track : {};
        const targetChannel = options.channel ?? channel;

        if (track) {
            const src = typeof track === 'string' ? track : (track.src || '');
            if (src) {
                if (targetChannel === 'bgs' && AudioManager.currentBgsSrc !== src) return;
                if (targetChannel === 'bgm' && AudioManager.currentBgmSrc !== src) return;
            }
        }

        if (targetChannel === 'bgs') {
            AudioManager.stopBgs(fadeOutDuration);
        } else {
            AudioManager.stopBgm(fadeOutDuration);
        }
    }

    public static playBgm(src: string, options: AudioTrackOptions = {}, fadeInDuration: number = 800): void {
        if (AudioManager.bgmAudio && AudioManager.currentBgmSrc === src && !AudioManager.bgmAudio.paused) {
            return;
        }

        const targetVolume = ((options.volume ?? 1.0) * AudioManager.volumes.bgm * AudioManager.globalVolume);

        if (AudioManager.bgmAudio) {
            const oldAudio = AudioManager.bgmAudio;
            AudioManager.fadeOut(oldAudio, Math.min(500, fadeInDuration), () => {
                oldAudio.pause();
            });
        }

        const audio = new Audio(src);
        audio.loop = options.loop ?? true;
        AudioManager.bgmAudio = audio;
        AudioManager.currentBgmSrc = src;

        AudioManager.fadeIn(audio, targetVolume, fadeInDuration);
    }

    public static stopBgm(fadeOutDuration: number = 800): void {
        if (!AudioManager.bgmAudio) return;

        const audioToFade = AudioManager.bgmAudio;
        AudioManager.bgmAudio = null;
        AudioManager.currentBgmSrc = null;

        AudioManager.fadeOut(audioToFade, fadeOutDuration, () => {
            audioToFade.pause();
        });
    }

    public static playBgs(src: string, options: AudioTrackOptions = {}, fadeInDuration: number = 800): void {
        if (AudioManager.bgsAudio && AudioManager.currentBgsSrc === src && !AudioManager.bgsAudio.paused) {
            return;
        }

        const targetVolume = ((options.volume ?? 1.0) * AudioManager.volumes.bgs * AudioManager.globalVolume);

        if (AudioManager.bgsAudio) {
            const oldAudio = AudioManager.bgsAudio;
            AudioManager.fadeOut(oldAudio, Math.min(500, fadeInDuration), () => {
                oldAudio.pause();
            });
        }

        const audio = new Audio(src);
        audio.loop = options.loop ?? true;
        AudioManager.bgsAudio = audio;
        AudioManager.currentBgsSrc = src;

        AudioManager.fadeIn(audio, targetVolume, fadeInDuration);
    }

    public static stopBgs(fadeOutDuration: number = 800): void {
        if (!AudioManager.bgsAudio) return;

        const audioToFade = AudioManager.bgsAudio;
        AudioManager.bgsAudio = null;
        AudioManager.currentBgsSrc = null;

        AudioManager.fadeOut(audioToFade, fadeOutDuration, () => {
            audioToFade.pause();
        });
    }

    public static playME(src: string, options: AudioTrackOptions = {}): Promise<void> {
        return new Promise((resolve) => {
            if (AudioManager.meAudio) {
                AudioManager.meAudio.pause();
                AudioManager.meAudio = null;
            }

            AudioManager.meAudio = new Audio(src);
            AudioManager.meAudio.loop = options.loop ?? false;
            AudioManager.meAudio.volume = (options.volume ?? 1.0) * AudioManager.volumes.me * AudioManager.globalVolume;

            AudioManager.meAudio.play().catch(error => {
                console.warn(`AudioManager: Failed to play ME (${src}):`, error);
                resolve();
            });
        });
    }

    public static stopMe(): void {
        if (AudioManager.meAudio) {
            AudioManager.meAudio.pause();
            AudioManager.meAudio = null;
        }
    }

    public static playSe(src: string, options: AudioTrackOptions = {}): void {
        const se = new Audio(src);
        se.loop = options.loop ?? false;
        se.volume = (options.volume ?? 1.0) * AudioManager.volumes.se * AudioManager.globalVolume;

        se.onended = () => {
            const index = AudioManager.sePool.indexOf(se);
            if (index !== -1) {
                AudioManager.sePool.splice(index, 1);
            }
        };

        AudioManager.sePool.push(se);
        se.play().catch(error => {
            console.warn(`AudioManager: Failed to play SE (${src}):`, error);
        });
    }

    public static setChannelVolume(channel: AudioChannel, volume: number): void {
        AudioManager.volumes[channel] = Math.max(0, Math.min(1, volume));
        AudioManager.updateActiveVolumes();
    }

    public static setGlobalVolume(volume: number): void {
        AudioManager.globalVolume = Math.max(0, Math.min(1, volume));
    }

    public static getChannelVolume(channel: AudioChannel): number {
        return AudioManager.volumes[channel];
    }

    public static updateActiveVolumes(): void {
        if (AudioManager.bgmAudio) {
            AudioManager.bgmAudio.volume = AudioManager.volumes.bgm * AudioManager.globalVolume;
        }
        if (AudioManager.bgsAudio) {
            AudioManager.bgsAudio.volume = AudioManager.volumes.bgs * AudioManager.globalVolume;
        }
        if (AudioManager.meAudio) {
            AudioManager.meAudio.volume = AudioManager.volumes.me * AudioManager.globalVolume;
        }
        AudioManager.sePool.forEach(se => {
            se.volume = AudioManager.volumes.se * AudioManager.globalVolume;
        });
    }

    private static fadeIn(audio: HTMLAudioElement, targetVolume: number, duration: number): void {
        audio.volume = 0;
        audio.play().catch(error => {
            console.warn(`AudioManager: Failed to play audio track:`, error);
        });

        const steps = 20;
        const stepTime = duration / steps;
        const volumeIncrement = targetVolume / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            audio.volume = Math.min(targetVolume, currentStep * volumeIncrement);
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
            }
        }, stepTime);
    }

    private static fadeOut(audio: HTMLAudioElement, duration: number, onComplete?: () => void): void {
        const startVolume = audio.volume;
        if (startVolume === 0) {
            if (onComplete) onComplete();
            return;
        }

        const steps = 20;
        const stepTime = duration / steps;
        const volumeDecrement = startVolume / steps;
        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            audio.volume = Math.max(0, startVolume - (currentStep * volumeDecrement));
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                if (onComplete) onComplete();
            }
        }, stepTime);
    }
}