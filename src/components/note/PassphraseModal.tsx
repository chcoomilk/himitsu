import { useEffect, useState } from "react";
import { Col, Form, FormControl, Modal, Button } from "react-bootstrap";

interface Props {
  title?: string,
  show: boolean,
  setShow: (value: boolean) => void,
  setPassphrase(passphrase: string): void
}

const PassphraseModal = ({ title, show, setShow, setPassphrase }: Props) => {
  const [form, setForm] = useState({
    passphrase: ""
  });

  useEffect(() => {
    setForm({
      passphrase: ""
    });
  }, []);

  return (
    <Modal show={show} onHide={() => setShow(false)} centered className="fs-4">
      <Form onSubmit={(e) => {
        e.preventDefault();
        setPassphrase(form.passphrase);
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
            <Form.Label >
              Passphrase
            </Form.Label>
            <Col>
              <FormControl
                type="passphrase"
                autoComplete="current-passphrase"
                onChange={e => setForm((prev) => {
                  return {
                    ...prev,
                    passphrase: e.target.value
                  }
                })}
                value={form.passphrase}
                aria-describedby="basic-addon2"
              />
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
            OK!
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PassphraseModal;
