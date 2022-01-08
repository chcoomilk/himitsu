import { Col, Form, Row, Spinner } from "react-bootstrap";

interface Props {
  data: {
    id: number;
    title: string;
    content: string;
    expiryTime: string;
    creationTime: string;
  },
  isLoading: boolean
}

const NoteResult = (props: Props) => {
  const note = props.data;

  return (
    <Row>
      <Col xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }}>
        <Spinner hidden={!props.isLoading} animation="border" />
        <Form noValidate>
          <Form.Group controlId="formBasicTitle" className="mb-3 pb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={note.title}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="formBasicDescription" className="mb-3 pb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              rows={3}
              value={note.content}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="formBasicCreatedAt" className="mb-3 pb-2">
            <Form.Label>Created At</Form.Label>
            <Form.Control
              type="text"
              name="created"
              value={note.creationTime}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="formBasicExpiresAt" className="mb-3 pb-2">
            <Form.Label>Expires At</Form.Label>
            <Form.Control
              type="text"
              name="expires"
              value={note.expiryTime}
              readOnly
            />
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default NoteResult;
