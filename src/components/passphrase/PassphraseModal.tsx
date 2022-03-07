import { useState } from "react";
import { Form, Modal, Button, InputGroup } from "react-bootstrap";
// import PassphraseInputGroup from "./PassphraseInputGroup";

interface Props {
  title?: string,
  show: boolean,
  setShow: (value: boolean) => void,
  setPassphrase(passphrase: string): void
}

const PassphraseModal = ({ title, show, setShow, setPassphrase }: Props) => {
  const [form, setForm] = useState({
    passphrase: {
      mask: true,
      value: "",
    }
  });

  return (
    <Modal show={show} onHide={() => setShow(false)} centered className="fs-4">
      <Form onSubmit={(e) => {
        e.preventDefault();
        setPassphrase(form.passphrase.value);
        setForm({
          passphrase: {
            mask: true,
            value: ""
          }
        });
        setShow(false);
      }}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>
            <i className="bi bi-exclamation-diamond" />
            {" "}
            {title ? title : "Note is encrypted"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 fs-4" controlId="formPassphrase">
            {/* <PassphraseInputGroup
              onChange={e => setForm(prev => {
                return {
                  ...prev,
                  passphrase: {
                    value: e.target.value,
                    mask: prev.passphrase.mask
                  }
                }
              })}
              value={form.passphrase.value}
              name="Passphrase"
            /> */}
            <Form.Label >
              Passphrase
            </Form.Label>
            <InputGroup>
              <Form.Control
                type={form.passphrase.mask ? "password" : "text"}
                autoComplete="current-passphrase"
                onChange={e => setForm(prev => {
                  return {
                    ...prev,
                    passphrase: {
                      value: e.target.value,
                      mask: prev.passphrase.mask
                    }
                  }
                })}
                value={form.passphrase.value}
                aria-describedby="basic-addon2"
              />
              <Button
                size="sm"
                variant="outline-light"
                onClick={() => setForm(prev => {
                  return {
                    ...prev,
                    passphrase: {
                      mask: !prev.passphrase.mask,
                      value: prev.passphrase.value
                    }
                  };
                })}
              >
                {form.passphrase.mask ? <i className="bi bi-eye" /> : <i className="bi bi-eye-slash" />}
              </Button>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
            Enter
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PassphraseModal;
