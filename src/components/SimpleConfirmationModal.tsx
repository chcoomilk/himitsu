import { Button, Form, Modal, ModalProps } from "react-bootstrap";

type Props = ModalProps & {
  /** either user agrees with the term(s) given or not */
  doDecide: (decision: boolean) => void,
  title?: string,
  text?: string,
}

const SimpleConfirmationModal = ({ doDecide: result, title, text, ...attr }: Props) => {
  const agree = () => result(true);
  const disagree = () => result(false);

  return (
    <Modal {...attr}>
      <Form onSubmit={e => {
        agree();
        e.preventDefault();
      }}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>
            <i className="bi bi-exclamation-diamond" />
            {" "}
            {title ? title : "Are you sure about this?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="fs-6">
          {
            text ? text : "Every 60 seconds around the world, a minute passes in Africa"
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={disagree}>
            No
          </Button>
          <Button variant="primary" type="submit">
            Yes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SimpleConfirmationModal;
