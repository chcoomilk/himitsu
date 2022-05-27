import { useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal, Stack } from "react-bootstrap";
import CopyButton from "../button/CopyButton";
import PassphraseInputGroup from "../passphrase/PassphraseInputGroup";
import { PATHS } from "../../utils/constants";
import { NoteInfo } from "../../utils/types";
import { into_readable_datetime } from "../../utils/functions";

type UNoteInfo = NoteInfo & {
  passphrase?: string,
}

interface Props {
  data: UNoteInfo,
  onHide?: () => void,
}

const NewNoteModal = ({ data: { id, expired_at, passphrase }, onHide: doUponHide }: Props) => {
  const [show, setShow] = useState(true);

  let handleClose = () => {
    setShow(false);
    if (doUponHide) doUponHide();
  };
  const handleCopyAll = () => navigator.clipboard.writeText(`${window.location.host + PATHS.note_detail + `/${id.toString()}`}\nID ${id.toString()}${passphrase ? `\nPassphrase ${passphrase}` : ""}`);

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="fs-4">
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
                value={expired_at ? into_readable_datetime(expired_at.secs_since_epoch) : "Never"}
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