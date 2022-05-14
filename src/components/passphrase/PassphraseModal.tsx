import { useFormik } from "formik";
import { Form, Modal, Button } from "react-bootstrap";
import PassphraseInputGroup from "./PassphraseInputGroup";
import * as yup from "yup";

interface Props {
  title?: string,
  show: boolean,
  setShow: (value: boolean) => void,
  newPassphrase: (passphrase: string) => void,
}

const PassphraseModal = ({ title, show, setShow, newPassphrase: sendToParentPassphrase }: Props) => {
  const formik = useFormik({
    validationSchema: yup.object().shape({
      passphrase: yup.string().min(4).max(1024).required()
    }),
    initialValues: {
      passphrase: ""
    },
    onSubmit: (value, form) => {
      sendToParentPassphrase(value.passphrase);
      setShow(false);
      form.resetForm();
    }
  });

  return (
    <Modal show={show} onHide={() => setShow(false)} centered className="fs-4">
      <Form onSubmit={formik.handleSubmit}>
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
              name="passphrase"
              onChange={formik.handleChange}
              value={formik.values.passphrase}
              onBlur={formik.handleBlur}
              errorMessage={formik.errors.passphrase}
              isInvalid={formik.touched.passphrase && !!formik.errors.passphrase}
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
