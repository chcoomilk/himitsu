import { useFormik } from "formik";
import { Button, Form, ListGroup, Stack } from "react-bootstrap";
// import PassphraseInputGroup from "../../../components/passphrase/PassphraseInputGroup";
import * as yup from "yup";
import SearchResult from "./TitleSearchResult";

const schema = yup.object().shape({
  title: yup.string(),
  passphrase: yup.string().min(4).max(1024).nullable()
});

type Props = {
  setToggleSearch: React.Dispatch<React.SetStateAction<boolean>>,
}

const FindByTitle = ({ setToggleSearch }: Props) => {
  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      title: "",
      passphrase: null,
    },
    onSubmit: async (val) => {
    },
  });

  return (
    <>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Form.Group controlId="formBasicTitle" className="position-relative mb-4">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter note's title here"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.title && !!formik.errors.title}
          />
          <Form.Control.Feedback type="invalid" tooltip>{formik.errors.title}</Form.Control.Feedback>
          {
            formik.values.title
              ? <SearchResult query={formik.values.title} />
              : (
                <ListGroup className="mt-3">
                  <ListGroup.Item variant="warning" className="text-center">...</ListGroup.Item>
                </ListGroup>
              )
          }
        </Form.Group>

        <Stack direction="horizontal" gap={3}>
          <Button variant="outline-warning" className="ms-auto" size="lg"
            onClick={() => setToggleSearch(prev => !prev)}>By ID
          </Button>
          <Button type="submit" variant="primary" size="lg">Find</Button>
        </Stack>
      </Form>
    </>
  );
};

export default FindByTitle;
