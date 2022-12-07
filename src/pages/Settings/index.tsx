import { Col, Row, Form, Container } from "react-bootstrap";
import { AppSetting } from "../../utils/types";
import React, { useState } from "react";
import { local_storage } from "../../utils/functions";
import { Link } from "react-router-dom";
import { DefaultValues, PATHS } from "../../utils/constants";
import SimpleConfirmationModal from "../../components/modal/SimpleConfirmationModal";
import DefaultEncryptionOptions from "./DefaultEncryptionOptions";
import ThemeOptions from "./ThemeOptions";
import TokenSetting from "./TokenSetting";
import SettingsContext from "./context";
import GeneralSetting from "./General";

type Props = {
  setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>,
}

const Settings = ({ setAppSettings }: Props) => {
  const [modals, setModals] = useState({
    confirmDeleteNotes: false,
    confirmResetSettings: false,
    confirmDeleteAccessToken: false,
  });

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
    <Container className="d-flex flex-fill align-items-center justify-content-center">
      <SettingsContext.Provider value={setAppSettings}>
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

        <Form className="w-100" onSubmit={e => {
          e.preventDefault();
          return;
        }}>
          <Form.Group as={Row} controlId="general" className="mb-2">
            <Form.Label column xl={{ span: 3, offset: 3 }} lg="6">
              General
            </Form.Label>
            <Col lg="6" xl="4">
              <GeneralSetting deleteSavedNotesOnClick={handleDelete} resetAllSettingsOnClick={handleReset} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="encryption" className="mb-2">
            <Form.Label column xl={{ span: 3, offset: 3 }} lg="6">
              Default Encryption
            </Form.Label>
            <Col lg="6" xl="4">
              <DefaultEncryptionOptions />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="theme" className="mb-2">
            <Form.Label column xl={{ span: 3, offset: 3 }} lg="6">
              Theme
            </Form.Label>
            <Col lg="6" xl="4">
              <ThemeOptions />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="token" className="mb-2">
            <Form.Label column xl={{ span: 3, offset: 3 }} lg="6">
              Access token
            </Form.Label>
            <Col lg="6" xl="4">
              <TokenSetting />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="links">
            <Form.Label column xl={{ span: 3, offset: 3 }} lg="6">
              Links
            </Form.Label>
            <Col lg="6" xl="4">
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
      </SettingsContext.Provider>
    </Container>
  );
};

export default Settings;
