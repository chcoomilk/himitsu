import { EncryptionMethod, Note, AppSetting, AppThemeSetting } from "./types";

if (typeof import.meta.env.VITE_BACKEND_URL === "undefined") console.error("No server URL was set in .env: ", import.meta.env.VITE_BACKEND_URL);

export const BASE_URL: string = import.meta.env.VITE_BACKEND_URL || "";

type EnforceNote = Note & {
    title: string,
    passphrase: string,
};

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
    autofocus: true,
};

export const DefaultValues = {
    note,
    settings,
};

export const PATHS = {
    new_note: "/",
    about: "/about",
    find_note: "/find",
    notes: "/notes",
    note_detail: "/n",
    settings: "/settings",
    not_found: "/404",
};
