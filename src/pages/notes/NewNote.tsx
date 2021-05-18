import { Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import LoginRegisterModal from "../../components/LoginRegisterModal";
import { StoreContext } from "../../utils/contexts";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required().max(100),
  description: yup.string().required().max(1500),
  password: yup.string().max(50)
});

const NewNote = () => {
  const { login: { username } } = useContext(StoreContext);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    username ? setShowModal(false) : setShowModal(true);
  }, [username]);

  return (
    <>
      <LoginRegisterModal show={showModal} />
      <Formik
        validationSchema={schema}
        onSubmit={val => {
          console.log(val);
        }}
        initialValues={{
          title: "",
          description: "",
          password: ""
        }}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form onSubmit={handleSubmit} className="New-note-form">
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter note's title here"
                value={values.title}
                onChange={handleChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                <small>
                  {errors.title}
                </small>
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                placeholder="Enter nii-chan's secret here, promise won't see"
                value={values.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-2">
              <Form.Label>Password</Form.Label>
              <OverlayTrigger
                placement="auto"
                // transition={false} strictmode compliant
                delay={{ show: 0, hide: 400 }}
                overlay={(
                  <Tooltip id="description-tooltip">
                    Remember not to lose this note's password, otherwise there is no way to decrpyt your note!
                  </Tooltip>
                )}
              >
                {({ ref, ...triggerHandler }) => (
                  <Form.Control
                    ref={ref}
                    {...triggerHandler}
                    type="password"
                    placeholder="Enter super secret password"
                    value={values.password}
                    onChange={handleChange}
                  />
                )}
              </OverlayTrigger>
            </Form.Group>
            <Button type="submit" className="mt-3">Submit</Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default NewNote;
