import { Formik } from "formik";
import { useContext, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip, Row, Col, Container, DropdownButton, Dropdown, InputGroup, Stack } from "react-bootstrap";
import * as yup from "yup";
import ModalOnSaveNote from "../../components/ModalOnSaveNote";
import { BaseUrl, timeConfig } from "../../utils/constants";
import cryptojs from "crypto-js";
import { StoreContext } from "../../utils/context";

const schema = yup.object().shape({
  title: yup.string().required().max(100),
  content: yup.string().required().max(5000),
  password: yup.string().max(50),
  duration: yup.number()
});

enum EncryptionMethod {
  NoEncryption,
  EndEncryption,
  ServerEncryption
}

const NewNote = () => {
  const { setAlerts } = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);
  const [noteResult, setNoteResult] = useState({
    id: 0,
    expiryTime: "uwu",
    password: "",
  });
  const [encryption, setEncryption] = useState<EncryptionMethod>(EncryptionMethod.ServerEncryption);
  const [isPasswordInvalid, setPasswordInvalid] = useState(false);

  const to_friendly = (seconds: number) => {
    const trail = (val: number) => (val > 1 ? "s " : " ");
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    return numdays + " day" + trail(numdays) + numhours + " hour" + trail(numhours) + numminutes + " minute" + trail(numminutes).trimEnd();
  };

  return (
    <Container fluid>
      <ModalOnSaveNote show={showModal} setShow={setShowModal} noteId={noteResult.id} expiryTime={noteResult.expiryTime} password={noteResult.password} />
      <Row>
        <Col xl={{ span: 4, offset: 4 }} xs={{ span: 10, offset: 1 }}>
          <Formik
            validationSchema={schema}
            onSubmit={async (val) => {
              let url = BaseUrl + "/notes";
              let converted_val;

              if (encryption === EncryptionMethod.ServerEncryption) {
                url += "/new";
                if (!val.password) {
                  setPasswordInvalid(true);
                  setAlerts(value => {
                    return {
                      ...value,
                      fieldError: ["password"],
                    };
                  });
                  return;
                }
                converted_val = {
                  title: val.title,
                  content: val.content,
                  password: val.password,
                  lifetime_in_secs: val.duration.toString()
                };
              } else {
                url += "/plain";

                if (encryption === EncryptionMethod.EndEncryption) {
                  let encrypted_title = cryptojs.AES.encrypt(val.title, val.password).toString();
                  let encrypted_content = cryptojs.AES.encrypt(val.content, val.password).toString();

                  converted_val = {
                    title: encrypted_title,
                    content: encrypted_content,
                    is_encrypted: "true",
                    lifetime_in_secs: val.duration.toString()
                  };
                } else {
                  converted_val = {
                    title: val.title,
                    content: val.content,
                    is_encrypted: "false",
                    lifetime_in_secs: val.duration.toString()
                  };
                }
              }

              try {
                const result = await fetch(url, {
                  method: "POST",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  body: new URLSearchParams(converted_val)
                });

                if (result.ok) {
                  interface Response {
                    expired_at: {
                      "nanos_since_epoch": number,
                      "secs_since_epoch": number
                    },
                    id: number
                  }
                  const data: Response = await result.json();
                  const date_from_epoch = new Date(data.expired_at.secs_since_epoch * 1000).toLocaleString(undefined, timeConfig);
                  const readableDateTime = date_from_epoch;
                  setNoteResult({
                    expiryTime: readableDateTime,
                    id: data.id,
                    password: val.password
                  });
                  setShowModal(true);
                }
              } catch (error) {
                setAlerts(value => {
                  return {
                    ...value,
                    serverError: true
                  };
                });
                console.log(error);
              }
            }}
            initialValues={{
              title: "",
              content: "",
              password: "",
              duration: 0
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              isSubmitting,
              values,
              errors,
              touched
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicTitle" className="mb-3 pb-2">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter note's title here"
                    className="text-center"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.title && !!errors.title}
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicDescription" className="mb-3 pb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="content"
                    placeholder="Enter note's description"
                    className="text-center"
                    rows={3}
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.content && !!errors.content}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-4">
                  <OverlayTrigger
                    placement="top"
                    show={encryption === EncryptionMethod.NoEncryption ? false : undefined}
                    // transition={false} //strictmode compliant
                    delay={{ show: 0, hide: 400 }}
                    overlay={(
                      <Tooltip id="description-tooltip">
                        {
                          encryption === EncryptionMethod.ServerEncryption
                            ? "Remember not to lose this note's password!"
                            : "Please, provide a strong password!"
                        }
                      </Tooltip>
                    )}
                  >
                    {({ ref, ...triggerHandler }) => (
                      <>
                        <Stack direction="horizontal" className="justify-content-center" gap={1}>
                          <Form.Label ref={ref}>Password</Form.Label>
                          <DropdownButton
                            size="sm"
                            variant="outline-secondary"
                            menuVariant="dark"
                            className="pb-2"
                            title=""
                            id="input-group-dropdown-1"
                          >
                            <Dropdown.Item onClick={() => setEncryption(EncryptionMethod.NoEncryption)} href="#">No Encryption</Dropdown.Item>
                            <Dropdown.Item onClick={() => setEncryption(EncryptionMethod.ServerEncryption)} href="#">Use Backend</Dropdown.Item>
                            <Dropdown.Item onClick={() => setEncryption(EncryptionMethod.EndEncryption)} href="#">Use Frontend (experimental)</Dropdown.Item>
                          </DropdownButton>
                        </Stack>
                        <InputGroup>
                          <Form.Control
                            {...triggerHandler}
                            type="password"
                            name="password"
                            placeholder="Enter super secret password"
                            className="text-center"
                            value={values.password}
                            onChange={(e) => {
                              setPasswordInvalid(false);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            disabled={encryption === EncryptionMethod.NoEncryption}
                            isInvalid={touched.password && (isPasswordInvalid || !!errors.password)}
                            autoComplete="new-password"
                          />
                        </InputGroup>
                      </>
                    )}
                  </OverlayTrigger>
                </Form.Group>

                <Form.Group controlId="formBasicDuration" className="mb-4">
                  <OverlayTrigger
                    placement="top"
                    show={encryption === EncryptionMethod.NoEncryption ? false : undefined}
                    // transition={false} //strictmode compliant
                    delay={{ show: 0, hide: 400 }}
                    overlay={(
                      <Tooltip id="description-tooltip">
                        Leave it as is to use standard duration.
                      </Tooltip>
                    )}
                  >
                    {({ ref, ...triggerHandler }) => (
                      <>
                        <Form.Label ref={ref}>Duration<br /> {to_friendly(values.duration)}</Form.Label>
                        <Form.Range {...triggerHandler} name="duration" min={0} max={2592000} onChange={handleChange} value={values.duration} step={60} />
                      </>
                    )}
                  </OverlayTrigger>
                </Form.Group>
                <Button size="lg" type="submit" disabled={isSubmitting}>Save</Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default NewNote;
