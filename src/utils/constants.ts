import { EncryptionMethod, Note, ErrorKind, AppSetting, AppThemeSetting } from "./types";

if (typeof process.env.REACT_APP_BACKEND_URL === "undefined") console.error("No server URL was set in .env");

export const BASE_URL: string = process.env.REACT_APP_BACKEND_URL || "";

const errors: ErrorKind = {
    notFound: null,
    serverError: null,
    wrongPassphrase: null,
    tooManyRequests: null,
    clientError: null,
};

const note: Note = {
    id: "",
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
    app_theme: AppThemeSetting.Normal,
    encryption: EncryptionMethod.BackendEncryption,
    history: false,
};

export const DefaultValue = {
    errors,
    note,
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
