import React from "react";
import { DefaultValue } from "../constants";
import { Alert, AppSetting } from "../types";
import theme from "./theme";

interface MainAppState {
  setAlerts: React.Dispatch<React.SetStateAction<Alert>>,
  appSettings: AppSetting,
}

export const AppContext = React.createContext<MainAppState>({
  setAlerts: () => { },
  appSettings: DefaultValue.settings,
});

export const ThemeContext = theme;
