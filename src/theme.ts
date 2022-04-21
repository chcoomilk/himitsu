import { AppTheme } from "./utils/types";

export const parseTheme = (str: String | null): AppTheme => {
    switch (str) {
        case AppTheme.Normal:
            return AppTheme.Normal;
        case AppTheme.Black:
            return AppTheme.Black;
        case AppTheme.Light:
            return AppTheme.Light;
        default:
            return AppTheme.System;
    }
};

export const applyTheme = (theme: AppTheme) => {
    switch (theme) {
        case AppTheme.Normal:
            document.documentElement.style.setProperty("--bs-body-bg", "rgb(40, 44, 52)");
            break;
        case AppTheme.Black:
            document.documentElement.style.setProperty("--bs-body-bg", "black");
            break;
        case AppTheme.Light:
            document.documentElement.style.setProperty("--bs-body-bg", "white");
            break;
    }
}