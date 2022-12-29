import { EncryptionMethod, Note, AppSetting, AppThemeSetting } from "./types";

if (typeof import.meta.env.VITE_BACKEND_URL === "undefined") console.error("No server URL was set in .env: ", import.meta.env.VITE_BACKEND_URL);
if (typeof import.meta.env.VITE_HIGHLIGHTER_URL === "undefined") console.error("No highlighter URL was set in .env: ", import.meta.env.VITE_HIGHLIGHTER_URL);

export const BASE_URL: string = import.meta.env.VITE_BACKEND_URL || "";
export const HIGHLIGHT_URL: string = import.meta.env.VITE_HIGHLIGHTER_URL || "";

type EnforceNote = Note & {
    title: string,
    passphrase: string,
};

// this is completely fukked and needs to be snuffed
const note: EnforceNote = {
    id: "",
    title: "",
    content: "",
    frontend_decrypted: false,
    backend_decrypted: false,
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
