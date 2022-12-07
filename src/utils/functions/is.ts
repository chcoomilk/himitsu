import { AppSetting, AppThemeSetting, EncryptionMethod, NoteInfo, note_id } from "../types";

export function is_note(item: unknown): item is NoteInfo {
    let normalomatron: boolean;

    try {
        normalomatron = (
            typeof (item as NoteInfo) === "object" &&
                (item as NoteInfo).id !== undefined &&
                (item as NoteInfo).title !== undefined &&
                (item as NoteInfo).frontend_encryption !== undefined &&
                (item as NoteInfo).backend_encryption !== undefined &&
                (item as NoteInfo).created_at?.nanos_since_epoch !== undefined &&
                (item as NoteInfo).created_at?.secs_since_epoch !== undefined &&
                (item as NoteInfo).expires_at === null
                ? true
                : (
                    (item as NoteInfo).expires_at?.nanos_since_epoch !== undefined &&
                    (item as NoteInfo).expires_at?.secs_since_epoch !== undefined &&
                    typeof (item as NoteInfo).expires_at?.nanos_since_epoch === "number" &&
                    typeof (item as NoteInfo).expires_at?.secs_since_epoch === "number"
                )
        );
    } catch (error) {
        normalomatron = false;
    }


    return (
        normalomatron &&
        is_note_id(typeof (item as NoteInfo).id) &&
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

// maybe it's better for this function to only do typechecks
export const is_settings = (item: unknown): item is AppSetting => {
    return (
        AppThemeSetting[(item as AppSetting).app_theme] !== undefined &&
        EncryptionMethod[(item as AppSetting).encryption] !== undefined &&
        typeof (item as AppSetting).history === "boolean" &&
        typeof (item as AppSetting).autofocus === "boolean"
    );
};

export const is_note_id = (id: unknown): id is note_id => (typeof id === "string" && id.length <= 32);

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
