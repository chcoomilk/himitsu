import { useContext } from "react";
import { capitalCase } from "change-case";
import { Form } from "react-bootstrap";
import AppSettingContext from "../../../../utils/AppSettingContext";
import { createEncryptionMethodKeys, EncryptionMethod } from "../../../../utils/types";
import NewNoteContext from "../context";
import InfoCircle from "../../../../components/InfoCircle";


const NewNoteDefaultSettingFormGroup = () => {
  const appSettings = useContext(AppSettingContext);
  const [pageState, dispatch] = useContext(NewNoteContext);

  return (
    <>
      <Form.Group controlId="setMustExpire" className="mb-2">
        <Form.Switch
          inline
          className="me-0"
          name="Note must always have expiration time"
          checked={pageState.mustExpire}
          onChange={() => dispatch({ type: "toggleMustExpire" })}
          label="Enforce expiry"
        /> <InfoCircle
          id="setMustExpire"
        >
          Force the note to have an expiration. Warning! if this is turned off,
          you can have a note that lasts forever.
        </InfoCircle>
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
      <Form.Group className="mb-2">
        <Form.Group controlId="simpleModeOption">
          <Form.Switch
            className="me-0"
            inline
            name="simpleMode"
            checked={pageState.simpleMode}
            onChange={() => dispatch({ type: "toggleSimpleMode" })}
            label="Simple mode"
          /> <InfoCircle
            id="simpleModeOption"
          >
            In simple mode, you don't need to choose any encryption, it'll do it automatically for you.
          </InfoCircle>
        </Form.Group>
        <Form.Label htmlFor="encryption">
          Default encryption
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
                disabled={pageState.simpleMode}
                checked={pageState.defaultEncryption === EncryptionMethod[method]}
                label={capitalCase(method)}
                onChange={() => dispatch({ type: "setDefaultEncryption", payload: EncryptionMethod[method] })}
              />
            );
          })
        }
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
