import { useContext, useState } from "react";
import { Tab, Modal, Nav } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import NewNoteContext from "./context";
import { Fields } from "./formtypes";
import NewNoteDefaultSettingFormGroup from "./components/DefaultSettingForm";
import NewNoteOptionalGroupForm from "./components/OptionalGroupForm";

type Props = {
  show: boolean,
  onHide: () => void,
}

enum Tabs {
  Common = "Common",
  Defaults = "Defaults"
}

const OptionModal = ({ show, onHide }: Props) => {
  const form = useFormContext<Fields>();
  const [tabs, setTabs] = useState<Tabs>(Tabs.Common);
  const [pageState] = useContext(NewNoteContext);

  return (
    <Tab.Container defaultActiveKey={tabs}>
      <Modal scrollable size="lg" centered show={show} onHide={
        async () => {
          // Modify this to prevent option or setting modal in this form to hide
          let is_okay = await form.trigger("extra.double_encryption"); // triggers double encryption first so it's able to check if double_encryption.passphrase should be validated or not          i think
          is_okay = await form.trigger([
            "extra.double_encryption",
            "title",
            "custom_id",
            "duration",
            "extra.delete_after_read"
          ], {
            shouldFocus: true
          });

          is_okay && onHide();
        }
      }>
        <Modal.Header closeButton closeVariant="white">
          Options
        </Modal.Header>
        <Modal.Body style={pageState.modals.extra_settings_static_height ? { height: "512px" } : undefined}>
          <Tab.Content>
            <Tab.Pane eventKey={Tabs.Common}>
              <NewNoteOptionalGroupForm />
            </Tab.Pane>
            <Tab.Pane eventKey={Tabs.Defaults}>
              <NewNoteDefaultSettingFormGroup />
            </Tab.Pane>
          </Tab.Content>
        </Modal.Body>
        <Modal.Footer className="p-0">
          <Nav className="w-100 m-0" fill variant="pills" onSelect={(v: any) => setTabs(v)}>
            <Nav.Item>
              <Nav.Link eventKey={Tabs.Common}>Common</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={Tabs.Defaults}>Defaults</Nav.Link>
            </Nav.Item>
          </Nav>
        </Modal.Footer>
      </Modal>
    </Tab.Container>
  );
};

export default OptionModal;
