import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";

interface Props {
  show: boolean,
  setShow: (mode: boolean) => void,
  data: {
    id: string,
    expiryTime: string,
    password: string,
  },
}

const ModalOnNewNote = ({ show, setShow, data: { id, expiryTime, password } }: Props) => {
  const close = () => setShow(false);

  return (
    <Modal show={show} onHide={close} centered contentClassName="smaller-font">
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
              <Button variant="outline-light" id="button-addon2" onClick={() => navigator.clipboard.writeText(id.toString())}>Copy</Button>
            </InputGroup>
          </Form.Group>

          {
            password
              ? (
                <Form.Group className="mb-3" controlId="formReadOnlyPassword">
                  <Form.Label>
                    Password
                  </Form.Label>
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

export default ModalOnNewNote;