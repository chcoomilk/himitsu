import { AppSetting, AppThemeSetting, EncryptionMethod, NoteInfo } from "../types";
import toast from "react-hot-toast";

function is_note(item: unknown): item is NoteInfo {
    return (
        (item as NoteInfo).id !== undefined &&
            (item as NoteInfo).title !== undefined &&
            (item as NoteInfo).frontend_encryption !== undefined &&
            (item as NoteInfo).backend_encryption !== undefined &&
            (item as NoteInfo).expired_at?.secs_since_epoch !== undefined &&
            (item as NoteInfo).expired_at?.nanos_since_epoch !== undefined &&
            (item as NoteInfo).created_at.nanos_since_epoch !== undefined &&
            (item as NoteInfo).created_at.secs_since_epoch !== undefined &&
            typeof +(item as NoteInfo).id === "number" &&
            typeof (item as NoteInfo).frontend_encryption === "boolean" &&
            typeof (item as NoteInfo).backend_encryption === "boolean" &&
            typeof (item as NoteInfo).created_at.nanos_since_epoch === "number" &&
            typeof (item as NoteInfo).created_at.secs_since_epoch === "number" &&
            (item as NoteInfo).expired_at === null ? true : (!!(item as NoteInfo).expired_at?.nanos_since_epoch && !!(item as NoteInfo).expired_at?.secs_since_epoch)
    );
}

const is_settings = (item: unknown): item is AppSetting => {
    return (
        (item as AppSetting).preferences !== undefined &&
        AppThemeSetting[(item as AppSetting).preferences.app_theme] !== undefined &&
        EncryptionMethod[(item as AppSetting).preferences.encryption] !== undefined
    );
};

const unsafe_is_note = (item: unknown): item is NoteInfo => {
    return (
        (item as NoteInfo).id !== undefined
    );
};

const unsafe_is_settings = (item: unknown): item is AppSetting => {
    return (
        (item as AppSetting).preferences !== undefined
    );
};

type KeyofNotesHistory = "notes_history";
type KeyofAppSettings = "settings";
type KeyofLastSavedNote = "last_saved_note";
type LocalStorageItemKeys = KeyofAppSettings | KeyofNotesHistory | KeyofLastSavedNote;
function get(key: KeyofNotesHistory): NoteInfo[] | null;
function get(key: KeyofAppSettings): AppSetting | null;
function get(key: KeyofLastSavedNote): NoteInfo | null;
function get(key: LocalStorageItemKeys): AppSetting | NoteInfo[] | NoteInfo | null {
    const saved_item = localStorage.getItem(key);
    if (!saved_item) {
        return null;
    }

    try {
        let item = JSON.parse(saved_item);
        let e = new Error();

        switch (key) {
            case "settings":
                if (is_settings(item)) {
                    return item;
                }

                throw e;
            case "notes_history":
                if (Array.isArray(item)) {
                    let valid_arr_of_notes = item.map(data => {
                        if (is_note(data)) {
                            return data;
                        }

                        throw e;
                    });

                    return valid_arr_of_notes;
                }

                throw e;
            case "last_saved_note":
                if (is_note(item)) {
                    return item;
                }

                throw e;
        }
    } catch (error) {
        localStorage.removeItem(key);
        toast(`Invalid item in ${key}`);
    }

    return null;
};

function set(item: AppSetting | NoteInfo[] | NoteInfo) {
    const save = (key: LocalStorageItemKeys, item: AppSetting | NoteInfo[] | NoteInfo) => {
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.log(error);
            toast(`Failed to save item of ${key}`);
        }
    };
    let key: LocalStorageItemKeys;

    if (unsafe_is_note(item)) {
        key = "last_saved_note";
        save(key, item);
    } else if (unsafe_is_settings(item)) {
        key = "settings";
        save(key, item);
    } else {
        key = "notes_history";
        save(key, item);
    }
}

function remove(key: LocalStorageItemKeys) {
    localStorage.remove(key);
}

const local_storage = {
    get,
    set,
    remove,
}

export default local_storage;

// class SafeLocalStorage {
//     private readonly kind: Save;
//     constructor(kind: Save) {
//         this.kind = kind;
//     }

//     get(): NoteInfo;
//     get(): AppSetting;
//     get() {
//         switch (this.kind) {
//             case Save.Note:
//                 let item: NoteInfo = {
//                     id: 0,
//                     backend_encryption: false,
//                     created_at: { nanos_since_epoch: 0, secs_since_epoch: 0 },
//                     expired_at: { nanos_since_epoch: 0, secs_since_epoch: 0 },
//                     frontend_encryption: false,
//                     title: ""
//                 };
//                 return item;

//             case Save.Settings:
//                 return DefaultValue.settings;
//         }
//     }
// }

// let k = new SafeLocalStorage(Save.Note).get();

// enum LocalStorageItems {
//     Note,
//     NotesHistory,
//     Settings,
//     Theme,
// }
// type LocalStorageItems = {
//     notes_history: NoteInfo[],
//     settings: AppSetting,
//     last_saved_note: NoteInfo,
// };
// type KeyOfType<LocalStorageItems, V> = keyof {
//     [P in keyof LocalStorageItems as LocalStorageItems[P] extends V? P: never]: any
// }
