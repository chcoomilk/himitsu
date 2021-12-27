import { Formik } from "formik";
import { useContext, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip, Row, Col, Container, DropdownButton, Dropdown, InputGroup, Stack, FormControl } from "react-bootstrap";
import * as yup from "yup";
import ModalOnSaveNote from "../../components/ModalOnSaveNote";
import { StoreContext } from "../../utils/context";
import { EncryptionMethod } from "../../utils/types";
import { useMutation } from "react-query";
import { post_note } from "../../queries/post_note";
import useTitle from "../../custom-hooks/useTitle";

const EncryptionSchema = yup.object().shape({
  title: yup.string().max(100),
  content: yup.string().required().max(5000),
  password: yup.string().required().min(4).max(50),
  duration: yup.object().shape({
    day: yup.number().moreThan(-1).max(300),
    hour: yup.number().moreThan(-1).max(9999),
    minute: yup.number().moreThan(-1).max(9999),
  }),
});

const NoEncryptionSchema = yup.object().shape({
  title: yup.string().max(100),
  content: yup.string().required().max(5000),
  password: yup.string(),
  duration: yup.object().shape({
    day: yup.number().moreThan(-1).max(300),
    hour: yup.number().moreThan(-1).max(9999),
    minute: yup.number().moreThan(-1).max(9999),
  }),
});

const NewNote = () => {
  const { setAlerts } = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);
  const [noteResult, setNoteResult] = useState({
    id: "",
    expiryTime: "uwu",
    password: "",
  });
  useTitle("New note");
  const [encryption, setEncryption] = useState<EncryptionMethod>(EncryptionMethod.ServerEncryption);
  const { mutateAsync } = useMutation(post_note);

  return (
    <Container fluid>
      <ModalOnSaveNote show={showModal} setShow={setShowModal} data={{ ...noteResult }} />
      <Row>
        <Col xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }}>
          <Formik
            validationSchema={encryption === EncryptionMethod.NoEncryption ? NoEncryptionSchema : EncryptionSchema}
            onSubmit={(val, { resetForm }) => {
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

              mutateAsync({
                encryption: encryption,
                title: val.title,
                content: val.content,
                lifetime_in_secs: duration_in_secs.toString(),
                password: val.password
              }).then(result => {
                if (result && result.is_ok) {
                  let data = result.data;
                  setNoteResult({
                    expiryTime: data.expiryTime,
                    id: data.id,
                    password: val.password
                  });
                  setShowModal(true);
                  resetForm();
                } else {
                  setAlerts(result.error);
                }
              }).catch(() => {
                setAlerts(value => {
                  return {
                    ...value,
                    serverError: true
                  };
                });
              });
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
                        <Form.Label ref={ref}>
                          Duration
                        </Form.Label>
                        <InputGroup {...triggerHandler}>
                          <FormControl
                            aria-label="Day"
                            type="number"
                            name="duration.day"
                            placeholder="≤300"
                            value={values.duration.day || " "}
                            onChange={handleChange}
                            isInvalid={!!errors.duration?.day}
                          />
                          <FormControl.Feedback type="invalid" tooltip>{errors.duration?.day}</FormControl.Feedback>
                          <InputGroup.Text>D</InputGroup.Text>
                          <FormControl
                            aria-label="Hour"
                            type="number"
                            name="duration.hour"
                            placeholder="≤9999"
                            value={values.duration.hour || " "}
                            onChange={handleChange}
                            isInvalid={!!errors.duration?.hour}
                          />
                          <FormControl.Feedback type="invalid" tooltip>{errors.duration?.hour}</FormControl.Feedback>
                          <InputGroup.Text>H</InputGroup.Text>
                          <FormControl
                            aria-label="Minute"
                            type="number"
                            name="duration.minute"
                            placeholder="≤9999"
                            value={values.duration.minute || " "}
                            onChange={handleChange}
                            isInvalid={!!errors.duration?.minute}
                          />
                          <FormControl.Feedback type="invalid" tooltip>{errors.duration?.minute}</FormControl.Feedback>
                          <InputGroup.Text>M</InputGroup.Text>
                        </InputGroup>
                        <Form.Text className="text-muted smaller-font">
                          D as in day, H for hour, and S for second
                        </Form.Text>
                      </>
                    )}
                  </OverlayTrigger>
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
                            variant="outline-secondary align-middle"
                            menuVariant="dark"
                            className="pb-2"
                            title={EncryptionMethod[encryption].replace(/([a-z0-9])([A-Z])/g, '$1 $2')}
                            id="input-group-dropdown-1"
                          >
                            <Dropdown.Item onClick={() => setEncryption(EncryptionMethod.ServerEncryption)} href="#">Use Backend</Dropdown.Item>
                            <Dropdown.Item onClick={() => setEncryption(EncryptionMethod.EndToEndEncryption)} href="#">Use Frontend (experimental)</Dropdown.Item>
                            <Dropdown.Item onClick={() => setEncryption(EncryptionMethod.NoEncryption)} href="#">No Encryption</Dropdown.Item>
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
    </Container >
  );
};

export default NewNote;
