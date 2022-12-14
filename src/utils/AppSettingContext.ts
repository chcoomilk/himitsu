import React from "react";
import { DefaultValues } from "./constants";
import { AppSetting, AppThemeSetting, EncryptionMethod } from "./types";

const AppSettingContext = React.createContext<AppSetting>(DefaultValues.settings);

export type AppAction =
  | { type: "toggleAutofocus" }
  | { type: "toggleHistory" }
  | { type: "switchEncryption", payload: EncryptionMethod }
  | { type: "switchAppTheme", payload: AppThemeSetting }
  | { type: "reset" }

export const reducer = (state: AppSetting, action: AppAction): AppSetting => {
  switch (action.type) {
    case "toggleAutofocus":
      return { ...state, autofocus: !state.autofocus };

    case "toggleHistory":
      return { ...state, history: !state.history };

    case "switchAppTheme":
      return { ...state, app_theme: action.payload };

    case "switchEncryption":
      return { ...state, encryption: action.payload };

    case "reset":
      return DefaultValues.settings;

    default:
      return state;
  }
};

export default AppSettingContext;
