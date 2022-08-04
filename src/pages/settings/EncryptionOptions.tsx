import { Form } from "react-bootstrap";
import { EncryptionMethod } from "../../utils/types";
import * as changeCase from "change-case";
import { useContext } from "react";
import AppContext from "../../utils/app_state_context";
import { local_storage } from "../../utils/functions";
import SettingsContext from "./context";

type EncryptionMethodKey = keyof typeof EncryptionMethod;

const createEncryptionMethodKeys = <T extends EncryptionMethodKey[]>(
  ...array: T & ([EncryptionMethodKey] extends [T[number]] ? unknown : "Missing a key")
) => array;

const EncryptionOptions = () => {
  const { appSettings } = useContext(AppContext);
  const setAppSettings = useContext(SettingsContext);
  const setDefaultEncryption = (method: EncryptionMethod) => {
    setAppSettings(prev => {
      let settings = {
        ...prev,
        encryption: method,
      };

      // localStorage.setItem("settings", JSON.stringify(settings));
      local_storage.set("settings", settings);
      return settings;
    });
  };

  return (
    <>
      {
        createEncryptionMethodKeys(
          "BackendEncryption",
          "FrontendEncryption",
          "NoEncryption"
        ).map(method => {
          return (
            <Form.Check
              type="radio"
              name="encryption"
              key={method}
              id={method}
              checked={appSettings.encryption === EncryptionMethod[method]}
              label={changeCase.capitalCase(method)}
              onChange={_ => setDefaultEncryption(EncryptionMethod[method])}
            />
          );
        })
      }
    </>
  );

};

export default EncryptionOptions;
