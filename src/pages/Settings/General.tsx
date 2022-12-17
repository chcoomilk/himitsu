import { useContext } from "react";
import { Form } from "react-bootstrap";
import InfoCircle from "../../components/InfoCircle";
import AppSettingContext from "../../utils/AppSettingContext";
import SettingsContext from "./context";

type Props = {
  resetAllSettingsOnClick: () => void,
  deleteSavedNotesOnClick: () => void,
}

const GeneralSetting = ({ resetAllSettingsOnClick, deleteSavedNotesOnClick }: Props) => {
  const appSettings = useContext(AppSettingContext);
  const setAppSettings = useContext(SettingsContext);

  return (
    <>
      <Form.Check
        id="history-switch"
        type="switch"
        name="history"
        className="text-nowrap"
        checked={appSettings.history}
        label={
          <>History <InfoCircle>
            The ability to save any notes locally.
            <br />
            <span className="text-warning">
              No content or sensitive information will be saved!
            </span>
          </InfoCircle></>
        }
        onChange={_ => setAppSettings({ type: "toggleHistory" })}
      />
      <Form.Check
        id="autofocus-switch"
        type="switch"
        name="autofocus"
        className="text-nowrap"
        checked={appSettings.autofocus}
        label={"Input autofocus on page change"}
        onChange={_ => setAppSettings({ type: "toggleAutofocus" })}
      />
      <button onClick={deleteSavedNotesOnClick} className="btn-anchor link-danger text-decoration-none text-start">
        Delete all saved notes!
      </button>
      <br />
      <button onClick={resetAllSettingsOnClick} className="btn-anchor link-warning text-decoration-none text-start">
        Reset all settings to default
      </button>
    </>
  );
};

export default GeneralSetting;
