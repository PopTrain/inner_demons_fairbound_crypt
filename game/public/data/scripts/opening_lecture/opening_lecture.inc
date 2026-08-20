OpeningLectureSceneStart:
    PLAY_AUDIO willow_theme loop
    FADE_IN black 3.0
    SHOW_GRAPHIC willow_intro in
    NAME_BOX WILLOW
    TEXT INTRO.step_1

OpeningLectureScene:
    TEXT INTRO.step_2
    TEXT INTRO.step_3
    TEXT INTRO.step_4
    TEXT INTRO.step_5
    TEXT INTRO.step_6
    TEXT INTRO.step_7
    CHOICE option_help option_controls option_no

:option_help
    TEXT INTRO.help_1,
    TEXT INTRO.help_2,
    TEXT INTRO.help_3

:option_controls
    HELPER controls

:option_no
    TEXT INTRO.step_8
    TEXT INTRO.step_9
    TEXT INTRO.step_10
    TEXT INTRO.step_11
    TEXT INTRO.step_12
    TEXT INTRO.step_13
    TEXT INTRO.step_14
    TEXT INTRO.step_15
    TEXT INTRO.step_16
    PROMPT INTRO.name_confirmation
    TEXT INTRO.step_17
    TEXT INTRO.step_18
    TEXT INTRO.step_19
    TEXT INTRO.step_20
    TEXT INTRO.step_21
    TEXT INTRO.step_22
    NAME_BOX null

OpeningLectureSceneStop:
    STOP_AUDIO willow_theme
    FADE_OUT black 3.0
