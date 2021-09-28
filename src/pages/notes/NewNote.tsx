import { Formik } from "formik";
import { useContext, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip, Row, Col, Container } from "react-bootstrap";
import * as yup from "yup";
import ModalOnSaveNote from "../../components/ModalOnSaveNote";
import { BaseUrl } from "../../utils/constants";
import { StoreContext } from "../../utils/context";

const schema = yup.object().shape({
  title: yup.string().required().max(100),
  content: yup.string().required().max(5000),
  password: yup.string().required().min(1).max(50)
});

const NewNote = () => {
  const { theme } = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState({
    id: 0,
    expiryTime: "uwu",
    password: "",
  });

  return (
    <Container fluid>
      <ModalOnSaveNote show={showModal} setShow={setShowModal} noteId={note.id} expiryTime={note.expiryTime} password={note.password} />
      <Row>
        <Col xl={{ span: 4, offset: 4 }} xs={{ span: 10, offset: 1 }}>
          <Formik
            validationSchema={schema}
            onSubmit={async (val) => {
              const url = BaseUrl + "/notes/new";
              try {
                const result = await fetch(url, {
                  method: "POST",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  body: new URLSearchParams(val)
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
                  const readableDateTime = new Date(data.expired_at.secs_since_epoch * 1000).toLocaleTimeString();
                  setNote({
                    expiryTime: readableDateTime,
                    id: data.id,
                    password: val.password
                  });
                  setShowModal(true);
                }
              } catch (error) {
                console.log(error);
              }
            }}
            initialValues={{
              title: "",
              content: "",
              password: ""
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
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
                    style={theme}
                    autoComplete="off"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicDescription" className="mb-3 pb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="content"
                    placeholder="Enter your secret here 🙈🙈"
                    className="text-center"
                    rows={3}
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.content && !!errors.content}
                    style={theme}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <OverlayTrigger
                    placement="auto"
                    // transition={false} //strictmode compliant
                    delay={{ show: 0, hide: 400 }}
                    overlay={(
                      <Tooltip id="description-tooltip">
                        Remember not to lose this note's password, otherwise there is no way to decrpyt your note!
                      </Tooltip>
                    )}
                  >
                    {({ ref, ...triggerHandler }) => (
                      <>
                        <Form.Control
                          ref={ref}
                          {...triggerHandler}
                          type="password"
                          name="password"
                          placeholder="Enter super secret password"
                          className="text-center"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && !!errors.password}
                          autoComplete="new-password"
                          style={theme}
                        />
                      </>
                    )}
                  </OverlayTrigger>
                </Form.Group>
                <Button size="lg" type="submit">Save</Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default NewNote;
