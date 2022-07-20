import { AppSetting, AppThemeSetting, EncryptionMethod, NoteInfo } from "../types";

export function is_note(item: unknown): item is NoteInfo {
    let exist: boolean;

    try {
        exist = (
            typeof (item as NoteInfo) === "object" &&
            (item as NoteInfo).id !== undefined &&
            (item as NoteInfo).title !== undefined &&
            (item as NoteInfo).frontend_encryption !== undefined &&
            (item as NoteInfo).backend_encryption !== undefined &&
            (item as NoteInfo).created_at?.nanos_since_epoch !== undefined &&
            (item as NoteInfo).created_at?.secs_since_epoch !== undefined &&
            (item as NoteInfo).updated_at?.nanos_since_epoch !== undefined &&
            (item as NoteInfo).updated_at?.secs_since_epoch !== undefined &&
            (item as NoteInfo).expires_at?.nanos_since_epoch !== undefined &&
            (item as NoteInfo).expires_at?.secs_since_epoch !== undefined
        );
    } catch (error) {
        exist = false;
    }


    return (
        exist &&
        typeof (item as NoteInfo).id === "string" &&
        typeof (item as NoteInfo).frontend_encryption === "boolean" &&
        typeof (item as NoteInfo).backend_encryption === "boolean" &&
        typeof (item as NoteInfo).created_at.nanos_since_epoch === "number" &&
        typeof (item as NoteInfo).created_at.secs_since_epoch === "number" &&
        (
            (item as NoteInfo).expires_at === null
                ? true
                : (!isNaN(Number((item as NoteInfo).expires_at?.nanos_since_epoch)) && !isNaN(Number((item as NoteInfo).expires_at?.secs_since_epoch)))
        )
    );
}

export const is_settings = (item: unknown): item is AppSetting => {
    return (
        AppThemeSetting[(item as AppSetting).app_theme] !== undefined &&
        EncryptionMethod[(item as AppSetting).encryption] !== undefined &&
        typeof (item as AppSetting).history === "boolean"
    );
};

// export const unsafe_is_note = (item: unknown): item is NoteInfo => {
//     return (
//         (item as NoteInfo).id !== undefined
//     );
// };

// export const unsafe_is_settings = (item: unknown): item is AppSetting => {
//     return (
//         (item as AppSetting).encryption !== undefined
//     );
// };
