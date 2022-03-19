import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useMutation } from "react-query";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import cryptojs from "crypto-js";

import PassphraseModal from "../../components/passphrase/PassphraseModal";
import useTitle from "../../custom-hooks/useTitle";
import { get_note } from "../../queries/get_note";
import { DefaultValue, PATHS } from "../../utils/constants";
import { StoreContext } from "../../utils/context";
import { EncryptionMethod, NoteType } from "../../utils/types";
import { get_note_info } from "../../queries/get_note_info";
import { delete_note } from "../../queries";
import { generate_face, into_readable_datetime } from "../../utils/functions";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface Modal {
  showModal: boolean,
  passphrase: string | null,
}

const NotePage = () => {
  let { _id } = useParams();
  let navigate = useNavigate();
  const [checkedId, setCheckedId] = useState<number>(0);

  const { passphrase: passphrase_context, setPopups } = useContext(StoreContext);

  const [note, setNote] = useState<NoteType | null>(null);
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
  // const [overallHasStoppedFetching, setOverallHasStoppedFetching] = useState(true);

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

        let readableExpiryTime = data.expired_at
          ? into_readable_datetime(data.expired_at.secs_since_epoch)
          : "Never";

        let readableCreationTime = into_readable_datetime(data.created_at.secs_since_epoch);

        let readableUpdateTime = into_readable_datetime(data.updated_at.secs_since_epoch);

        let encryption: EncryptionMethod;
        if (result.data.backend_encryption) encryption = EncryptionMethod.BackendEncryption;
        else if (result.data.frontend_encryption) encryption = EncryptionMethod.FrontendEncryption;
        else encryption = EncryptionMethod.NoEncryption;

        setNote({
          id: data.id,
          title: data.title,
          content: data.content,
          already_decrypted: !data.frontend_encryption,
          encryption,
          passphrase: passphrase_context || modalMutate.passphrase,
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
        let encryption: EncryptionMethod;
        if (result.data.backend_encryption) encryption = EncryptionMethod.BackendEncryption;
        else if (result.data.frontend_encryption) encryption = EncryptionMethod.FrontendEncryption;
        else encryption = EncryptionMethod.NoEncryption;

        setNote({
          ...DefaultValue.Note,
          encryption,
          title: result.data.title,
          content: generate_face(),
        });

        if (result.data.backend_encryption) {
          if (passphrase_context !== null) {
            mutate_get_note({ id: result.data.id, passphrase: passphrase_context });
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
          if (!result.data.frontend_encryption && passphrase_context !== null) {
            setPopups(prev => {
              return {
                ...prev,
                passphraseNotRequired: true
              };
            });
          }

          mutate_get_note({ id: result.data.id, passphrase: null });
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

  const try_decrypt = useCallback((note: NoteType, passphrase: string): void => {
    let content = cryptojs.AES.decrypt(note.content, passphrase).toString(cryptojs.enc.Utf8);
    if (content) {
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
      setNote({
        ...note,
        passphrase,
        already_decrypted: true,
        content
      });
    } else {
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
    }
  }, [setPopups]);

  // check _id whence useParameter is availabe
  useEffect(() => {
    if (typeof _id === "undefined" || isNaN(+_id)) {
      setPopups(prev => {
        return {
          ...prev,
          invalidId: true
        };
      });
      navigate(PATHS.find_note);
    } else {
      setCheckedId(+_id);
      mutate_get_info({ id: +_id });
    }
  }, [_id, navigate, setPopups, mutate_get_info]);

  // try to decrypt note on backend
  useEffect(() => {
    if (modalMutate.passphrase !== null) {
      mutate_get_note({ id: checkedId, passphrase: modalMutate.passphrase });
    }
  }, [checkedId, modalMutate.passphrase, mutate_get_note]);

  // try to decrypt note on frontend
  useEffect(() => {
    if (modalDecrypt.passphrase !== null && note) {
      try_decrypt(note, modalDecrypt.passphrase);
    }
  }, [note, modalDecrypt.passphrase, try_decrypt]);

  // check if frontend decryption succeed or not
  useEffect(() => {
    if (isSuccess && note && note.encryption === EncryptionMethod.FrontendEncryption && !note.already_decrypted) {
      if (passphrase_context) {
        try_decrypt(note, passphrase_context);
      } else {
        setModalDecrypt(prev => {
          return {
            ...prev,
            showModal: true
          };
        });
      }
    }
  }, [isSuccess, note, passphrase_context, try_decrypt, setModalDecrypt]);

  // delete confirmation 
  useEffect(() => {
    if (modalDelete.passphrase && note) {
      if (modalDelete.passphrase === note.passphrase) {
        del_note({ id: checkedId, passphrase: note.passphrase });
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
  }, [modalDelete.passphrase, note, del_note, checkedId, setPopups]);

  const handleRetry = () => {
    if (note?.encryption === EncryptionMethod.BackendEncryption) {
      setModalMutate(prev => {
        return {
          ...prev,
          showModal: true
        }
      });
    } else {
      setModalDecrypt(prev => {
        return {
          ...prev,
          showModal: true,
        };
      });
    }
  };

  const handleDelete = () => {
    (isSuccess && note) && note.encryption === EncryptionMethod.NoEncryption
      ? del_note({ id: checkedId, passphrase: null })
      : setModalDelete(prev => {
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
        setPassphrase={(passphrase) => setModalDecrypt({
          passphrase,
          showModal: false,
        })} />

      <PassphraseModal
        show={modalMutate.showModal}
        setShow={(show) => setModalMutate(prev => {
          return { ...prev, showModal: show };
        })}
        setPassphrase={(passphrase) => {
          setModalMutate({
            passphrase,
            showModal: false,
          })
        }} />

      <PassphraseModal
        title={`Confirm to delete ${note?.title ? `"${note.title}"` : `note #${_id}`}`}
        show={modalDelete.showModal}
        setShow={(show) => setModalDelete(prev => {
          return { ...prev, showModal: show };
        })}
        setPassphrase={(passphrase) => setModalDelete({
          passphrase,
          showModal: false,
        })} />

      <Row>
        <Col xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }}>
          <Form noValidate>
            <SkeletonTheme duration={1.5} baseColor="#24282e" highlightColor="#a8a8a8">

              <Form.Group controlId="formBasicTitle" className="mb-4">
                <Form.Label>Title</Form.Label>
                {
                  is_info_loading
                    ? <Skeleton height={35} />
                    : <Form.Control
                      type="text"
                      name="expires"
                      value={note?.title}
                      readOnly
                    />
                }
              </Form.Group>

              <Form.Group controlId="formBasicDescription" className="mb-4">
                <Form.Label>Description</Form.Label>
                {
                  is_info_loading || isLoading
                    ? <Skeleton height={100} />
                    : <Form.Control
                      as="textarea"
                      type="text"
                      name="expires"
                      value={note?.content}
                      readOnly
                    />
                }
              </Form.Group>

              <Form.Group controlId="formBasicCreatedAt" className="mb-4">
                <Form.Label>Created at</Form.Label>
                {
                  is_info_loading || isLoading
                    ? <Skeleton height={35} />
                    : <Form.Control
                      type="text"
                      name="expires"
                      value={note?.creationTime}
                      readOnly
                    />
                }
              </Form.Group>

              <Form.Group controlId="formBasicExpiresAt" className="mb-4">
                <Form.Label>Expires at</Form.Label>
                {
                  is_info_loading || isLoading
                    ? <Skeleton height={35} />
                    : <Form.Control
                      type="text"
                      name="expires"
                      value={note?.expiryTime}
                      readOnly
                    />
                }
              </Form.Group>
            </SkeletonTheme>
            <Stack direction="horizontal" gap={3}>
              <Button
                size="lg"
                className="ms-auto"
                variant="danger"
                disabled={
                  (isLoading) ||
                  (note === null ? true : !note.already_decrypted) ||
                  (is_deleting || is_deleted)
                }
                onClick={handleDelete}>
                <i className="bi bi-trash"></i>
              </Button>
              <Button
                size="lg"
                variant="outline-warning"
                disabled={
                  (isLoading) ||
                  (note === null ? true : note.already_decrypted)
                }
                onClick={handleRetry}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </Button>
            </Stack>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NotePage;
