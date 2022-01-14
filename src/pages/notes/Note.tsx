import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { useMutation } from "react-query";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import cryptojs from "crypto-js";

import PassphraseModal from "../../components/note/PassphraseModal";
import NoteResult from "../../components/note/NoteResult";
import useTitle from "../../custom-hooks/useTitle";
import { get_note } from "../../queries/get_note";
import { PATHS, TIME_CONFIG } from "../../utils/constants";
import { StoreContext } from "../../utils/context";
import { generate_face } from "../../utils/generate_face";
import { BasicNote } from "../../utils/types";
import { get_note_info } from "../../queries/get_note_info";
import { delete_note } from "../../queries";

interface Modal {
  showModal: boolean,
  passphrase: string | null,
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

  const { passphrase, setPopups } = useContext(StoreContext);

  const [note, setNote] = useState<BasicNote>({
    id: +id,
    title: "",
    content: "",
    is_already_decrypted: null,
    creationTime: "",
    expiryTime: "",
    lastUpdateTime: "",
    passphrase: "",
  });
  const [modalDecrypt, setModalDecrypt] = useState<Modal>({
    showModal: false,
    passphrase: null,
  });
  const [modalMutate, setModalMutate] = useState<Modal>({
    showModal: false,
    passphrase: null
  });
  const [modalDelete, setModalDelete] = useState<Modal>({
    showModal: false,
    passphrase: null
  });

  const setTitle = useTitle("Loading...");

  const { mutate: del_note, isLoading: is_deleting, isSuccess: is_deleted } = useMutation(delete_note, {
    onSuccess: ({ is_ok, data, error }) => {
      if (is_ok) {
        setPopups(prev => {
          return {
            ...prev,
            noteDeletion: data.id
          };
        });
      } else {
        setPopups(error);
      }
    }
  });

