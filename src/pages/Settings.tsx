import { Col, Row, Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AppSetting, AppThemeSetting, EncryptionMethod } from "../utils/types";
import React, { useContext, useState } from "react";
import AppContext from "../utils/app_state_context";
import { local_storage } from "../utils/functions";
import { Link } from "react-router-dom";
import { DefaultValue, PATHS } from "../utils/constants";
import * as changeCase from "change-case";
import SimpleConfirmationModal from "../components/SimpleConfirmationModal";
import CopyButton from "../components/button/CopyButton";

type Props = {
  setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>,
}

type EncryptionMethodKey = keyof typeof EncryptionMethod;
type AppThemeKey = keyof typeof AppThemeSetting;
const createEncryptionMethodKeys = <T extends EncryptionMethodKey[]>(
  ...array: T & ([EncryptionMethodKey] extends [T[number]] ? unknown : "Missing a key")
) => array;
const createAppThemeKeys = <T extends AppThemeKey[]>(
  ...array: T & ([AppThemeKey] extends [T[number]] ? unknown : "Missing a key")
) => array;

const Settings = ({ setAppSettings }: Props) => {
  const [modals, setModals] = useState({
    deleteNotes: {
      show: false,
    },
    resetSettings: {
      show: false,
    }
  });
  const { appSettings } = useContext(AppContext);

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

  const setDefaultTheme = (theme: AppThemeSetting) => {
    setAppSettings(prev => {
      let settings = {
        ...prev,
        app_theme: theme,
      };

      // localStorage.setItem("settings", JSON.stringify(settings));
      local_storage.set("settings", settings);
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
      local_storage.set("settings", settings);
      return settings;
    });
  };

  const handleReset = () => {
    setModals(prev => {
      prev.resetSettings.show = true;
      return { ...prev };
    });
  };

  const handleDelete = () => {
    setModals(prev => {
      prev.deleteNotes.show = true;
      return { ...prev };
    });
  };

  return (
    <Row>
      <Col xs={{ span: 6, offset: 3 }}>
        <SimpleConfirmationModal
          centered
          title="Delete all saved notes?"
          text="This will delete all of your saved notes locally. Your saved notes in the server is unaffected."
          show={modals.deleteNotes.show}
          onHide={() => setModals(prev => {
            prev.deleteNotes.show = false;
            return { ...prev };
          })}
          doDecide={val => {
            if (val) {
              local_storage.remove("notes");
            }
            setModals(prev => {
              prev.deleteNotes.show = false;
              return { ...prev };
            });
          }}
        />

        <SimpleConfirmationModal
          centered
          title="Reset settings to default?"
          text="This will reset all the settings back to their original value"
          show={modals.resetSettings.show}
          onHide={() => setModals(prev => {
            prev.resetSettings.show = false;
            return { ...prev };
          })}
          doDecide={val => {
            if (val) {
              setAppSettings(DefaultValue.settings);
              local_storage.set("settings", DefaultValue.settings);
            }
            setModals(prev => {
              prev.resetSettings.show = false;
              return { ...prev };
            });
          }}
        />

        <Form onSubmit={e => {
          e.preventDefault();
          return;
        }}>
          <Form.Group as={Row} controlId="token">
            <Form.Label column lg="6">
              Your access token
            </Form.Label>
            <Col lg="6" className="pt-2">
              <OverlayTrigger placement="auto" overlay={(p) => (
                <Tooltip id="accessTokenTooltipInfo" {...p}>
                  This is your access token
                </Tooltip>
              )}>
                <InputGroup>
                  <Form.Control
                    value={local_storage.get("token") || undefined}
                    readOnly
                  />
                  <CopyButton value={local_storage.get("token")} />
                </InputGroup>

              </OverlayTrigger>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="encryption">
            <Form.Label column lg="6">
              Default Encryption
            </Form.Label>
            <Col lg="6" className="pt-2">
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
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="theme">
            <Form.Label column lg="6">
              Theme
            </Form.Label>
            <Col lg="6" className="pt-2">
              {
                createAppThemeKeys(
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
                      checked={appSettings.app_theme === AppThemeSetting[theme_name]}
                      label={changeCase.capitalCase(theme_name)}
                      onChange={_ => setDefaultTheme(AppThemeSetting[theme_name])}
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
                checked={appSettings.history}
                label={"New notes will " + (appSettings.history ? "be" : "not be") + " saved"}
                onChange={_ => setSaveHistory(!appSettings.history)}
              />
              <button onClick={handleDelete} className="btn-anchor link-danger text-decoration-none">
                Delete all saved notes!
              </button>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="actions">
            <Form.Label column lg="6">
              Others
            </Form.Label>
            <Col lg="6" className="mt-2">
              <button onClick={handleReset} className="btn-anchor link-warning text-decoration-none">
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
