import React from "react";
import { AppTheme } from "../types";

interface Theme {
    theme: AppTheme,
}

export default React.createContext<Theme>({
    theme: AppTheme.Normal,
});