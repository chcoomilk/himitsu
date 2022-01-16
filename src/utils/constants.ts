import { EncryptionMethod, NoteType, Popup } from "./types";

if (typeof process.env.REACT_APP_BACKEND_URL === "undefined") console.error("No server URL set in .env");

export const BASE_URL: string = process.env.REACT_APP_BACKEND_URL || "";


const Popups: Popup = {
    notFound: false,
    serverError: false,
    wrongPassphrase: false,
    invalidId: false,
    passphraseNotRequired: false,
    noteDeletion: null,
};

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

export const DefaultValue = {
    Popups,
    Note,
};

export const PATHS = {
    home: "/",
    about: "/about",
    new_note: "/new",
    find_note: "/find",
    note_detail: "/n",
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
