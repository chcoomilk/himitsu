import React from "react";
import { DefaultValue } from "./constants";
import { ErrorKind } from "./types";

interface Store {
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  alerts: ErrorKind,
  setAlerts: React.Dispatch<React.SetStateAction<ErrorKind>>,
  password: string,
}

export const StoreContext = React.createContext<Store>({
  setPassword: () => { },
  setAlerts: () => { },
  alerts: {
    ...DefaultValue.Error
  },
  password: "",
});
