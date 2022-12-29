import { useContext } from "react";
import { capitalCase } from "change-case";
import { Form } from "react-bootstrap";
import AppSettingContext from "../../../../utils/AppSettingContext";
import { createEncryptionMethodKeys, EncryptionMethod } from "../../../../utils/types";
import NewNoteContext from "../context";


const NewNoteDefaultSettingFormGroup = () => {
  const appSettings = useContext(AppSettingContext);
  const [pageState, dispatch] = useContext(NewNoteContext);

  return (
    <>
      <Form.Group controlId="setDefaultEncryption" className="mb-2">
        <Form.Label>
          Default Encryption
        </Form.Label>
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
                checked={pageState.defaultEncryption === EncryptionMethod[method]}
                label={capitalCase(method)}
                onChange={() => dispatch({ type: "setDefaultEncryption", payload: EncryptionMethod[method] })}
              />
            );
          })
        }
      </Form.Group>
      <Form.Group controlId="setAlwaysSave" className="mb-2">
        <Form.Switch
          inline
          name="alwaysSaveOnSubmit"
          checked={pageState.alwaysSaveOnSubmit}
          disabled={!appSettings.history}
          onChange={() => dispatch({ type: "toggleAlwaysSaveOnSubmit" })}
          label="Always save note after submit"
        />
      </Form.Group>
      <Form.Group controlId="staticHeight" className="mb-2">
        <Form.Switch
          inline
          name="staticHeight"
          checked={pageState.modals.extra_settings_static_height}
          onChange={() => dispatch({ type: "toggleExtraSettingsStaticHeight" })}
          label="Static window height"
        />

      </Form.Group>
      <Form.Group controlId="contentRow" className="mb-2">
        <Form.Label>Secret text area height</Form.Label>
        <Form.Range
          aria-label="content/secret textarea row"
          name="contentRow"
          min={1}
          value={pageState.textAreaRow}
          onChange={(e) => dispatch({ type: "setTextAreaRow", payload: e.target.valueAsNumber })}
        />
      </Form.Group>
    </>
  );
};

export default NewNoteDefaultSettingFormGroup;