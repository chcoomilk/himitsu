import React from "react";
import { DefaultValue } from "./constants";
import { Popup } from "./types";

interface Store {
  setPassphrase(passphrase: string | null): void,
  popups: Popup,
  setPopups: React.Dispatch<React.SetStateAction<Popup>>,
  passphrase: string | null,
}

export const StoreContext = React.createContext<Store>({
  setPassphrase: () => { },
  setPopups: () => { },
  popups: {
    ...DefaultValue.Popups
  },
  passphrase: null,
});
