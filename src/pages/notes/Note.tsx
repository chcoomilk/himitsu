import { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Col, Container, Form, FormControl, InputGroup, Modal, Row, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import { BaseUrl } from "../../utils/constants";
import { StoreContext } from "../../utils/context";

interface NoteData {
  id: number;
  title: string;
  content: string;
  expiryTime: string;
  creationTime: string;
}

interface ErrorKind {
  notFound: boolean,
  wrongPassword: boolean,
  serverError: boolean
}

interface NoteProps {
  password: string | undefined
}

interface Params {
  id: string
}

const Note = ({ password }: NoteProps) => {
  const { theme } = useContext(StoreContext);
  const history = useHistory();
  const { id }: Params = useParams();
  isNaN(+id) && history.push("/find");

  const [note, setNote] = useState<NoteData>({
    id: +id,
    title: "",
    content: "",
    creationTime: "",
    expiryTime: ""
  });

  const [showAlert, setShowAlert] = useState<ErrorKind>({
    notFound: false,
    wrongPassword: false,
    serverError: false
  });

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordFromModal, setPasswordFromModal] = useState<string>("");

  const fetchData = useCallback(async (password: string) => {
    const url = BaseUrl + "/notes/get/" + id;
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ password })
      });

      if (response.ok) {
        interface ResponseData {
          "content": string,
          "created_at": {
            "nanos_since_epoch": number,
            "secs_since_epoch": number
          },
          "expired_at": {
            "nanos_since_epoch": number,
            "secs_since_epoch": number
          },
          "id": number,
          "title": string
        }

        const data: ResponseData = await response.json();
        const readableExpiryTime = new Date(data.expired_at.secs_since_epoch * 1000).toLocaleTimeString();
        const readableCreationTime = new Date(data.created_at.secs_since_epoch * 1000).toLocaleTimeString();
        setNote({
          id: data.id,
          title: data.title,
          content: data.content,
          expiryTime: readableExpiryTime,
          creationTime: readableCreationTime
        });
      } else {
        switch (response.status) {
          case 404:
            setShowAlert((previousValue) => {
              return { ...previousValue, notFound: true }
            });
            break;
          case 401:
            setShowAlert((previousValue) => {
              return { ...previousValue, wrongPassword: true }
            });
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    const the_one = password || localStorage.getItem("pswd") || "";
    localStorage.removeItem("pswd");
    fetchData(the_one);
  }, [fetchData, password]);

  return (
    <>
      <Alert
        variant="warning"
        show={showAlert.notFound} onClose={() => setShowAlert((previousValue) => {
          return { ...previousValue, notFound: false };
        })}
        dismissible
      >
        Note not found T_T, {' '}
        <Alert.Link onClick={() => history.push("/find")}>Try Again</Alert.Link>?
      </Alert>

      <Alert
        variant="danger"
        show={showAlert.wrongPassword} onClose={() => setShowAlert((previousValue) => {
          return { ...previousValue, wrongPassword: false };
        })}
        dismissible
      >
        Wrong password, {' '}
        <Alert.Link onClick={() => {
          setShowPasswordModal(true);
          setShowAlert((previousValue) => {
            return { ...previousValue, wrongPassword: false };
          });
        }}>Try Again</Alert.Link>?
      </Alert>

      <Container fluid>

        <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered className="modal">
          <Modal.Header closeButton>
            <Modal.Title>Input Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              This note is password protected!
            </p>
            <Form>
              <Form.Group as={Row} className="mb-3" controlId="formPassword">
                <Form.Label column sm="3">
                  Password:
                </Form.Label>
                <Col sm="9">
                  <InputGroup className="mb-3">
                    <FormControl
                      onChange={e => setPasswordFromModal(e.target.value)}
                      value={passwordFromModal}
                      aria-describedby="basic-addon2"
                      style={theme}
                    />
                  </InputGroup>
                </Col>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              fetchData(passwordFromModal);
              setShowAlert((previousValue) => {
                return { ...previousValue, wrongPassword: false };
              });
              setShowPasswordModal(false);
            }}>
              OK!
            </Button>
          </Modal.Footer>
        </Modal>

        <Row>
          <Col xl={{ span: 4, offset: 4 }} xs={{ span: 10, offset: 1 }}>
            <Form noValidate>
              <Form.Group controlId="formBasicTitle" className="mb-3 pb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  className="text-center"
                  value={note.title}
                  style={theme}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formBasicDescription" className="mb-3 pb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="content"
                  className="text-center"
                  rows={3}
                  value={note.content}
                  style={theme}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formBasicCreatedAt" className="mb-3 pb-2">
                <Form.Label>Created At</Form.Label>
                <Form.Control
                  type="text"
                  name="created"
                  className="text-center"
                  value={note.creationTime}
                  style={theme}
                  readOnly
                />
              </Form.Group>

              <Form.Group controlId="formBasicExpiresAt" className="mb-3 pb-2">
                <Form.Label>Expires At</Form.Label>
                <Form.Control
                  type="text"
                  name="expires"
                  className="text-center"
                  value={note.expiryTime}
                  style={theme}
                  readOnly
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
};

export default Note;