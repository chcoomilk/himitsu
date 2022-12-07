import toast from "react-hot-toast";
import { DefaultValues } from "../constants";
import { AppSetting, NoteInfo } from "../types";
import { is_note, is_settings } from "./is";

// pikachu dies from confusion
// please see this for updates on conditional return in typescript
// https://github.com/Microsoft/TypeScript/issues/24929
// enum for easier changes on update
// enum KeysEnum { 
//     Notes = "notes", 
//     Settings = "settings",
//     NoteModalForLastNote = "last_saved_note",
//  }
// type LocalStorageItemKeysEnums = LSItemKeys.Notes | LSItemKeys.Settings | LSItemKeys.NoteModalForLastNote;
// types for easier use overall, but more work to update on changes
type NotesKey = "notes";
type AppSettingsKey = "settings";
type LastSavedNoteKey = "last_saved_note";
type TokenKey = "token";
type LocalStorageItemKeys = NotesKey | AppSettingsKey | LastSavedNoteKey | TokenKey;
type LocalStorageItemKind = AppSetting | NoteInfo[] | NoteInfo | string;
function get(key: NotesKey): NoteInfo[] | null;
function get(key: AppSettingsKey): AppSetting | null;
function get(key: LastSavedNoteKey): NoteInfo | null;
function get(key: TokenKey): string | null;
function get(key: LocalStorageItemKeys): LocalStorageItemKind | null {
    const saved_item = localStorage.getItem(key);
    if (!saved_item) {
        return null;
    }

    try {
        let item = JSON.parse(saved_item);
        let invalid_error = new Error(`${key} has invalid property, did you do this <(｀^´)>`);

        switch (key) {
            case "settings":
                if (is_settings(item)) {
                    return item;
                } else if (Object.isExtensible(item)) {
                    item = {
                        ...DefaultValues.settings,
                        ...item,
                    }

                    if (is_settings(item)) {
                        return item;
                    }
                }

                throw invalid_error;
            case "notes":
                if (Array.isArray(item)) {
                    let valid_arr_of_notes = item.map(data => {
                        if (is_note(data)) {
                            return data;
                        }

                        throw invalid_error;
                    });

                    return valid_arr_of_notes;
                }

                throw invalid_error;
            case "last_saved_note":
                if (is_note(item)) {
                    return item;
                }

                throw invalid_error;

            case "token":
                if (typeof item === "string") {
                    return item;
                }

                throw invalid_error;
        }
    } catch (error) {
        console.error(error);
        toast.error(`Invalid item in ${key}`);
        let prefix = "_trashed-error";
        console.warn("item might get reset, saving last known (invalid) item in local storage prefixed " + prefix);
        console.log("trying to save\n", saved_item);
        console.log("...");
        try {
            localStorage.setItem(prefix + Date.now().toString(), saved_item);
            console.log("...saved!");
        } catch (error) {
            console.log("...failed!");
            console.error(error);
        }
    }

    return null;
};

function set(key: NotesKey, item: NoteInfo[]): void;
function set(key: AppSettingsKey, item: AppSetting): void;
function set(key: LastSavedNoteKey, item: NoteInfo): void;
function set(key: TokenKey, item: string): void;
function set(key: LocalStorageItemKeys, item: LocalStorageItemKind) {
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.error(error);
        toast(`Failed to save item of ${key}`);
    }
}

function remove(key: LocalStorageItemKeys) {
    localStorage.removeItem(key);
}

/**
 * a typed localStorage
 * 
 * add, edit the code freely in utils/functions
 */
const local_storage = {
    get,
    set,
    remove,
}

export default local_storage;
