import { AppThemeSetting } from "../utils/types";

export const applyTheme = (theme: AppThemeSetting) => {
    switch (theme) {
        case AppThemeSetting.Normal:
            break;
        case AppThemeSetting.Black:
            break;
        default:
            throw new Error(theme + " theme doesn't exist");
    }
};
