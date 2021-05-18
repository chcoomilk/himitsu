import React from "react";

interface Login {
  logout: () => void,
  username: string,
  setToken: (token: string) => void,
}

interface Store {
  setIsHome: (truthy: boolean) => void,
  isHome: boolean,
  login: Login
}

export const StoreContext = React.createContext<Store>({
  setIsHome: () => { },
  isHome: false,
  login : {
    logout: () => { },
    username: "",
    setToken: () => { },
  }
});
