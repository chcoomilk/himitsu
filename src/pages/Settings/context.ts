import { createContext } from "react";
import { AppAction } from "../../utils/AppSettingContext";

const SettingsContext = createContext<React.Dispatch<AppAction>>(() => { });
export default SettingsContext;
