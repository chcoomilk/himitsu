import { EncryptionMethod, NoteInfo, NoteType, Alert, ErrorKind } from "./types";

if (typeof process.env.REACT_APP_BACKEND_URL === "undefined") console.error("No server URL was set in .env");
if (typeof process.env.REACT_APP_URL === "undefined") console.error("No React app URL was set in .env");

export const BASE_URL: string = process.env.REACT_APP_BACKEND_URL || "";

const Alerts: Alert = {
    notFound: false,
    serverError: false,
    wrongPassphrase: false,
    invalidId: false,
    passphraseNotRequired: false,
    tooManyRequests: false,
    noteDeletion: null,
};

const NoError: ErrorKind = {
    notFound: false,
    serverError: false,
    wrongPassphrase: false,
    invalidId: false,
    passphraseNotRequired: false,
    tooManyRequests: false,
}

const Note: NoteType = {
    id: 0,
    title: "",
    content: "",
    already_decrypted: false,
    encryption: EncryptionMethod.NoEncryption,
    creationTime: "",
    expiryTime: "",
    lastUpdateTime: "",
    passphrase: "",
}

const DefNoteInfo: NoteInfo = {
    id: 0,
    title: "",
    backend_encryption: false,
    expired_at: {
        nanos_since_epoch: 0,
        secs_since_epoch: 0,
    },
    frontend_encryption: false,
}

export const DefaultValue = {
    Alerts,
    NoError,
    Note,
    NoteInfo: DefNoteInfo,
    Pages: {
        NewNote: {
            NAME: "NewNote",
            RESULT_STATE_NAME: "NewNoteNoteResult",
        }
    }
};

export const PATHS = {
    home: "/",
    about: "/about",
    new_note: "/new",
    find_note: "/find",
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
