import { EncryptionMethod, Note, Alert, ErrorKind, AppSetting, AppTheme } from "./types";

if (typeof process.env.REACT_APP_BACKEND_URL === "undefined") console.error("No server URL was set in .env");
if (typeof process.env.REACT_APP_URL === "undefined") console.error("No React app URL was set in .env");

export const BASE_URL: string = process.env.REACT_APP_BACKEND_URL || "";

const alerts: Alert = {
    notFound: false,
    serverError: false,
    wrongPassphrase: false,
    invalidId: false,
    passphraseNotRequired: false,
    tooManyRequests: false,
    noteDeletion: null,
};

const errors: ErrorKind = {
    notFound: false,
    serverError: false,
    wrongPassphrase: false,
    invalidId: false,
    passphraseNotRequired: false,
    tooManyRequests: false,
};

const note: Note = {
    id: 0,
    title: "",
    content: "",
    decrypted: false,
    encryption: EncryptionMethod.NoEncryption,
    creationTime: "",
    expiryTime: "",
    lastUpdateTime: "",
    passphrase: "",
};

const settings: AppSetting = {
    preferences: {
        app_theme: AppTheme.System,
        encryption: EncryptionMethod.BackendEncryption,
    }
};

export const DefaultValue = {
    alerts,
    errors,
    note,
    pages: {
        NewNote: {
            name: "NewNote",
            local_storage_name: "NewNoteNoteResult",
        }
    },
    settings,
};

export const PATHS = {
    home: "/",
    about: "/about",
    new_note: "/new",
    find_note: "/find",
    notes: "/notes",
    note_detail: "/n",
    settings: "/settings",
    not_found: "/404",
}

export const TIME_CONFIG: Intl.DateTimeFormatOptions | undefined = {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h24"
};
