import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Button, Form, Row, Col, DropdownButton, Dropdown, InputGroup, FormControl, Stack, Spinner, Modal } from "react-bootstrap";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";

import NewNoteModal from "../../components/note/NewNoteModal";
import AppContext from "../../utils/app_state_context";
import { EncryptionMethod, NoteInfo } from "../../utils/types";
import { post_note } from "../../queries";
import { useTitle } from "../../custom-hooks";
import { local_storage, unwrap } from "../../utils/functions";
import PassphraseInputGroup from "../../components/passphrase/PassphraseInputGroup";
import SimpleConfirmationModal from "../../components/SimpleConfirmationModal";

const BasicNoteSchema = {
  double_encrypt: yup.object().shape({
    enabled: yup.bool(),
    passphrase: yup.string().when("enabled", {
      is: true,
      then: yup.string().required("a passphrase is needed to encrypt your data")
        .min(4, "passphrase must be at least 4 characters")
        .max(1024)
    })
  }),
  discoverable: yup.bool(),
  custom_id: yup.string().max(32).min(1).nullable().trim(),
  title: yup.string().min(4).nullable().trim(),
  content: yup.string().required(),
  passphrase: yup.string()
    .required("a passphrase is needed to encrypt your data")
    .min(4, "passphrase must be at least 4 characters")
    .max(1024),
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

type UNoteInfo = NoteInfo & {
  passphrase?: string,
}

const NewNote = () => {
  const { appSettings } = useContext(AppContext);
  const [noteResult, setNoteResult] = useState<UNoteInfo | null>(null);
  const [encryption, setEncryption] = useState<EncryptionMethod>(appSettings.encryption);
  const [modal, setModal] = useState({
    delete: false,
    extra_settings: false,
  });
  useTitle("New Note");
  const { mutateAsync } = useMutation(post_note);
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      double_encrypt: {
        enabled: false,
        passphrase: ""
      },
      discoverable: false,
      custom_id: "",
      title: "",
      content: "",
      passphrase: "",
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
            passphrase: yup.string().nullable(),
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
        discoverable: encryption === EncryptionMethod.NoEncryption ? val.discoverable : undefined,
        custom_id: val.custom_id === "" ? undefined : val.custom_id,
        double_encrypt: val.double_encrypt.enabled && encryption === EncryptionMethod.BackendEncryption ? val.double_encrypt.passphrase : undefined,
        encryption: encryption,
        title: val.title === "" ? undefined : val.title,
        content: val.content,
        lifetime_in_secs: duration_in_secs === 0 ? undefined : duration_in_secs,
        passphrase: val.passphrase,
      })
        .then(result => {

          console.log(result);
          const { data, error } = result;
          if (!error) {
            setNoteResult({
              ...data,
              passphrase: val.passphrase || undefined,
            });
            local_storage.set("last_saved_note", data);
            if (appSettings.history) {
              let notes = local_storage.get("notes");
              if (notes) {
                notes.push(data);

                local_storage.set("notes", notes);
              } else {
                local_storage.set("notes", [data]);
              }

              let qk: [string | undefined] = [undefined];
              if (data.title) {
                let t: string = "";
                for (let char of data.title) {
                  t += char;
                  qk.push(char);
                  if (t.length > 1) qk.push(t);
                }
              }

              queryClient.refetchQueries(["local_notes"], { active: true, queryKey: qk });
            }

            resetForm({
              values: {
                ...formik.initialValues,
                double_encrypt: {
                  enabled: val.double_encrypt.enabled,
                  passphrase: formik.initialValues.double_encrypt.passphrase,
                },
                discoverable: val.discoverable,
              },
            });
          } else {
            unwrap.default(error);
          }
        })
        .catch((e) => {
          console.error("error occurred: ", e);
        }).finally(() => {
          setSubmitting(false);
        });
    }
  });

  let extra_settings_group = (
    <>
      <Form.Group controlId="formBasicEncryption" className="mb-4">
        <Form.Label>Encryption</Form.Label>
        <InputGroup>
          <DropdownButton
            variant="outline-light"
            menuVariant="dark"
            title={`${EncryptionMethod[encryption].replace(/([a-z0-9])([A-Z])/g, '$1 $2')}`}
            id="input-group-dropdown-1"
          >
            <Dropdown.Item
              onClick={() => setEncryption(EncryptionMethod.BackendEncryption)}
              href="#"
            >
              Use Backend
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setEncryption(EncryptionMethod.FrontendEncryption)}
              href="#"
            >
              Use Frontend
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => setEncryption(EncryptionMethod.NoEncryption)}
              href="#"
            >
              No Encryption
            </Dropdown.Item>
          </DropdownButton>
        </InputGroup>
      </Form.Group>
      {
        (() => {
          switch (encryption) {
            case EncryptionMethod.BackendEncryption:
              return (
                <>
                  <Form.Group controlId="formBasicDiscoverable" className="mb-4">
                    <Form.Label>EXTRA POWAH!!</Form.Label>
                    <InputGroup>
                      <Form.Switch
                        inline
                        id="fe-switch"
                        name="double_encrypt.enabled"
                        checked={formik.values.double_encrypt.enabled}
                        onChange={e => { formik.setTouched({ ...formik.touched, double_encrypt: { passphrase: false } }); formik.handleChange(e); }}
                        onBlur={formik.handleBlur}
                        label={"Frontend Encryption"}
                      />
                      <PassphraseInputGroup
                        hide={!formik.values.double_encrypt.enabled}
                        customLabel={null}
                        groupcName="mt-2"
                        aria-label="Passphrase"
                        name="double_encrypt.passphrase"
                        placeholder="Secondary passphrase"
                        value={formik.values.double_encrypt.passphrase}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.double_encrypt?.passphrase && !!formik.errors.double_encrypt?.passphrase}
                        errorMessage={formik.errors.double_encrypt?.passphrase}
                      />
                    </InputGroup>
                  </Form.Group>
                </>
              );

            case EncryptionMethod.FrontendEncryption:
              break;

            case EncryptionMethod.NoEncryption:
              return (
                <Form.Group controlId="formBasicDiscoverable" className="mb-4">
                  <Form.Label>Discoverability</Form.Label>
                  <InputGroup>
                    <Form.Switch
                      inline
                      id="public-switch"
                      name="discoverable"
                      disabled={encryption !== EncryptionMethod.NoEncryption}
                      checked={formik.values.discoverable}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label={"Note can" + (formik.values.discoverable ? "" : "'t") + " be found publicly"}
                    />
                  </InputGroup>
                </Form.Group>
              );
          }
        })()
      }
      <Form.Group>
        <Form.Text muted>
          <ul style={{ paddingLeft: "1rem" }}>
            <li>
              Title can always be seen upon request
            </li>
            <li>
              Passphrase for data encryption is not stored in database, as text nor hash
            </li>
            <li>
              Disabling discoverability will prevent any means of finding through its metadata such as title, creation time, etc.
            </li>
          </ul>
        </Form.Text>
      </Form.Group>
    </>
  );
  return (
    <>
      {
        noteResult && (
          <NewNoteModal data={{ ...noteResult }} onHide={() => {
            setNoteResult(null);
            local_storage.remove("last_saved_note");
          }} />
        )
      }
      <SimpleConfirmationModal
        title="Reset form"
        text="This will reset the form, continue?"
        show={modal.delete}
        onHide={() => setModal(p => ({ ...p, delete: false }))}
        doDecide={c => {
          if (c) formik.resetForm();
          setModal(p => ({ ...p, delete: false }))
        }}
        centered
      />
      <Modal centered show={modal.extra_settings} onHide={() => setModal(p => ({ ...p, extra_settings: false }))}>
        <Modal.Header closeButton closeVariant="white">
          Options
        </Modal.Header>
        <Modal.Body>
          {extra_settings_group}
        </Modal.Body>
      </Modal>
      <Form className="mb-3 mt-3" noValidate onSubmit={formik.handleSubmit}>
        <Row>
          <Col md="8" xs="12">
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
                autoFocus
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

            <Form.Group controlId="formBasicPassphrase" className="position-relative mb-4">
              <PassphraseInputGroup
                aria-label="Passphrase"
                name="passphrase"
                placeholder="Enter super secret passphrase"
                value={formik.values.passphrase}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={encryption === EncryptionMethod.NoEncryption}
                isInvalid={encryption !== EncryptionMethod.NoEncryption
                  ? (formik.touched.passphrase && !!formik.errors.passphrase)
                  : undefined
                }
                errorMessage={formik.errors.passphrase}
              />
            </Form.Group>

            <Form.Group controlId="formBasicId" className="position-relative mb-4">
              <Form.Label>Custom ID</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  aria-label="Custom ID"
                  type="text"
                  name="custom_id"
                  placeholder="Enter note's custom ID here"
                  value={formik.values.custom_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.custom_id && !!formik.errors.custom_id}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid" tooltip>{formik.errors.custom_id}</Form.Control.Feedback>
              </InputGroup>
              <Form.Text muted>
                * Omit this field to set a random ID
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicDuration" className="mb-4">
              <Form.Label>
                Duration
              </Form.Label>
              <InputGroup hasValidation>
                <FormControl
                  aria-label="Day"
                  type="text"
                  name="duration.day"
                  placeholder="Days"
                  value={formik.values.duration.day}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.duration?.day && !!formik.errors.duration?.day}
                  autoComplete="off"
                />
                <FormControl.Feedback type="invalid" tooltip>{formik.errors.duration?.day}</FormControl.Feedback>
                <FormControl
                  aria-label="Hour"
                  type="text"
                  name="duration.hour"
                  placeholder="Hrs"
                  value={formik.values.duration.hour}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.duration?.hour && !!formik.errors.duration?.hour}
                  autoComplete="off"
                />
                <FormControl.Feedback type="invalid" tooltip>{formik.errors.duration?.hour}</FormControl.Feedback>
                <FormControl
                  aria-label="Minute"
                  type="text"
                  name="duration.minute"
                  placeholder="Mins"
                  value={formik.values.duration.minute}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.duration?.minute && !!formik.errors.duration?.minute}
                  autoComplete="off"
                />
                <FormControl.Feedback type="invalid" tooltip>{formik.errors.duration?.minute}</FormControl.Feedback>
                <FormControl
                  aria-label="Second"
                  type="text"
                  name="duration.second"
                  placeholder="Secs"
                  value={formik.values.duration.second}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.duration?.second && !!formik.errors.duration?.second}
                  autoComplete="off"
                />
                <FormControl.Feedback type="invalid" tooltip>{formik.errors.duration?.second}</FormControl.Feedback>
              </InputGroup>
              <Form.Text muted>
                * Omit these fields to set it permanent
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md="4" xs="12">
            <div className="d-none d-md-block">
              {extra_settings_group}
            </div>
            <Row>
              <Col>
                <Stack className="mb-2" direction="vertical" gap={3}>
                  <Button className="w-100 d-block d-md-none" size="lg" variant="outline-secondary" onClick={() => setModal(p => ({ ...p, extra_settings: true }))} disabled={formik.isSubmitting}>Options</Button>
                  <Button className="w-100" size="lg" variant="outline-danger" onClick={() => setModal(p => ({ ...p, delete: true }))} disabled={formik.isSubmitting}>Reset</Button>
                  <Button className="w-100" size="lg" variant="success" type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? <Spinner size="sm" animation="border" /> : "Save"}</Button>
                </Stack>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default NewNote;
