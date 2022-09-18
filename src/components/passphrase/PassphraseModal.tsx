import { useForm } from "react-hook-form";
import { Form, Modal, Button } from "react-bootstrap";
import PassphraseInputGroup from "./PassphraseInputGroup";

interface Props {
  title?: string,
  show: boolean,
  setShow: (value: boolean) => void,
  newPassphrase: (passphrase: string) => void,
}

type Fields = {
  passphrase: string,
}

const PassphraseModal = ({ title, show, setShow, newPassphrase: sendPassphraseToParent }: Props) => {
  const form = useForm<Fields>();

  const submit = (data: Fields) => {
    sendPassphraseToParent(data.passphrase);
    setShow(false);
    form.reset();
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} centered className="fs-4">
      <Form onSubmit={form.handleSubmit(submit)}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>
            <i className="bi bi-exclamation-diamond" />
            {" "}
            {title ? title : "Note is encrypted"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 fs-4" controlId="formPassphrase">
            <PassphraseInputGroup
              {...form.register("passphrase", {
                min: 4,
                max: 1024,
                required: true,
              })}
              isInvalid={form.formState.touchedFields.passphrase && !!form.formState.errors.passphrase}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Enter
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PassphraseModal;
