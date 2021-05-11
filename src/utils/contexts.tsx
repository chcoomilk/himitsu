import React from "react";

interface CheckIfHomeContext {
  setIsHome: (truthy: boolean) => void,
  isHome: boolean
}

export const IsHome = React.createContext<CheckIfHomeContext>({
  setIsHome: () => { },
  isHome: false
});
