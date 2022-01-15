import { Form } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { NoteType } from "../../utils/types";

interface Props {
  data: NoteType,
  isLoading: boolean,
}

const NoteResult = (props: Props) => {
  const note = props.data;

  return (
    <Form noValidate>
      <SkeletonTheme baseColor="#24282e" highlightColor="#aaa">
        <Form.Group controlId="formBasicTitle" className="mb-3 pb-2">
          <Form.Label>Title</Form.Label>
          {
            props.isLoading
              ? <Skeleton height={25} />
              : <Form.Control
                type="text"
                name="title"
                value={note.title}
                readOnly
              />
          }
        </Form.Group>

        <Form.Group controlId="formBasicDescription" className="mb-3 pb-2">
          <Form.Label>Description</Form.Label>
          {
            props.isLoading
              ? <Skeleton height={100} />
              : <Form.Control
                as="textarea"
                name="content"
                rows={3}
                value={note.content}
                readOnly
              />
          }
        </Form.Group>

        <Form.Group controlId="formBasicCreatedAt" className="mb-3 pb-2">
          <Form.Label>Created at</Form.Label>
          {
            props.isLoading
              ? <Skeleton height={25} />
              : <Form.Control
                type="text"
                name="created"
                value={note.creationTime}
                readOnly
              />
          }
        </Form.Group>

        <Form.Group controlId="formBasicExpiresAt" className="mb-3 pb-2">
          <Form.Label>Expires at</Form.Label>
          {
            props.isLoading
              ? <Skeleton height={25} />
              : <Form.Control
                type="text"
                name="expires"
                value={note.expiryTime}
                readOnly
              />
          }
        </Form.Group>
      </SkeletonTheme>
    </Form>
  );
};

export default NoteResult;
