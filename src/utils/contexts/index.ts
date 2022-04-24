import React from "react";
import { DefaultValue } from "../constants";
import { AppSetting, ErrorKind, UserActionInfo } from "../types";
import theme from "./theme";

interface MainAppState {
  setAlerts: React.Dispatch<React.SetStateAction<ErrorKind | UserActionInfo>>,
  appSettings: AppSetting,
}

export const AppContext = React.createContext<MainAppState>({
  setAlerts: () => { },
  appSettings: DefaultValue.settings,
});

export const ThemeContext = theme;
