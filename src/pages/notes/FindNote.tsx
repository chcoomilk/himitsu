import { Formik } from "formik";
import { Button, Form } from "react-bootstrap"
import * as yup from "yup";

const schema = yup.object().shape({
  ID: yup.number().required(),
  password: yup.string()  
});

const FindNote = () => {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={val => {

      }}
      initialValues={{
        ID: 0,
        password: ""
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors
      }) => (
        <Form noValidate onSubmit={handleSubmit} className="Find-note-form">
          <Form.Group controlId="formBasicId">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              name="ID"
              placeholder="Enter note's ID here"
              value={values.ID}
              onChange={handleChange}
              isInvalid={!!errors.ID}
            />
            <Form.Control.Feedback type="invalid">
              {errors.ID}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter super secret password"
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" className="mt-3">Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default FindNote;
