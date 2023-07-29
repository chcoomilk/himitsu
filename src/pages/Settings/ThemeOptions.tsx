import { Form } from "react-bootstrap";
import { AppThemeSetting } from "../../utils/types";
import * as changeCase from "change-case";
import { useContext } from "react";
import AppSettingContext from "../../utils/AppSettingContext";
import SettingsContext from "./context";

type AppThemeKey = keyof typeof AppThemeSetting;
const createAppThemeKeys = <T extends AppThemeKey[]>(
  ...array: T & ([AppThemeKey] extends [T[number]] ? unknown : "Missing a key")
) => array;

const ThemeOptions = () => {
  const appSettings = useContext(AppSettingContext);
  const setAppSettings = useContext(SettingsContext);
  const setDefaultTheme = (theme: AppThemeSetting) => setAppSettings({
    type: "switchAppTheme", payload: theme
  });

  return (
    <>
      {
        createAppThemeKeys(
          "SystemDefault",
          "Dark",
          "Light",
        ).map(theme_name => {
          return (
            <Form.Check
              inline
              type="radio"
              name="theme"
              key={theme_name}
              id={`theme-${theme_name}`}
              checked={appSettings.app_theme === AppThemeSetting[theme_name]}
              label={changeCase.capitalCase(theme_name)}
              onChange={_ => setDefaultTheme(AppThemeSetting[theme_name])}
            />
          );
        })
      }
    </>
  );

};

export default ThemeOptions;
