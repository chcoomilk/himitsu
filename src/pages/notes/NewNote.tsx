import { useEffect, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import LoginRegisterModal from "../../components/LoginRegisterModal";
import useLoginStatus from "../../utils/useLoginStatus";

const NewNote = () => {
  const { login, status } = useLoginStatus();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [usn, seusn] = useState<string>("")

  useEffect(() => {
    if (status) login ? setShowModal(false) : setShowModal(false);
  }, [login, status]);

  const Submit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(usn);
  };

  return (
    <>
      <LoginRegisterModal show={showModal} />
      <Form onSubmit={Submit} className="New-note-form">
        <Form.Group controlId="formBasicTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Enter note's title here" onChange={e=>seusn(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBasicDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Enter nii-chan's secret here, promise won't see" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mt-2">
          <Form.Label>Password</Form.Label>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={((props) => (
              <Tooltip id="description-tooltip" {...props}>
                Remember not to lose this note's password, otherwise there is no way to decrpyt your note. Not even the developers can help you!
              </Tooltip>
            ))}
          >
            <Form.Control type="password" placeholder="Enter super secret password" />
          </OverlayTrigger>
        </Form.Group>
        <Button type="submit" className="mt-3">Submit</Button>
      </Form>
    </>
  );
};

export default NewNote;
