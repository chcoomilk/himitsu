import React from "react";
import { DefaultValue } from "./constants";
import { AppSetting } from "./types";

interface MainAppState {
  appSettings: AppSetting,
}

const AppContext = React.createContext<MainAppState>({
  appSettings: DefaultValue.settings,
});

export default AppContext;
