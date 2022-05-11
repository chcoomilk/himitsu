import { Col, Row, Form } from "react-bootstrap";
import { AppSetting, AppThemeSetting, EncryptionMethod } from "../utils/types";
import React, { useContext } from "react";
import { AppContext } from "../utils/contexts";
import { local_storage } from "../utils/functions";
import { Link } from "react-router-dom";
import { PATHS } from "../utils/constants";
import * as changeCase from "change-case";

type Props = {
  setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>,
}

type EncryptionMethodKey = keyof typeof EncryptionMethod;
type AppThemeKey = keyof typeof AppThemeSetting;

const Settings = ({ setAppSettings }: Props) => {
  const { appSettings } = useContext(AppContext);

  const setDefaultEncryption = (method: EncryptionMethod) => {
    setAppSettings(prev => {
      let settings = {
        ...prev,
        preferences: {
          ...prev.preferences,
          encryption: method,
        },
      };

      // localStorage.setItem("settings", JSON.stringify(settings));
      local_storage.set(settings);
      return settings;
    });
  };

  const setDefaultTheme = (theme: AppThemeSetting) => {
    setAppSettings(prev => {
      let settings = {
        ...prev,
        preferences: {
          ...prev.preferences,
          app_theme: theme,
        }
      };

      // localStorage.setItem("settings", JSON.stringify(settings));
      local_storage.set(settings);
      return settings;
    });
  };

  const setSaveHistory = (val: boolean) => {
    setAppSettings(prev => {
      let settings = {
        ...prev,
        history: val,
      };

      // localStorage.setItem("settings", JSON.stringify(settings));
      local_storage.set(settings);
      return settings;
    });
  };

  const handleResetSettings = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDeleteNotes = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <Row>
      <Col xs={{ span: 6, offset: 3 }}>
        <Form>
          <Form.Group as={Row} controlId="encryption">
            <Form.Label column lg="6">
              Default Encryption
            </Form.Label>
            <Col lg="6" className="pt-2">
              {
                Array<EncryptionMethodKey>(
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
                      defaultChecked={appSettings.preferences.encryption === EncryptionMethod[method]}
                      label={changeCase.capitalCase(method)}
                      onClick={() => setDefaultEncryption(EncryptionMethod[method])}
                    />
                  );
                })
              }
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="theme">
            <Form.Label column lg="6">
              Theme
            </Form.Label>
            <Col lg="6" className="pt-2">
              {
                Array<AppThemeKey>(
                  "Normal",
                  "Black",
                ).map(theme_name => {
                  return (
                    <Form.Check
                      inline
                      type="radio"
                      name="theme"
                      key={theme_name}
                      id={`theme-${theme_name}`}
                      defaultChecked={appSettings.preferences.app_theme === AppThemeSetting[theme_name]}
                      label={changeCase.capitalCase(theme_name)}
                      onClick={_ => setDefaultTheme(AppThemeSetting[theme_name])}
                    />
                  );
                })
              }
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="history">
            <Form.Label column lg="6">
              History
            </Form.Label>
            <Col lg="6" className="pt-2">
              <Form.Check
                id="history-switch"
                type="switch"
                name="history"
                defaultChecked={appSettings.history}
                label={"New notes will " + (appSettings.history ? "be" : "not be") + " saved"}
                onClick={_ => setSaveHistory(!appSettings.history)}
              />
              <button onClick={handleDeleteNotes} className="btn-anchor link-danger text-decoration-none">
                Delete all saved notes!
              </button>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="actions">
            <Form.Label column lg="6">
              Others
            </Form.Label>
            <Col lg="6" className="mt-2">
              <button onClick={handleResetSettings} className="btn-anchor link-warning text-decoration-none">
                Reset all settings to default
              </button>
              <br />
              <Link to={PATHS.about} className="link-secondary">
                About page
              </Link>
            </Col>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default Settings;
