import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Form, FormControl, InputGroup, Modal, Overlay, Stack, Tooltip } from "react-bootstrap";
import CopyButton from "../button/CopyButton";
import PassphraseInputGroup from "../input/PassphraseInputGroup";
import { PATHS } from "../../utils/constants";
import { NoteInfo } from "../../utils/types";
import { into_readable_datetime } from "../../utils/functions";
import { useNavigate } from "react-router-dom";

type UNoteInfo = NoteInfo & {
  passphrase?: string,
}

interface Props {
  data: UNoteInfo,
  show?: boolean,
  onHide?: () => void,
}

const NewNoteModal = ({ data: { id, expires_at: expired_at, passphrase }, onHide: doUponHide, show: _show }: Props) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [tooltip, setTooltip] = useState(false);
  const target = useRef(null);

  useEffect(() => {
    if (tooltip) {
      let timer = setTimeout(() => setTooltip(false), 1200);
      return () => {
        setTooltip(false);
        clearTimeout(timer);
      };
    }
  }, [tooltip]);

  const handleClose = () => {
    if (doUponHide) doUponHide();
    setShow(false);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(`${window.location.host + PATHS.note_detail + `/${encodeURIComponent(id.toString())}`}\nID ${id.toString()}${passphrase ? `\nPassphrase ${passphrase}` : ""}`);
    setTooltip(true);
  };

  const handleGoToNote = (e: React.MouseEvent) => {
    e.preventDefault();
    if (doUponHide) doUponHide();
    setShow(false);
    navigate(PATHS.note_detail + `/${encodeURIComponent(id.toString())}`, { state: { passphrase } });
  };

  return (
    <Modal show={_show !== undefined ? _show : show} onHide={handleClose} centered contentClassName="fs-4">
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
              <CopyButton copy_value={id.toString()} />
            </InputGroup>
          </Form.Group>

          {
            passphrase && (
              <Form.Group className="mb-3" controlId="formReadOnlyPassphrase">
                <PassphraseInputGroup
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
          <Stack direction="horizontal" gap={2}>
            <Button title="Copy all the value" className="ms-auto" variant="warning" onClick={handleCopyAll} ref={target}>Copy</Button>
            <ButtonGroup>
              <Button style={{ borderRight: "1px solid #0a58ca" }} title="Close this popup modal" variant="primary" onClick={handleClose}>Okay</Button>
              <Button
                title="Go see the note"
                style={{
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  borderLeft: "1px solid #0a58ca"
                }}
                variant="primary"
                href={`${PATHS.note_detail + `/${id.toString()}`}`}
                onClick={handleGoToNote}
              >
                <i style={{ fontSize: "0.8rem" }} className="bi bi-caret-right-fill" />
              </Button>
            </ButtonGroup>
          </Stack>
          <Overlay target={target.current} show={tooltip} placement="bottom-end">
            {(props) => (
              <Tooltip {...props}>
                Copied!
              </Tooltip>
            )}
          </Overlay>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewNoteModal;