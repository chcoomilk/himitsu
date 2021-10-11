export const BaseUrl = process.env.REACT_APP_BACKEND_URL;

export const HomePath = "/";
export const AboutPath = "/about";
export const NewNotePath = "/new";
export const FindNotePath = "/find";
export const NotePath = "/n/:id";
export const timeConfig: Intl.DateTimeFormatOptions | undefined = {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h24"
};