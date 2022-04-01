import React from "react";
import { DefaultValue } from "../constants";
import { Popup } from "../types";
import theme from "./theme";

interface Store {
  setPassphrase(passphrase: string | null): void,
  passphrase: string | null,
  setPopups: React.Dispatch<React.SetStateAction<Popup>>,
  popups: Popup,
}

export const StoreContext = React.createContext<Store>({
  setPassphrase: () => { },
  setPopups: () => { },
  popups: {
    ...DefaultValue.Popups
  },
  passphrase: null,
});

export const ThemeContext = theme;