  const { mutate: mutate_get_note, isLoading, isSuccess } = useMutation(get_note, {
    onSuccess: result => {
      if (result.is_ok) {
        let data = result.data;

        const readableExpiryTime = data.expired_at
          ? new Date(data.expired_at.secs_since_epoch * 1000).toLocaleString(undefined, TIME_CONFIG)
          : "Never";

        const readableCreationTime = new Date(data.created_at.secs_since_epoch * 1000)
          .toLocaleString(undefined, TIME_CONFIG);

        const readableUpdateTime = new Date(data.updated_at.secs_since_epoch * 1000)
          .toLocaleString(undefined, TIME_CONFIG);

        setNote({
          id: data.id,
          title: data.title,
          content: data.content,
          is_already_decrypted: !data.frontend_encryption,
          passphrase: modalMutate.passphrase,
          lastUpdateTime: readableUpdateTime,
          expiryTime: readableExpiryTime,
          creationTime: readableCreationTime,
        });
        setTitle(data.title);
      } else {
        setTitle(generate_face());
        setPopups(result.error);

        if (result.error.wrongPassphrase) {
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
      setPopups(value => {
        return {
          ...value,
          serverError: true
        };
      })
    },
  });

  const { mutate: mutate_get_info, isLoading: is_info_loading } = useMutation(get_note_info, {
    onSuccess: result => {
      if (result.is_ok) {
        if (result.data.backend_encryption) {
          if (passphrase !== null) {
            mutate_get_note({ id: +id, passphrase });
          } else {
            console.log("ok, throw me some numbers");
            console.log("set title to \"ok, give me your password!\"");
            setTitle("ok, give me your password!");
            console.log("my password?\nOUT WITH IT\noralcumshot\nyeah that fits");

            setModalMutate(prev => {
              return {
                ...prev,
                showModal: true
              };
            });
          }
        } else {
          if (!result.data.frontend_encryption && passphrase !== null) {
            setPopups(prev => {
              return {
                ...prev,
                passphraseNotRequired: true
              };
            });
          }

          mutate_get_note({ id: +id, passphrase: null });
        }
      } else {
        setPopups(result.error)
      }
    },
    onError: () => {
      setTitle(generate_face());
      setPopups(value => {
        return {
          ...value,
          serverError: true
        };
      })
    },
  });

  const try_decrypt = useCallback((passphrase: string): void => {
    let content = cryptojs.AES.decrypt(note.content, passphrase).toString(cryptojs.enc.Utf8);
    if (content === "") {
      setPopups(prev => {
        return {
          ...prev,
          wrongPassphrase: true,
        };
      });
      setModalDecrypt({
        passphrase: null,
        showModal: true,
      });
    } else {
      setPopups(prev => {
        return {
          ...prev,
          wrongPassphrase: false,
        };
      });
      setModalDecrypt({
        passphrase: null,
        showModal: false,
      });
      setNote(prev => {
        return {
          ...prev,
          passphrase,
          is_already_decrypted: true,
          content
        };
      });
    }
  }, [note.content, setPopups]);

  useEffect(() => {
    mutate_get_info({ id: +id });
  }, [id, mutate_get_info]);

  useEffect(() => {
    if (modalMutate.passphrase !== null) {
      mutate_get_note({ id: +id, passphrase: modalMutate.passphrase });
    }
  }, [id, modalMutate.passphrase, mutate_get_note]);

  useEffect(() => {
    if (modalDecrypt.passphrase !== null) {
      try_decrypt(modalDecrypt.passphrase);
    }
  }, [modalDecrypt.passphrase, try_decrypt]);

  useEffect(() => {
    if (isSuccess && note.is_already_decrypted !== null && !note.is_already_decrypted) {
      if (passphrase) {
        try_decrypt(passphrase);
      } else {
        setModalDecrypt(prev => {
          return {
            ...prev,
            showModal: true
          };
        });
      }
    }
  }, [isSuccess, note.is_already_decrypted, passphrase, try_decrypt, setModalDecrypt]);

  useEffect(() => {
    if (modalDelete.passphrase) {
      if (modalDelete.passphrase === note.passphrase) {
        del_note({ id: +id, passphrase: note.passphrase });
      } else {
        setModalDelete({
          showModal: false,
          passphrase: null,
        });
        setPopups(prev => {
          return {
            ...prev,
            wrongPassphrase: true,
          }
        });
      }
    }
  }, [modalDelete.passphrase, note.passphrase, del_note, id, setPopups]);

  const handleRetry = () => {
    isSuccess
      ? setModalDecrypt(prev => {
        return {
          ...prev,
          showModal: true,
        };
      })
      : setModalMutate(prev => {
        return {
          ...prev,
          showModal: true
        }
      });
  };

  const handleDelete = () => {
    setModalDelete(prev => {
      return {
        ...prev,
        showModal: true
      };
    });
  };

  return (
    <Container fluid>

      <PassphraseModal
        show={modalDecrypt.showModal}
        setShow={(show) => setModalDecrypt(prev => {
          return { ...prev, showModal: show };
        })}
        setPassphrase={(passphrase) => setModalDecrypt(prev => {
          return { ...prev, passphrase: passphrase };
        })} />

      <PassphraseModal
        show={modalMutate.showModal}
        setShow={(show) => setModalMutate(prev => {
          return { ...prev, showModal: show };
        })}
        setPassphrase={(passphrase) => setModalMutate(prev => {
          return { ...prev, passphrase: passphrase };
        })} />

      <PassphraseModal
        title={`Confirm to delete "${note.title}"`}
        show={modalDelete.showModal}
        setShow={(show) => setModalDelete(prev => {
          return { ...prev, showModal: show };
        })}
        setPassphrase={(passphrase) => setModalDelete(prev => {
          return { ...prev, passphrase: passphrase };
        })} />

      <Row>
        <Col xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }}>
          <NoteResult data={note} isLoading={is_info_loading || isLoading} />
          <Stack direction="horizontal" gap={3}>
            <Button size="lg" className="ms-auto" variant="outline-danger" disabled={is_deleting || is_deleted} onClick={handleDelete}>
              <i className="bi bi-trash"></i>
            </Button>
            <Button
              size="lg"
              variant="outline-danger"
              disabled={note.is_already_decrypted === null ? false : note.is_already_decrypted}
              onClick={handleRetry}
            >
              Retry</Button>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default Note;
