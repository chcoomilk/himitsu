import { createContext } from "react";
import { AppSetting } from "../../utils/types";

const SettingsContext = createContext<React.Dispatch<React.SetStateAction<AppSetting>>>(() => { });
export default SettingsContext
