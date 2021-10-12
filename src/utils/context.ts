import React from "react";
import { ErrorKind } from "./types";

interface Store {
  setShowHomeLogo: React.Dispatch<React.SetStateAction<boolean>>,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  alerts: ErrorKind,
  setAlerts: React.Dispatch<React.SetStateAction<ErrorKind>>,
  password: string,
}

export const StoreContext = React.createContext<Store>({
  setShowHomeLogo: () => { },
  setPassword: () => { },
  setAlerts: () => { },
  alerts: {
    notFound: false,
    serverError: false,
    wrongPassword: false,
  },
  password: "",
});
