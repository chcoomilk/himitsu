import React from "react";
import { DefaultValues } from "./constants";
import { AppSetting } from "./types";

interface MainAppState {
  appSettings: AppSetting,
};

const AppContext = React.createContext<MainAppState>({
  appSettings: DefaultValues.settings,
});

export default AppContext;
