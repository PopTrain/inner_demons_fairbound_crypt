export type ScriptCommand =
    | { type: 'PLAY_AUDIO'; track: string; loop: boolean }
    | { type: 'STOP_AUDIO'; track: string }
    | { type: 'FADE'; direction: 'in' | 'out'; color: string; duration: number }
    | { type: 'SHOW_GRAPHIC'; graphic: string; direction?: 'in' | 'out' }
    | { type: 'SHOW_DEMON_SPRITE'; sprite: string }
    | { type: 'SHOW_TRAINER_SPRITE'; sprite: string }
    | { type: 'TEXT'; key: string }
    | { type: 'CHOICE'; options: string[] }
    | { type: 'HELPER'; target: string }
    | { type: 'PROMPT'; key: string }
    | { type: 'LABEL'; name: string }
    | { type: 'NAME_BOX'; key: string | null };