import { useCallback, useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useQuery } from "react-query";
import ModalForPassword from "../../components/ModalForPassword";
import NoteResult from "../../components/NoteResult";
import useTitle from "../../custom-hooks/useTitle";
import { get_plain_note } from "../../queries/get_plain_note";
import { StoreContext } from "../../utils/context";
import { generate_face } from "../../utils/generate_face";
import { BasicNote } from "../../utils/types";
import cryptojs from "crypto-js";

interface PlainNoteProps {
  id: string,
}

const PlainNote = (props: PlainNoteProps) => {
  const setTitle = useTitle("Loading...");
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [plainNote, setPlainNote] = useState<BasicNote>({
    id: "",
    title: "",
    content: "",
    creationTime: "",
    expiryTime: "",
  });
  const { password, setAlerts } = useContext(StoreContext);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordFromModal, setPasswordFromModal] = useState<string>("");
  const { isLoading } = useQuery(
    ["get_plain", { id: props.id }] as const,
    ({ queryKey }) => get_plain_note(queryKey[1].id),
    {
      onSuccess: result => {
        if (result.is_ok) {
          let data = result.data;
          const readableExpiryTime = new Date(data.expired_at.secs_since_epoch * 1000).toLocaleTimeString();
          const readableCreationTime = new Date(data.created_at.secs_since_epoch * 1000).toLocaleTimeString();
          setIsEncrypted(data.is_encrypted);
          setPlainNote({
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
      }
    }
  );

  const decrypt = useCallback((password: string) => {
    const decrypted_content = cryptojs.AES.decrypt(plainNote.content, password).toString(cryptojs.enc.Utf8);
    const decrypted_title = cryptojs.AES.decrypt(plainNote.title, password).toString(cryptojs.enc.Utf8);
    if (decrypted_title || decrypted_content) {
      
    }
    setPlainNote(value => {
      return {
        ...value,
        title: decrypted_title,
        content: decrypted_content,
      }
    })
  }, [plainNote, setPlainNote]);

  useEffect(() => {
    if (isEncrypted) {
      if (password) {
        decrypt(password);
      } else {
        setShowPasswordModal(true);
      }
    }
    // eslint-disable-next-line
  }, [isEncrypted, password, setShowPasswordModal]);

  useEffect(() => {
    if (passwordFromModal) {
      decrypt(passwordFromModal);
      setShowPasswordModal(false);
    }
    // eslint-disable-next-line
  }, [passwordFromModal]);

  // const { } = useQuery({
  //   queryKey: ["get_plain", props.id] as const,
  //   queryFn: get_plain_note,
  // }); // somebody tell me how to use this

  return (
    <Container fluid>
      <ModalForPassword show={showPasswordModal} setShow={setShowPasswordModal} setPassword={setPasswordFromModal} />
      <NoteResult data={plainNote} />
    </Container>
  );
};

export default PlainNote;
