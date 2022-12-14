import { Form } from "react-bootstrap";
import { createEncryptionMethodKeys, EncryptionMethod } from "../../utils/types";
import { capitalCase } from "change-case";
import { useContext } from "react";
import AppSettingContext from "../../utils/AppSettingContext";
import SettingsContext from "./context";

const DefaultEncryptionOptions = () => {
  const appSettings = useContext(AppSettingContext);
  const setAppSettings = useContext(SettingsContext);
  const setDefaultEncryption = (method: EncryptionMethod) => setAppSettings({
    type: "switchEncryption", payload: method
  });

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
              label={capitalCase(method)}
              onChange={_ => setDefaultEncryption(EncryptionMethod[method])}
            />
          );
        })
      }
    </>
  );
};

export default DefaultEncryptionOptions;
