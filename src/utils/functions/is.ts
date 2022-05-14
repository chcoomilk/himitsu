import { AppSetting, AppThemeSetting, EncryptionMethod, NoteInfo } from "../types";

export function is_note(item: unknown): item is NoteInfo {
    let existence_validation = (
        (item as NoteInfo).id !== undefined &&
        (item as NoteInfo).title !== undefined &&
        (item as NoteInfo).frontend_encryption !== undefined &&
        (item as NoteInfo).backend_encryption !== undefined &&
        (item as NoteInfo).created_at.nanos_since_epoch !== undefined &&
        (item as NoteInfo).created_at.secs_since_epoch !== undefined &&
        (
            ((item as NoteInfo).created_at
                ? (
                    (item as NoteInfo).created_at.nanos_since_epoch !== undefined &&
                    (item as NoteInfo).created_at.secs_since_epoch !== undefined
                )
                : true
            )
        )
    );

    return (
        existence_validation &&
        typeof (item as NoteInfo).id === "number" &&
        typeof (item as NoteInfo).frontend_encryption === "boolean" &&
        typeof (item as NoteInfo).backend_encryption === "boolean" &&
        typeof (item as NoteInfo).created_at.nanos_since_epoch === "number" &&
        typeof (item as NoteInfo).created_at.secs_since_epoch === "number" &&
        (
            (item as NoteInfo).expired_at === null
                ? true
                : (!isNaN(Number((item as NoteInfo).expired_at?.nanos_since_epoch)) && !isNaN(Number((item as NoteInfo).expired_at?.secs_since_epoch)))
        )
    );
}

export const is_settings = (item: unknown): item is AppSetting => {
    return (
        (item as AppSetting).preferences !== undefined &&
        AppThemeSetting[(item as AppSetting).preferences.app_theme] !== undefined &&
        EncryptionMethod[(item as AppSetting).preferences.encryption] !== undefined
    );
};

export const unsafe_is_note = (item: unknown): item is NoteInfo => {
    return (
        (item as NoteInfo).id !== undefined
    );
};

export const unsafe_is_settings = (item: unknown): item is AppSetting => {
    return (
        (item as AppSetting).preferences !== undefined
    );
};
