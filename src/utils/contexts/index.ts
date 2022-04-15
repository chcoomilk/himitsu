import React from "react";
import { DefaultValue } from "../constants";
import { Alert, ErrorKind, UserActionInfo } from "../types";
import theme from "./theme";

interface Store {
  setPassphrase(passphrase: string | null): void,
  passphrase: string | null,
  setAlerts: React.Dispatch<React.SetStateAction<ErrorKind | UserActionInfo>>,
  alerts: Alert | UserActionInfo,
}

export const StoreContext = React.createContext<Store>({
  setPassphrase: () => { },
  setAlerts: () => { },
  alerts: {
    ...DefaultValue.Alerts
  },
  passphrase: null,
});

export const ThemeContext = theme;
