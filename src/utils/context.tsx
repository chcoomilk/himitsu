import React from "react";

interface Store {
  theme: React.CSSProperties,
  setShowHomeLogo: (set: boolean) => void,
}

export const StoreContext = React.createContext<Store>({
  theme: {},
  setShowHomeLogo: () => { }
});
