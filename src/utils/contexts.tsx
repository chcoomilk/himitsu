import React from "react";

interface Login {
  checkLogin: () => void,
  token: string,
  setToken: (token: string) => void,
}

interface Store {
  setIsHome: (truthy: boolean) => void,
  isHome: boolean,
  Login: Login
}

export const Store = React.createContext<Store>({
  setIsHome: () => { },
  isHome: false,
  Login : {
    checkLogin: () => { },
    token: "",
    setToken: () => { },
  }
});
