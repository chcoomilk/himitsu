import { ErrorKind } from "./types";

let __ENV_REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL

if (typeof __ENV_REACT_APP_BACKEND_URL === "undefined") console.error("No server URL set in .env");

export const BASE_URL: string = __ENV_REACT_APP_BACKEND_URL || "";


const Error: ErrorKind = {
    notFound: false,
    serverError: false,
    wrongPassword: false,
    invalidId: false,
    passwordNotRequired: false,
}

export const DefaultValue = {
    Error,
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
