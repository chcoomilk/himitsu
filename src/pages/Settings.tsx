import { Col, Row, Form } from "react-bootstrap";
import { AppSetting, AppThemeSetting, EncryptionMethod } from "../utils/types";
import React, { useContext } from "react";
import { AppContext } from "../utils/contexts";
import { local_storage } from "../utils/functions";
import { Link } from "react-router-dom";
import { PATHS } from "../utils/constants";

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
              <Form.Check
                type="radio"
                name="encryption"
                checked={appSettings.preferences.encryption === EncryptionMethod.BackendEncryption}
                label="Backend"
                onChange={() => setDefaultEncryption(EncryptionMethod.BackendEncryption)}
              />
              <Form.Check
                type="radio"
                name="encryption"
                checked={appSettings.preferences.encryption === EncryptionMethod.FrontendEncryption}
                label="Frontend"
                onChange={() => setDefaultEncryption(EncryptionMethod.FrontendEncryption)}
              />
              <Form.Check
                type="radio"
                name="encryption"
                checked={appSettings.preferences.encryption === EncryptionMethod.NoEncryption}
                label="No encryption"
                onChange={() => setDefaultEncryption(EncryptionMethod.NoEncryption)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="theme">
            <Form.Label column lg="6">
              Theme
            </Form.Label>
            <Col lg="6" className="pt-2">
              <Form.Check
                inline
                type="radio"
                name="theme"
                checked={appSettings.preferences.app_theme === AppThemeSetting.Normal}
                label="Literally CRA"
                onChange={_ => setDefaultTheme(AppThemeSetting.Normal)}
              />
              <Form.Check
                inline
                type="radio"
                name="theme"
                checked={appSettings.preferences.app_theme === AppThemeSetting.Black}
                label="Black"
                onChange={_ => setDefaultTheme(AppThemeSetting.Black)}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="history">
            <Form.Label column lg="6">
              History
            </Form.Label>
            <Col lg="6" className="pt-2">
              <Form.Check
                type="switch"
                name="history"
                defaultChecked={appSettings.history}
                label={"New notes will " + (appSettings.history ? "be saved" : "not be saved")}
                onChange={_ => setSaveHistory(!appSettings.history)}
              />
              <button onClick={handleDeleteNotes} className="btn-anchor link-danger">
                Delete all saved notes!
              </button>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="actions">
            <Form.Label column lg="6">
              Others
            </Form.Label>
            <Col lg="6" className="mt-2">
              <button onClick={handleResetSettings} className="btn-anchor link-warning">
                Reset all settings to default
              </button>
              <br />
              <Link to={PATHS.about}>
                About me
              </Link>
            </Col>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default Settings;
