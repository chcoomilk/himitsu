import { Formik } from "formik";
import { useContext, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip, Row, Col, Container, DropdownButton, Dropdown, InputGroup, Stack, FormControl } from "react-bootstrap";
import * as yup from "yup";
import ModalOnSaveNote from "../../components/ModalOnSaveNote";
import { BaseUrl, timeConfig } from "../../utils/constants";
import cryptojs from "crypto-js";
import { StoreContext } from "../../utils/context";

const EncryptionSchema = yup.object().shape({
  title: yup.string().required().max(100),
  content: yup.string().required().max(5000),
  password: yup.string().required().min(4).max(50),
  duration: yup.object().shape({
    day: yup.number().moreThan(-1).max(300),
    hour: yup.number().moreThan(-1).max(9999),
    minute: yup.number().moreThan(-1).max(9999),
  }),
});

const NoEncryptionSchema = yup.object().shape({
  title: yup.string().required().max(100),
  content: yup.string().required().max(5000),
  password: yup.string(),
  duration: yup.object().shape({
    day: yup.number().moreThan(-1).max(300),
    hour: yup.number().moreThan(-1).max(9999),
    minute: yup.number().moreThan(-1).max(9999),
  }),
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

  return (
    <Container fluid>
      <ModalOnSaveNote show={showModal} setShow={setShowModal} data={{ ...noteResult }} />
      <Row>
        <Col xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }}>
          <Formik
            validationSchema={encryption === EncryptionMethod.NoEncryption ? NoEncryptionSchema : EncryptionSchema}
            onSubmit={async (val, { resetForm }) => {
              let url = BaseUrl + "/notes";
              let converted_val;
              let duration_in_secs: number = 0;
              if (val.duration.day) {
                duration_in_secs += val.duration.day * 86400;
              }
              if (val.duration.hour) {
                duration_in_secs += val.duration.hour * 3600;
              }
              if (val.duration.minute) {
                duration_in_secs += val.duration.minute * 60;
              }

              if (encryption === EncryptionMethod.ServerEncryption) {
                url += "/new";
                converted_val = {
                  title: val.title,
                  content: val.content,
                  password: val.password,
                  lifetime_in_secs: duration_in_secs.toString()
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
                    lifetime_in_secs: duration_in_secs.toString()
                  };
                } else {
                  converted_val = {
                    title: val.title,
                    content: val.content,
                    is_encrypted: "false",
                    lifetime_in_secs: duration_in_secs.toString()
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
                  resetForm();
                }
              } catch (error) {
                setAlerts(value => {
                  return {
                    ...value,
                    serverError: true
                  };
                });
              }
            }}
            initialValues={{
              title: "",
              content: "",
              password: "",
              duration: {
                day: 0,
                hour: 0,
                minute: 0
              }
            }}
          >
            {({
              handleReset,
              handleSubmit,
              handleChange,
              handleBlur,
              isSubmitting,
              values,
              errors,
              touched
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicTitle" className="position-relative mb-5">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter note's title here"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.title && !!errors.title}
                    autoComplete="off"
                  />
                  <Form.Control.Feedback type="invalid" tooltip>{errors.title}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicDescription" className="position-relative mb-5">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="content"
                    placeholder="Enter note's description"
                    rows={3}
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.content && !!errors.content}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>{errors.content}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="position-relative mb-5">
                  <OverlayTrigger
                    placement="top"
                    show={encryption === EncryptionMethod.NoEncryption ? false : undefined}
                    // transition={false} //strictmode compliant
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
                        <Stack direction="horizontal" gap={2}>
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
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={encryption === EncryptionMethod.NoEncryption}
                            isInvalid={encryption !== EncryptionMethod.NoEncryption
                              ? (touched.password && !!errors.password)
                              : undefined
                            }
                            autoComplete="new-password"
                          />
                          <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
                        </InputGroup>
                      </>
                    )}
                  </OverlayTrigger>
                </Form.Group>

                <Form.Group controlId="formBasicDuration" className="mb-3">
                  <OverlayTrigger
                    placement="top"
                    show={encryption === EncryptionMethod.NoEncryption ? false : undefined}
                    // transition={false} //strictmode compliant
                    overlay={(
                      <Tooltip id="description-tooltip">
                        Leave it as is to use standard duration.
                      </Tooltip>
                    )}
                  >
                    {({ ref, ...triggerHandler }) => (
                      <>
                        <Form.Label ref={ref}>Duration</Form.Label>
                        <InputGroup className="mb-3" {...triggerHandler}>
                          <FormControl
                            aria-label="Day"
                            type="number"
                            name="duration.day"
                            placeholder="Max is 300"
                            value={values.duration.day}
                            onChange={handleChange}
                            isInvalid={!!errors.duration?.day}
                          />
                          <FormControl.Feedback type="invalid" tooltip>{errors.duration?.day}</FormControl.Feedback>
                          <InputGroup.Text>Days</InputGroup.Text>
                          <FormControl
                            aria-label="Hour"
                            type="number"
                            name="duration.hour"
                            placeholder="Max is 9999"
                            value={values.duration.hour}
                            onChange={handleChange}
                            isInvalid={!!errors.duration?.hour}
                          />
                          <FormControl.Feedback type="invalid" tooltip>{errors.duration?.hour}</FormControl.Feedback>
                          <InputGroup.Text>Hours</InputGroup.Text>
                          <FormControl
                            aria-label="Minute"
                            type="number"
                            name="duration.minute"
                            placeholder="Max is 9999"
                            value={values.duration.minute}
                            onChange={handleChange}
                            isInvalid={!!errors.duration?.minute}
                          />
                          <FormControl.Feedback type="invalid" tooltip>{errors.duration?.minute}</FormControl.Feedback>
                          <InputGroup.Text>Mins</InputGroup.Text>
                        </InputGroup>
                      </>
                    )}
                  </OverlayTrigger>
                </Form.Group>
                <div className="text-end">
                  <Button size="lg" variant="outline-danger" onClick={handleReset} disabled={isSubmitting}>Reset</Button>
                  {" "}
                  <Button size="lg" variant="success" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving" : "Save"}</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default NewNote;
