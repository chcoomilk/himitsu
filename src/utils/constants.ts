import { EncryptionMethod, Note, ErrorKind, AppSetting, AppThemeSetting } from "./types";

if (typeof import.meta.env.VITE_BACKEND_URL === "undefined") console.error("No server URL was set in .env: ", import.meta.env.VITE_BACKEND_URL);

export const BASE_URL: string = import.meta.env.VITE_BACKEND_URL || "";

const errors: ErrorKind = {
    notFound: null,
    serverError: null,
    wrongPassphrase: null,
    tooManyRequests: null,
    clientError: null,
};

type EnforceNote = Note & {
    title: string,
    passphrase: string,
}

const note: EnforceNote = {
    id: "",
    title: "",
    content: "",
    decrypted: false,
    encryption: EncryptionMethod.NoEncryption,
    creationTime: "",
    expiryTime: "",
    passphrase: "",
};

const settings: AppSetting = {
    app_theme: AppThemeSetting.Normal,
    encryption: EncryptionMethod.BackendEncryption,
    history: false,
};

export const DefaultValues = {
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
