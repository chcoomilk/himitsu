import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Button, Form, Row, Col, DropdownButton, Dropdown, InputGroup, FormControl, Stack } from "react-bootstrap";
import * as yup from "yup";
import { useMutation } from "react-query";
import * as changeCase from "change-case";

import NewNoteModal from "../../components/note/NewNoteModal";
import { StoreContext } from "../../utils/context";
import { EncryptionMethod } from "../../utils/types";
import { post_note } from "../../queries/post_note";
import useTitle from "../../custom-hooks/useTitle";
import { DefaultValue } from "../../utils/constants";

const BasicNoteSchema = {
  title: yup.string(),
  content: yup.string().required(),
  passphrase: yup.object().shape({
    value: yup.string()
      .min(4, "passphrase must be at least 4 characters")
      .max(1024, "passphrase must be at least 1024 characters")
      .required("a passphrase is needed to encrypt your data"),
    visible: yup.boolean().required(),
  }),
  duration: yup.object().shape({
    day: yup.number().positive(),
    hour: yup.number().positive(),
    minute: yup.number().positive(),
    second: yup.number()
      .when(["day", "hour", "minute"], {
        is: (d: number, h: number, m: number) => !(d || h || m),
        then: yup
          .number()
          .min(30, "Duration must be greater or equals to 30 seconds"),
      })
  }),
};

const NewNote = () => {
  const { setPopups: setAlerts } = useContext(StoreContext);
  const [noteResult, setNoteResult] = useState({
    id: 0,
    expiryTime: "uwu",
    passphrase: "",
    fetched: false,
  });
  const [encryption, setEncryption] = useState<EncryptionMethod>(EncryptionMethod.BackendEncryption);
  useTitle(changeCase.capitalCase(DefaultValue.Pages.NewNote.NAME));
  const { mutateAsync } = useMutation(post_note);

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      passphrase: {
        value: "",
        visible: false,
      },
      duration: {
        day: "",
        hour: "",
        minute: "",
        second: "",
      }
    },

    validationSchema: () => {
      switch (encryption) {
        case EncryptionMethod.BackendEncryption:
          const BackendSchema = yup.object().shape({
            ...BasicNoteSchema
          });
          return BackendSchema;
        case EncryptionMethod.FrontendEncryption:
          const FrontendSchema = yup.object().shape({
            ...BasicNoteSchema
          });
          return FrontendSchema;
        case EncryptionMethod.NoEncryption:
          const NoEncryptionSchema = yup.object().shape({
            ...BasicNoteSchema,
            passphrase: yup.object().shape({
              value: yup.string(),
              visible: yup.boolean().required(),
            })
          });
          return NoEncryptionSchema;
      }
    },

    onSubmit: (val, { resetForm, setSubmitting }) => {
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
        passphrase: val.passphrase.value
      })
        .then(result => {
          if (result && result.is_ok) {
            let data = result.data;
            const res = {
              expiryTime: data.expiryTime,
              id: data.id,
              passphrase: val.passphrase.value,
              fetched: true,
            };
            setNoteResult(res);
            window.localStorage.setItem(DefaultValue.Pages.NewNote.RESULT_STATE_NAME, JSON.stringify(res));
            resetForm();
          } else {
            setAlerts(result.error);
          }
        })
        .catch(() => {
          setAlerts(value => {
            return {
              ...value,
              serverError: true
            };
          });
        }).finally(() => {
          setSubmitting(false);
        });
    }
  });

  return (
    <Row className="mb-3">
      <NewNoteModal
        control={{
          show: noteResult.fetched,
          setShow: (show) => setNoteResult(prev => {
            return {
              ...prev,
              fetched: show,
            };
          })
        }}
        data={{ ...noteResult }} />
      <Row>
        <Col xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formBasicTitle" className="position-relative mb-4">
              <Form.Label>Title</Form.Label>
              <Form.Text muted>
                {" "}(unencrypted)
              </Form.Text>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter note's title here"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.title && !!formik.errors.title}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid" tooltip>{formik.errors.title}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicDescription" className="position-relative mb-4">
              <Form.Label>Secret</Form.Label>
              <Form.Text muted>
                {` (${!encryption ? "unencrypted" : "encrypted"})`}
              </Form.Text>
              <Form.Control
                as="textarea"
                name="content"
                placeholder="Enter note here"
                rows={3}
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.content && !!formik.errors.content}
              />
              <Form.Control.Feedback type="invalid" tooltip>{formik.errors.content}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicDuration" className="mb-4">
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
                  value={formik.values.duration.day}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.duration?.day && !!formik.errors.duration?.day}
                />
                <FormControl.Feedback type="invalid" tooltip>{formik.errors.duration?.day}</FormControl.Feedback>
                <FormControl
                  aria-label="Hour"
                  type="text"
                  name="duration.hour"
                  placeholder="Hrs"
                  value={formik.values.duration.hour}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.duration?.hour && !!formik.errors.duration?.hour}
                />
                <FormControl.Feedback type="invalid" tooltip>{formik.errors.duration?.hour}</FormControl.Feedback>
                <FormControl
                  aria-label="Minute"
                  type="text"
                  name="duration.minute"
                  placeholder="Mins"
                  value={formik.values.duration.minute}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.duration?.minute && !!formik.errors.duration?.minute}
                />
                <FormControl.Feedback type="invalid" tooltip>{formik.errors.duration?.minute}</FormControl.Feedback>
                <FormControl
                  aria-label="Second"
                  type="text"
                  name="duration.second"
                  placeholder="Secs"
                  value={formik.values.duration.second}
                  onChange={formik.handleChange}
                  isInvalid={formik.touched.duration?.second && !!formik.errors.duration?.second}
                />
                <FormControl.Feedback type="invalid" tooltip>{formik.errors.duration?.second}</FormControl.Feedback>
              </InputGroup>
              <Form.Text muted>
                Omit these duration fields to set it permanent
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassphrase" className="position-relative mb-4">
              <Form.Label>Passphrase</Form.Label>
              <Form.Text muted>
                {` (${EncryptionMethod[encryption].replace(/([a-z0-9])([A-Z])/g, '$1 $2')})`}
              </Form.Text>
              <InputGroup>
                <Form.Control
                  aria-label="Passphrase"
                  name="passphrase.value"
                  type={formik.values.passphrase.visible ? "text" : "password"}
                  placeholder="Enter super secret passphrase"
                  value={formik.values.passphrase.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={encryption === EncryptionMethod.NoEncryption}
                  isInvalid={encryption !== EncryptionMethod.NoEncryption
                    ? (formik.touched.passphrase?.value && !!formik.errors.passphrase?.value)
                    : undefined
                  }
                  autoComplete="new-passphrase"
                />
                <Button
                  size="sm"
                  variant="outline-light"
                  onClick={() => formik.setFieldValue("passphrase.visible", !formik.values.passphrase.visible)}
                >
                  {
                    formik.values.passphrase.visible ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />
                  }
                </Button>
                <DropdownButton
                  size="sm"
                  variant="outline-light"
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
                <Form.Control.Feedback type="invalid" tooltip>{formik.errors.passphrase?.value}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Stack className="mb-2" direction="horizontal" gap={3}>
              <Button className="ms-auto" size="lg" variant="outline-danger" onClick={formik.handleReset} disabled={formik.isSubmitting}>Reset</Button>
              <Button size="lg" variant="success" type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? "Saving" : "Save"}</Button>
            </Stack>
          </Form>
        </Col>
      </Row>
    </Row>
  );
};

export default NewNote;
