import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";

interface Props {
  show: boolean,
  setShow: (mode: boolean) => void,
  data: {
    id: number,
    expiryTime: string,
    passphrase: string,
  },
}

const NewNoteModal = ({ show, setShow, data: { id, expiryTime, passphrase } }: Props) => {
  const close = () => setShow(false);

  return (
    <Modal show={show} onHide={close} centered contentClassName="fs-4">
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
              <Button
                variant="outline-light"
                id="button-addon2"
                onClick={() => navigator.clipboard.writeText(id.toString())}>
                <i className="bi bi-journals" />
              </Button>
            </InputGroup>
          </Form.Group>

          {
            passphrase
              ? (
                <Form.Group className="mb-3" controlId="formReadOnlyPassphrase">
                  <Form.Label>
                    Passphrase
                  </Form.Label>
                  <InputGroup className="mb-3">
                    <FormControl
                      type="password"
                      value={passphrase}
                      aria-describedby="basic-addon2"
                      readOnly
                      autoComplete="new-passphrase"
                    />
                    <Button
                      variant="outline-light"
                      id="button-addon2"
                      onClick={() => navigator.clipboard.writeText(passphrase)}
                    >
                      <i className="bi bi-journals" />
                    </Button>
                  </InputGroup>
                </Form.Group>
              ) : (
                null
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewNoteModal;