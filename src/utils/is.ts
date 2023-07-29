import { AppSetting, AppThemeSetting, EncryptionMethod, NoteInfo, note_id } from "./types";

export function is_note_info(item: unknown): item is NoteInfo {
    try {
        let casted = item as NoteInfo;
        return is_note_id(typeof casted.id) &&
            typeof casted.frontend_encryption === "boolean" &&
            typeof casted.backend_encryption === "boolean" &&
            typeof casted.created_at.nanos_since_epoch === "number" &&
            typeof casted.created_at.secs_since_epoch === "number" &&
            (
                casted.expires_at === null
                    ? true
                    : typeof casted.expires_at.nanos_since_epoch === "number" && typeof casted.expires_at.secs_since_epoch === "number"
            ) &&
            casted.title === null ? true : typeof casted.title === "string";
    } catch {
        return false;
    }
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

export class Is {
    static existValueInEnum(type: any, value: any): boolean {
        return Object.keys(type).filter(k => isNaN(Number(k))).filter(k => type[k] === value).length > 0;
    }
}
