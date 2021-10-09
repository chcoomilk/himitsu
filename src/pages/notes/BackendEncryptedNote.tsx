import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useMutation } from "react-query";
import ModalForPassword from "../../components/ModalForPassword";
import NoteResult from "../../components/NoteResult";
import useTitle from "../../custom-hooks/useTitle";
import { get_note } from "../../queries/get_note";
import { StoreContext } from "../../utils/context";
import { generate_face } from "../../utils/generate_face";
import { BasicNote } from "../../utils/types";

interface NoteProps {
  id: number,
}

const BackendEncryptedNote = ({ id }: NoteProps) => {
  const [note, setNote] = useState<BasicNote>({
    id: +id,
    title: "",
    content: "",
    creationTime: "",
    expiryTime: ""
  });
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordFromModal, setPasswordFromModal] = useState<string>("");
  const setTitle = useTitle("Loading...");
  const { password, setAlerts } = useContext(StoreContext);
  const { mutate } = useMutation(get_note, {
    onSuccess: result => {
      if (result.is_ok) {
        let data = result.data;
        const readableExpiryTime = new Date(data.expired_at.secs_since_epoch * 1000).toLocaleTimeString();
        const readableCreationTime = new Date(data.created_at.secs_since_epoch * 1000).toLocaleTimeString();
        setNote({
          id: data.id,
          title: data.title,
          content: data.content,
          expiryTime: readableExpiryTime,
          creationTime: readableCreationTime
        });
        setTitle(data.title);
      } else {
        setAlerts(result.error);
      }
    },
    onError: () => setAlerts(value => {
      setTitle(generate_face());
      return {
        ...value,
        serverError: true
      };
    }),
  });

  useEffect(() => {
    if (password) {
      mutate({ id, password });
    } else {
      setShowPasswordModal(true);
    }
  }, [id, password, mutate]);

  useEffect(() => {
    if (passwordFromModal) {
      setAlerts((previousValue) => {
        return { ...previousValue, wrongPassword: false };
      });
      mutate({ id, password: passwordFromModal });
    }
  }, [id, passwordFromModal, mutate, setAlerts]);

  return (
    <Container fluid>
      <ModalForPassword show={showPasswordModal} setShow={setShowPasswordModal} setPassword={setPasswordFromModal} />
      <NoteResult data={note} />
    </Container>
  )
};

export default BackendEncryptedNote;
