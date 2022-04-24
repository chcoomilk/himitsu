import { Col, Row, Form } from "react-bootstrap";
import { AppSetting, AppThemeSetting, EncryptionMethod } from "../utils/types";
import * as changeCase from "change-case";
import { useContext } from "react";
import { AppContext } from "../utils/contexts";

type Props = {
  setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>,
}

const Settings = ({ setAppSettings }: Props) => {
  const { appSettings } = useContext(AppContext);

  const setDefaultEncryption = (method: EncryptionMethod) => {
    setAppSettings(prev => {
      let settings = {
        ...prev,
        preferences: {
          ...prev.preferences,
          encryption: method,
        }
      };

      localStorage.setItem("settings", JSON.stringify(settings));
      return settings;
    });
  };

  return (
    <Row>
      <Col xs={{ span: 6, offset: 3 }}>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="radioTheme">
            <Form.Label column sm="6">
              Default Encryption
            </Form.Label>
            <Col sm="6">
              <Form.Check
                inline
                type="radio"
                name="encryption"
                checked={appSettings.preferences.encryption === EncryptionMethod.BackendEncryption}
                label="Backend"
                onChange={() => setDefaultEncryption(EncryptionMethod.BackendEncryption)}
              />
              <Form.Check
                inline
                type="radio"
                name="encryption"
                checked={appSettings.preferences.encryption === EncryptionMethod.FrontendEncryption}
                label="Frontend"
                onChange={() => setDefaultEncryption(EncryptionMethod.FrontendEncryption)}
              />
              <Form.Check
                inline
                type="radio"
                name="encryption"
                checked={appSettings.preferences.encryption === EncryptionMethod.NoEncryption}
                label="No encryption"
                onChange={() => setDefaultEncryption(EncryptionMethod.NoEncryption)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="radioTheme">
            <Form.Label column sm="6">
              Theme
            </Form.Label>
            <Col sm="6">
              {
                Object.values(AppThemeSetting).map(value => {
                  return (
                    <Form.Check
                      inline
                      className="pt-2"
                      type="radio"
                      name="theme"
                      key={value}
                      checked={appSettings.preferences.app_theme === value}
                      id={value}
                      label={changeCase.capitalCase(value)}
                      onChange={_ => setAppSettings(prev => {
                        let settings = {
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            app_theme: value,
                          }
                        };

                        localStorage.setItem("settings", JSON.stringify(settings));
                        return settings;
                      })}
                    />
                  );
                })
              }
            </Col>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default Settings;
