import { useEffect, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal, Stack } from "react-bootstrap";
import { DefaultValue, PATHS } from "../../utils/constants";
import CopyButton from "../button/CopyButton";
import PassphraseInputGroup from "../passphrase/PassphraseInputGroup";

interface Props {
  control?: {
    show: boolean,
    setShow: (mode: boolean) => void,
  }
  data: {
    id: number,
    expiryTime: string,
    passphrase: string,
  },
}

const NewNoteModal = ({ control, data: { id, expiryTime, passphrase } }: Props) => {
  const [showSelf, setShowSelf] = useState(true);
  useEffect(() => setShowSelf(control ? control.show : true), [control]);

  let handleClose = () => { };
  control
    ? handleClose = () => {
      window.localStorage.removeItem(DefaultValue.pages.NewNote.local_storage_name);
      control.setShow(false);
    }
    : handleClose = () => {
      window.localStorage.removeItem(DefaultValue.pages.NewNote.local_storage_name);
      setShowSelf(false);
    };
  ;

  const handleCopyAll = () => navigator.clipboard.writeText(`${process.env.REACT_APP_URL + PATHS.note_detail + `/${id.toString()}`}\nID ${id.toString()}${passphrase ? `\nPassphrase ${passphrase}` : ""}`);

  return (
    <Modal show={showSelf} onHide={handleClose} centered contentClassName="fs-4">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Saved!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formReadOnlyID">
            <Form.Label>
              ID
            </Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                value={id}
                aria-describedby="basic-addon2"
                readOnly
              />
              <CopyButton value={id.toString()} />
            </InputGroup>
          </Form.Group>

          {
            passphrase && (
              <Form.Group className="mb-3" controlId="formReadOnlyPassphrase">
                <PassphraseInputGroup
                  name="passphrase"
                  value={passphrase}
                  readOnly
                />
              </Form.Group>
            )
          }

          <Form.Group className="mb-3" controlId="formReadOnlyExpiryTime">
            <Form.Label>
              Expires At
            </Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                value={expiryTime}
                aria-describedby="basic-addon2"
                readOnly
              />
            </InputGroup>
          </Form.Group>
          <Stack direction="horizontal" gap={3}>
            <Button className="ms-auto" variant="outline-warning" onClick={handleCopyAll}>Copy</Button>
            <Button variant="primary" onClick={handleClose}>Okay</Button>
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewNoteModal;