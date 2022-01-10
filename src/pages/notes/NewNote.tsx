import { Formik } from "formik";
import { useContext, useState } from "react";
import { Button, Form, Row, Col, Container, DropdownButton, Dropdown, InputGroup, FormControl, Stack } from "react-bootstrap";
import * as yup from "yup";
import NewNoteModal from "../../components/note/NewNoteModal";
import { StoreContext } from "../../utils/context";
import { EncryptionMethod } from "../../utils/types";
import { useMutation } from "react-query";
import { post_note } from "../../queries/post_note";
import useTitle from "../../custom-hooks/useTitle";

const BasicNoteSchema = {
  title: yup.string(),
  content: yup.string().required(),
  password: yup.string().required().min(4).max(1024),
  duration: yup.object().shape({
    day: yup.number().positive(),
    hour: yup.number().positive(),
    minute: yup.number().positive(),
    second: yup.number().moreThan(30)
  }),
};

const EncryptionSchema = yup.object().shape({
  ...BasicNoteSchema
});

const NoEncryptionSchema = yup.object().shape({
  ...BasicNoteSchema,
  password: yup.string(),
});

const NewNote = () => {
  const { setAlerts } = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);
  const [noteResult, setNoteResult] = useState({
    id: 0,
    expiryTime: "uwu",
    password: "",
  });
  useTitle("New note");
  const [encryption, setEncryption] = useState<EncryptionMethod>(EncryptionMethod.BackendEncryption);
  const { mutateAsync } = useMutation(post_note);

  return (
    <Container fluid>
      <NewNoteModal show={showModal} setShow={setShowModal} data={{ ...noteResult }} />
      <Row>
        <Col xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }}>
          <Formik
            validationSchema={encryption === EncryptionMethod.NoEncryption ? NoEncryptionSchema : EncryptionSchema}
            onSubmit={(val, { resetForm }) => {
              let duration_in_secs: number = +val.duration.second;
              if (val.duration.day) {
                duration_in_secs += +val.duration.day * 86400;
              }
              if (val.duration.hour) {
                duration_in_secs += +val.duration.hour * 3600;
              }
              if (val.duration.minute) {
                duration_in_secs += +val.duration.minute * 60;
              }

              mutateAsync({
                encryption: encryption,
                title: val.title,
                content: val.content,
                lifetime_in_secs: duration_in_secs,
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
                day: "",
                hour: "",
                minute: "",
                second: "",
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
                  <Form.Text muted>
                    {" "}(unencrypted)
                  </Form.Text>
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
                  <Form.Label>Secret</Form.Label>
                  <Form.Text muted>
                    {` (${!encryption ? "unencrypted" : "encrypted"})`}
                  </Form.Text>
                  <Form.Control
                    as="textarea"
                    name="content"
                    placeholder="Enter note here"
                    rows={3}
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.content && !!errors.content}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>{errors.content}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicDuration" className="mb-3">
                  <Form.Label>
                    Duration
                  </Form.Label>
                  <Form.Text muted>
                    {" "}(unencrypted)
                  </Form.Text>
                  <InputGroup>
                    <FormControl
                      aria-label="Day"
                      type="text"
                      name="duration.day"
                      placeholder="Days"
                      value={values.duration.day}
                      onChange={handleChange}
                      isInvalid={!!errors.duration?.day}
                    />
                    <FormControl.Feedback type="invalid" tooltip>{errors.duration?.day}</FormControl.Feedback>
                    <FormControl
                      aria-label="Hour"
                      type="text"
                      name="duration.hour"
                      placeholder="Hrs"
                      value={values.duration.hour}
                      onChange={handleChange}
                      isInvalid={!!errors.duration?.hour}
                    />
                    <FormControl.Feedback type="invalid" tooltip>{errors.duration?.hour}</FormControl.Feedback>
                    <FormControl
                      aria-label="Minute"
                      type="text"
                      name="duration.minute"
                      placeholder="Mins"
                      value={values.duration.minute}
                      onChange={handleChange}
                      isInvalid={!!errors.duration?.minute}
                    />
                    <FormControl.Feedback type="invalid" tooltip>{errors.duration?.minute}</FormControl.Feedback>
                    <FormControl
                      aria-label="Second"
                      type="text"
                      name="duration.second"
                      placeholder="Secs"
                      value={values.duration.second}
                      onChange={handleChange}
                      isInvalid={!!errors.duration?.second}
                    />
                    <FormControl.Feedback type="invalid" tooltip>{errors.duration?.second}</FormControl.Feedback>
                  </InputGroup>
                  <Form.Text muted>
                    Omit these fields to set it permanent
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="position-relative mb-5">
                  <Form.Label>Password</Form.Label>
                  <Form.Text muted>
                    {` (${EncryptionMethod[encryption].replace(/([a-z0-9])([A-Z])/g, '$1 $2')})`}
                  </Form.Text>
                  <InputGroup>
                    <Form.Control
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
                    <DropdownButton
                      size="sm"
                      variant="outline-secondary"
                      menuVariant="dark"
                      title=""
                      id="input-group-dropdown-1"
                    >
                      <Dropdown.Item
                        onClick={() => setEncryption(EncryptionMethod.BackendEncryption)}
                        href="#">
                        Use Backend
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setEncryption(EncryptionMethod.FrontendEncryption)}
                        href="#"
                      >
                        Use Frontend
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setEncryption(EncryptionMethod.NoEncryption)} href="#">No Encryption</Dropdown.Item>
                    </DropdownButton>
                    <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Stack direction="horizontal" gap={3}>
                  <Button className="ms-auto" size="lg" variant="outline-danger" onClick={handleReset} disabled={isSubmitting}>Reset</Button>
                  <Button size="lg" variant="success" type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving" : "Save"}</Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container >
  );
};

export default NewNote;
