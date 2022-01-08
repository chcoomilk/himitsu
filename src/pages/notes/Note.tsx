import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useMutation } from "react-query";
import PasswordModal from "../../components/note/PasswordModal";
import NoteResult from "../../components/note/NoteResult";
import useTitle from "../../custom-hooks/useTitle";
import { get_note } from "../../queries/get_note";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { DefaultValue, PATHS, TIME_CONFIG } from "../../utils/constants";
import { StoreContext } from "../../utils/context";
import { generate_face } from "../../utils/generate_face";
import { BasicNote } from "../../utils/types";

const Note = () => {
  let { _id } = useParams();
  let navigate = useNavigate();
  let id: string;

  if (typeof _id === "undefined" || isNaN(+_id)) {
    id = "";
    navigate(PATHS.find_note);
  } else {
    id = _id
  }

  const { password, setAlerts } = useContext(StoreContext);

  useEffect(() => {
    return () => {
      setAlerts(DefaultValue.Error);
    };
  }, [setAlerts]);

  const [note, setNote] = useState<BasicNote>({
    id: +id,
    title: "",
    content: "",
    creationTime: "",
    expiryTime: ""
  });
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const setTitle = useTitle("Loading...");
  const { mutate, isLoading } = useMutation(get_note, {
    onSuccess: result => {
      if (result.is_ok) {
        let data = result.data;
        const readableExpiryTime = new Date(data.expired_at.secs_since_epoch * 1000)
          .toLocaleString(undefined, TIME_CONFIG);
        const readableCreationTime = new Date(data.created_at.secs_since_epoch * 1000)
          .toLocaleString(undefined, TIME_CONFIG);
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
    onError: () => {
      setTitle(generate_face());
      setAlerts(value => {
        return {
          ...value,
          serverError: true
        };
      })
    },
  });

  useEffect(() => {
    if (password) {
      mutate({ id: +id, password });
    } else {
      setShowPasswordModal(true);
    }
  }, [id, password, mutate]);

  return (
    <Container fluid>
      <PasswordModal show={showPasswordModal} setShow={setShowPasswordModal} />
      <NoteResult data={note} isLoading={isLoading} />
    </Container>
  );
};

export default Note;
