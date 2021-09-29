import React from "react";

interface Store {
  setShowHomeLogo: (set: boolean) => void,
}

export const StoreContext = React.createContext<Store>({
  setShowHomeLogo: () => { }
});
