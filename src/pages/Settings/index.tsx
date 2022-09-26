import { Col, Row, Form } from "react-bootstrap";
import { AppSetting } from "../../utils/types";
import React, { useContext, useState } from "react";
import AppContext from "../../utils/app_state_context";
import { local_storage } from "../../utils/functions";
import { Link } from "react-router-dom";
import { DefaultValues, PATHS } from "../../utils/constants";
import SimpleConfirmationModal from "../../components/SimpleConfirmationModal";
import DefaultEncryptionOptions from "./DefaultEncryptionOptions";
import ThemeOptions from "./ThemeOptions";
import TokenSetting from "./TokenSetting";
import SettingsContext from "./context";

type Props = {
  setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>,
}

const Settings = ({ setAppSettings }: Props) => {
  const [modals, setModals] = useState({
    confirmDeleteNotes: false,
    confirmResetSettings: false,
    confirmDeleteAccessToken: false,
  });
  const { appSettings } = useContext(AppContext);

  const setSaveHistory = (val: boolean) => {
    setAppSettings(prev => {
      let settings = {
        ...prev,
        history: val,
      };

      local_storage.set("settings", settings);
      return settings;
    });
  };

  const handleReset = () => {
    setModals(prev => {
      prev.confirmResetSettings = true;
      return { ...prev };
    });
  };

  const handleDelete = () => {
    setModals(prev => {
      prev.confirmDeleteNotes = true;
      return { ...prev };
    });
  };

  return (
    <SettingsContext.Provider value={setAppSettings}>
      <Row>
        <SimpleConfirmationModal
          centered
          title="Delete all saved notes?"
          text="This will delete all of your saved notes locally. Your saved notes in the server is unaffected."
          show={modals.confirmDeleteNotes}
          onHide={() => setModals(prev => {
            prev.confirmDeleteNotes = false;
            return { ...prev };
          })}
          doDecide={val => {
            if (val) {
              local_storage.remove("notes");
            }
            setModals(prev => {
              prev.confirmDeleteNotes = false;
              return { ...prev };
            });
          }}
        />

        <SimpleConfirmationModal
          centered
          title="Reset settings to default?"
          text="This will reset all the settings back to their original value"
          show={modals.confirmResetSettings}
          onHide={() => setModals(prev => {
            prev.confirmResetSettings = false;
            return { ...prev };
          })}
          doDecide={val => {
            if (val) {
              setAppSettings(DefaultValues.settings);
              local_storage.set("settings", DefaultValues.settings);
            }
            setModals(prev => {
              prev.confirmResetSettings = false;
              return { ...prev };
            });
          }}
        />

        <Col xs={{ span: 6, offset: 3 }}>
          <Form onSubmit={e => {
            e.preventDefault();
            return;
          }}>
            <Form.Group as={Row} controlId="general" className="mb-2">
              <Form.Label column lg="6">
                General
              </Form.Label>
              <Col lg="6">
                <Form.Check
                  id="history-switch"
                  type="switch"
                  name="history"
                  className="text-nowrap"
                  checked={appSettings.history}
                  label={"New notes will " + (appSettings.history ? "be" : "not be") + " saved"}
                  onChange={_ => setSaveHistory(!appSettings.history)}
                />
                <button onClick={handleDelete} className="btn-anchor link-danger text-decoration-none text-start">
                  Delete all saved notes!
                </button>
                <button onClick={handleReset} className="btn-anchor link-warning text-decoration-none text-start">
                  Reset all settings to default
                </button>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="encryption" className="mb-2">
              <Form.Label column lg="6">
                Default Encryption
              </Form.Label>
              <Col lg="6">
                <DefaultEncryptionOptions />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="theme" className="mb-2">
              <Form.Label column lg="6">
                Theme
              </Form.Label>
              <Col lg="6">
                <ThemeOptions />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="token" className="mb-2">
              <Form.Label column lg="6">
                Access token
              </Form.Label>
              <Col lg="6">
                <TokenSetting />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="links">
              <Form.Label column lg="6">
                Links
              </Form.Label>
              <Col lg="6">
                <div>
                  <Link to={PATHS.about} className="link-secondary text-start text-decoration-none">
                    About page
                  </Link>
                </div>
                <div>
                  <a target="_blank" rel="noreferrer" href="https://github.com/chcoomilk/himitsu-backend" className="link-secondary text-decoration-none">
                    <i className="bi bi-github" />
                    {" "}
                    Project's backend
                  </a>
                </div>

                <div>
                  <a target="_blank" rel="noreferrer" href="https://github.com/chcoomilk/himitsu" className="link-secondary text-decoration-none">
                    <i className="bi bi-github" />
                    {" "}
                    Project's browser app
                  </a>
                </div>
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </SettingsContext.Provider>
  );
};

export default Settings;
