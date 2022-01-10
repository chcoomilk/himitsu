import { useCallback, useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useMutation } from "react-query";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import cryptojs from "crypto-js";

import PasswordModal from "../../components/note/PasswordModal";
import NoteResult from "../../components/note/NoteResult";
import useTitle from "../../custom-hooks/useTitle";
import { get_note } from "../../queries/get_note";
import { DefaultValue, PATHS, TIME_CONFIG } from "../../utils/constants";
import { StoreContext } from "../../utils/context";
import { generate_face } from "../../utils/generate_face";
import { BasicNote } from "../../utils/types";
import { get_note_info } from "../../queries/get_note_info";

interface Modal {
  showModal: boolean,
  password: string | null,
}

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
    decrypted: true,
    creationTime: "",
    expiryTime: "",
    fetched: false,
  });
  const [modalDecrypt, setModalDecrypt] = useState<Modal>({
    showModal: false,
    password: null,
  });
  const [modalMutate, setModalMutate] = useState<Modal>({
    showModal: false,
    password: null
  });

  const setTitle = useTitle("Loading...");

  const { mutate, isLoading } = useMutation(get_note, {
    onSuccess: result => {
      if (result.is_ok) {
        let data = result.data;
        const readableExpiryTime = data.expired_at
          ? new Date(data.expired_at.secs_since_epoch * 1000).toLocaleString(undefined, TIME_CONFIG)
          : "Never";
        const readableCreationTime = new Date(data.created_at.secs_since_epoch * 1000)
          .toLocaleString(undefined, TIME_CONFIG);
        setNote({
          id: data.id,
          title: data.title,
          content: data.content,
          decrypted: data.decrypted,
          expiryTime: readableExpiryTime,
          creationTime: readableCreationTime,
          fetched: true,
        });
        setTitle(data.title);
      } else {
        setTitle(generate_face());
        setAlerts(result.error);

        if (result.error.wrongPassword) {
          setModalMutate(prev => {
            return {
              ...prev,
              showModal: true
            };
          });
        }
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

  const { mutate: inf_mut, isLoading: inf_is_loading } = useMutation(get_note_info, {
    onSuccess: result => {
      if (result.is_ok) {
        if (result.data.decryptable) {
          if (password !== null) {
            mutate({ id: +id, password });
          } else {
            setModalMutate(prev => {
              return {
                ...prev,
                showModal: true
              };
            });
          }
        } else {
          if (!result.data.encryption && password !== null) {
            setAlerts(prev => {
              return {
                ...prev,
                passwordNotRequired: true
              };
            });
          }

          mutate({ id: +id, password: null });
        }
      } else {
        setAlerts(result.error)
      }
    }
  });

  const try_decrypt = useCallback((password: string): void => {
    let content = cryptojs.AES.decrypt(note.content, password).toString(cryptojs.enc.Utf8);
    if (content === "") {
      setAlerts(prev => {
        return {
          ...prev,
          wrongPassword: true,
        };
      });
      setModalDecrypt({
        password: null,
        showModal: true,
      });
    } else {
      setAlerts(prev => {
        return {
          ...prev,
          wrongPassword: false,
        };
      });
      setModalDecrypt({
        password: null,
        showModal: false,
      });
      setNote(prev => {
        return {
          ...prev,
          decrypted: true,
          content
        };
      });
    }
  }, [note.content, setAlerts]);

  useEffect(() => {
    inf_mut({ id: +id });
  }, [id, inf_mut]);

  useEffect(() => {
    if (!note.decrypted && modalDecrypt.password !== null) {
      try_decrypt(modalDecrypt.password);
    }
  }, [note.decrypted, modalDecrypt.password, try_decrypt]);

  useEffect(() => {
    if (!note.decrypted) {
      if (password !== null) {
        try_decrypt(password);
      } else {
        setModalDecrypt(prev => {
          return {
            ...prev,
            showModal: true
          };
        });
      }
    } else {
      setModalDecrypt(prev => {
        return {
          ...prev,
          showModal: false
        };
      });
    }
  }, [note.decrypted, password, try_decrypt]);

  useEffect(() => {
    if (modalMutate.password !== null) {
      mutate({ id: +id, password: modalMutate.password });
    }
  }, [id, modalMutate.password, mutate]);

  return (
    <Container fluid>

      <PasswordModal
        show={modalDecrypt.showModal}
        setShow={(show) => setModalDecrypt(prev => {
          return { ...prev, showModal: show };
        })}
        setPassword={(password) => setModalDecrypt(prev => {
          return { ...prev, password: password };
        })} />

      <PasswordModal
        show={modalMutate.showModal}
        setShow={(show) => setModalMutate(prev => {
          return { ...prev, showModal: show };
        })}
        setPassword={(password) => setModalMutate(prev => {
          return { ...prev, password: password };
        })} />

      <NoteResult data={note} isLoading={inf_is_loading || isLoading} whenRetry={() => setModalDecrypt(prev => {
        return {
          ...prev,
          showModal: true,
        };
      })} />
    </Container>
  );
};

export default Note;
