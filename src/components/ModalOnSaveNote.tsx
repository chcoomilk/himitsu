import { Button, Col, Form, FormControl, InputGroup, Modal, Row } from "react-bootstrap";

interface Props {
  show: boolean,
  setShow: (mode: boolean) => void,
  noteId: number,
  expiryTime: string,
  password: string
}

const ModalOnNewNote = ({ show, setShow, noteId, expiryTime, password }: Props) => {
  const close = () => setShow(false);

  return (
    <Modal show={show} onHide={close} centered className="modal">
      <Modal.Header closeButton>
        <Modal.Title>Saved!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="formReadOnlyID">
            <Form.Label column sm="3">
              ID:
            </Form.Label>
            <Col sm="9">
              <InputGroup className="mb-3">
                <FormControl
                  value={noteId}
                  aria-describedby="basic-addon2"
                  readOnly
                />
                <Button variant="outline-light" id="button-addon2" onClick={() => navigator.clipboard.writeText(noteId.toString())}>Copy</Button>
              </InputGroup>
            </Col>
          </Form.Group>

          {
            password
              ? (
                <Form.Group as={Row} className="mb-3" controlId="formReadOnlyPassword">
                  <Form.Label column sm="3">
                    Password:
                  </Form.Label>
                  <Col sm="9">
                    <InputGroup className="mb-3">
                      <FormControl
                        type="password"
                        value={password}
                        aria-describedby="basic-addon2"
                        readOnly
                        autoComplete="new-password"
                      />
                      <Button variant="outline-light" id="button-addon2" onClick={() => navigator.clipboard.writeText(password)}>Copy</Button>
                    </InputGroup>
                  </Col>
                </Form.Group>
              ) : (
                null
              )
          }

          <Form.Group as={Row} className="mb-3" controlId="formReadOnlyExpiryTime">
            <Form.Label column sm="3">
              Expires At:
            </Form.Label>
            <Col sm="9">
              <InputGroup className="mb-3">
                <FormControl
                  value={expiryTime}
                  aria-describedby="basic-addon2"
                  readOnly
                />
              </InputGroup>
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalOnNewNote;