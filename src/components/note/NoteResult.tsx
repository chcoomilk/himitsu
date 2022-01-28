import { Form } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { generate_face } from "../../utils/functions";
import { NoteType } from "../../utils/types";

interface Props {
  data: NoteType,
  isLoading: boolean,
}

const NoteResult = (props: Props) => {
  const note = props.data;

  let readonly_form = props.isLoading ? {
    title: <Skeleton height={25} />,
    description: <Skeleton height={100} />,
    created_at: <Skeleton height={25} />,
    expired_at: <Skeleton height={25} />
  } : {
    title: <Form.Control
      type="text"
      name="title"
      value={note.title}
      readOnly
    />,
    description: <Form.Control
      as="textarea"
      name="content"
      rows={3}
      value={props.data.already_decrypted ? note.content : generate_face()}
      readOnly
    />,
    created_at: <Form.Control
      type="text"
      name="created"
      value={note.creationTime}
      readOnly
    />,
    expired_at: <Form.Control
      type="text"
      name="expires"
      value={note.expiryTime}
      readOnly
    />,
  }

  return (
    <Form noValidate>
      <SkeletonTheme duration={3.5} baseColor="#24282e" highlightColor="#303541">
        <Form.Group controlId="formBasicTitle" className="mb-3 pb-2">
          <Form.Label>Title</Form.Label>
          {readonly_form.title}
        </Form.Group>

        <Form.Group controlId="formBasicDescription" className="mb-3 pb-2">
          <Form.Label>Description</Form.Label>
          {readonly_form.description}
        </Form.Group>

        <Form.Group controlId="formBasicCreatedAt" className="mb-3 pb-2">
          <Form.Label>Created at</Form.Label>
          {readonly_form.created_at}
        </Form.Group>

        <Form.Group controlId="formBasicExpiresAt" className="mb-3 pb-2">
          <Form.Label>Expires at</Form.Label>
          {readonly_form.expired_at}
        </Form.Group>
      </SkeletonTheme>
    </Form>
  );
};

export default NoteResult;
