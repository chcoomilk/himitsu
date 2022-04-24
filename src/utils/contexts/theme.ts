import React from "react";
import { AppThemeSetting } from "../types";

interface Theme {
    currentTheme: AppThemeSetting.Normal | AppThemeSetting.Black,
    theme: AppThemeSetting,
}

export default React.createContext<Theme>({
    currentTheme: AppThemeSetting.Normal,
    theme: AppThemeSetting.Normal,
});