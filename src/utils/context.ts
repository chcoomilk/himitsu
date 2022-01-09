import React from "react";
import { DefaultValue } from "./constants";
import { ErrorKind } from "./types";

interface Store {
  setPassword(password: string): void,
  alerts: ErrorKind,
  setAlerts: React.Dispatch<React.SetStateAction<ErrorKind>>,
  password: string | null,
}

export const StoreContext = React.createContext<Store>({
  setPassword: () => { },
  setAlerts: () => { },
  alerts: {
    ...DefaultValue.Error
  },
  password: null,
});
