import { useFormik } from "formik";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, Collapse, Form, FormGroup, InputGroup, Modal, OverlayTrigger, Spinner, Stack, Tooltip } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import CopyButton from "../../components/button/CopyButton";
import { validate_token, combine_token } from "../../queries";
import { PATHS } from "../../utils/constants";
import { into_readable_datetime, local_storage } from "../../utils/functions";
import { JWTToken } from "../../utils/types";
import * as yup from "yup";
import unwrap_default from "../../utils/functions/unwrap";

type ReplaceAccessToken = {
  active: boolean,
  value: string,
  loading: boolean,
  error?: string,
  success: boolean,
}

type ViewToken = {
  modal: boolean,
  tokenOf?: string,
  content?: JWTToken,
}

type CombineModal = {
  show: boolean,
  availableToSubmit: boolean,
  result?: string,
}

const CombineSchema = yup.object().shape({
  firstToken: yup.string().required(),
  secondToken: yup.string().required(),
});

const TokenSetting = () => {
  const [showHelp, setShowHelp] = useState(true);
  const [currentToken, setCurrentToken] = useState<string>(local_storage.get("token") || "");
  const [replaceAccessToken, setReplaceAccessToken] = useState<ReplaceAccessToken>({
    active: false,
    value: "",
    loading: false,
    success: false,
  });
  const [viewToken, setViewToken] = useState<ViewToken>({
    modal: false,
  });
  const [combineToken, setCombineToken] = useState<CombineModal>({
    show: false,
    availableToSubmit: true,
  });

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (!combineToken.availableToSubmit) {
      t = setTimeout(() => {
        setCombineToken(p => ({
          ...p,
          availableToSubmit: true
        }));
      }, 5000);
    }
    return () => clearTimeout(t);
  }, [combineToken.availableToSubmit]);

  const combineTokenFormik = useFormik({
    initialValues: {
      firstToken: "",
      secondToken: "",
    },
    validationSchema: CombineSchema,
    onSubmit: async (val) => {
      if (val.firstToken === val.secondToken) {
        toast.error("Two of the same token!");
        return;
      }

      let res = await combine_token(val.firstToken, val.secondToken);
      if (!res.error) {
        setCombineToken(p => ({
          ...p,
          result: res.data.token,
        }));
      } else {
        if (res.error === "tooManyRequests") {
          setCombineToken(p => ({
            ...p,
            availableToSubmit: false,
          }));
        }
        unwrap_default(res.error);
      }
    }
  });

  const toastInvalidJWT = () => toast.error("Invalid JWT token");

  const handleReplace = async () => {
    setReplaceAccessToken(p => ({ ...p, loading: true, error: undefined }));
    if (replaceAccessToken.value) {
      if (replaceAccessToken.value === currentToken) {
        setReplaceAccessToken(p => ({ ...p, loading: false, error: "Token can not be the same as the previous one", abc: "" }));
        return;
      }

      try {
        jwtDecode(replaceAccessToken.value);
        let result = await validate_token(replaceAccessToken.value);
        if (result.data) {
          setCurrentToken(replaceAccessToken.value);
          local_storage.set("token", replaceAccessToken.value);
          setReplaceAccessToken(p => ({ ...p, loading: false, success: true, value: "" }));
        } else {
          setReplaceAccessToken(p => ({ ...p, loading: false }));
          setReplaceAccessToken(p => ({ ...p, error: "Replacement unsuccessful, invalid token", loading: false }));
        }
      } catch {
        toastInvalidJWT();
        setReplaceAccessToken(p => ({ ...p, error: "Token is not a JWT token", loading: false }));
      }
    } else {
      setReplaceAccessToken(p => ({ ...p, error: "Provide a token here", loading: false }));
    }
  };

  const handleView = () => {
    if (viewToken.tokenOf === currentToken) {
      setViewToken(p => ({ ...p, modal: true }));
    } else {
      try {
        let data = jwtDecode<JWTToken>(currentToken);
        setViewToken(p => ({
          ...p,
          modal: true,
          content: data,
          tokenOf: currentToken,
        }));
      } catch {
        toastInvalidJWT();
      }
    }
  };

  return (
    <>
      <Modal centered show={viewToken.modal} onHide={() => setViewToken(p => ({ ...p, modal: false }))}>
        <Modal.Header closeButton closeVariant="white">
          Access Token
        </Modal.Header>
        <Modal.Body>
          Below, you can see which notes you have access to modify
          <ul style={{ paddingLeft: "1.5rem", paddingRight: "1rem" }}>
            {viewToken.content?.ids.map(n => (
              <li key={n[0].toString()}>
                <Link to={PATHS.note_detail + "/" + encodeURIComponent(n[0].toString())}>
                  {n[0].toString()}
                </Link>
                {" / "}
                {into_readable_datetime(n[1].secs_since_epoch)}
              </li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>

      <Modal centered show={combineToken.show} onHide={() => setCombineToken(p => ({ ...p, show: false }))}>
        <Form noValidate onSubmit={combineTokenFormik.handleSubmit}>
          <Modal.Header closeButton closeVariant="white">
            Combine tokens
          </Modal.Header>
          <Modal.Body className="px-3 py-0 my-3">
            <FormGroup>
              <Form.Label>First Token</Form.Label>
              <InputGroup hasValidation className="mb-3">
                <Form.Control
                  name="firstToken"
                  value={combineTokenFormik.values.firstToken}
                  onChange={combineTokenFormik.handleChange}
                  onBlur={combineTokenFormik.handleBlur}
                  isInvalid={combineTokenFormik.touched.firstToken && !!combineTokenFormik.errors.firstToken}
                  style={{ zIndex: !!combineTokenFormik.errors.firstToken ? 3 : 2, }}
                />
                <Button
                  variant="outline-light"
                  title="Paste your current token"
                  onClick={() => combineTokenFormik.setValues(
                    p => ({ ...p, firstToken: currentToken })
                  )}
                >
                  <i className="bi bi-pencil-square" />
                </Button>
                <Form.Control.Feedback type="invalid" tooltip>{combineTokenFormik.errors.firstToken}</Form.Control.Feedback>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Form.Label>Second Token</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  name="secondToken"
                  value={combineTokenFormik.values.secondToken}
                  onChange={combineTokenFormik.handleChange}
                  onBlur={combineTokenFormik.handleBlur}
                  isInvalid={combineTokenFormik.touched.secondToken && !!combineTokenFormik.errors.secondToken}
                />
                <Form.Control.Feedback type="invalid" tooltip>{combineTokenFormik.errors.secondToken}</Form.Control.Feedback>
              </InputGroup>
            </FormGroup>

            <FormGroup className="mt-3">
              <Form.Label>Result</Form.Label>
              <InputGroup>
                <Form.Control
                  readOnly
                  value={combineToken.result}
                />
                <CopyButton copy_value={combineToken.result || ""} />
              </InputGroup>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-danger" onClick={() => {
              setCombineToken(p => ({ ...p, show: false }));
              combineTokenFormik.setErrors({});
            }}>Cancel</Button>
            <Button type="submit" disabled={!combineToken.availableToSubmit || combineTokenFormik.isSubmitting} variant="success">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <OverlayTrigger placement="bottom-end" overlay={(p) => (
        <Tooltip id="accessTokenTooltipInfo" {...p} hidden={!showHelp}>
          This is your access token used for granting access
          to update/delete the notes you've created
        </Tooltip>
      )}>
        {({ ref, ...t }) => (
          <InputGroup {...t}>
            <Form.Control
              value={currentToken}
              readOnly
              isValid={replaceAccessToken.success}
            />
            <Button
              size="sm"
              variant="outline-light"
              disabled={replaceAccessToken.loading}
              onClick={() => setReplaceAccessToken(p => ({ ...p, active: !p.active }))}
            ><i className={replaceAccessToken.active ? "bi bi-layers" : "bi bi-layers-half"} /></Button>
            <CopyButton size="sm" copy_value={currentToken} />
            <Button size="sm" variant="outline-light" ref={ref} onClick={() => setShowHelp(!showHelp)}><i className="bi bi-question-lg" /></Button>
          </InputGroup>
        )}
      </OverlayTrigger>
      <Collapse in={replaceAccessToken.active}>
        <InputGroup hasValidation className="mt-2">
          <Form.Control
            value={replaceAccessToken.value}
            onChange={e => setReplaceAccessToken(p => ({ ...p, value: e.target.value, error: undefined, success: false }))}
            placeholder="Replace token..."
            disabled={replaceAccessToken.loading}
            isInvalid={!!replaceAccessToken.error}
            isValid={replaceAccessToken.success}
            style={{ zIndex: !!replaceAccessToken.error ? 3 : 2, }}
          />
          <Button
            variant={replaceAccessToken.loading ? "success" : "outline-success"}
            disabled={replaceAccessToken.loading}
            onClick={handleReplace}
          >
            {
              replaceAccessToken.loading
                ? <Spinner size="sm" animation="border" />
                : <i className="bi bi-check-lg" />
            }
          </Button>
          <Form.Control.Feedback type="invalid" tooltip>{replaceAccessToken.error}</Form.Control.Feedback>
          <Form.Control.Feedback type="valid" tooltip>Token successfully replaced!</Form.Control.Feedback>
        </InputGroup>
      </Collapse>
      <Stack className="mt-2" direction="horizontal" gap={2}>
        <Button
          size="sm"
          variant="primary"
          onClick={handleView}
        >View</Button>
        <Button
          size="sm"
          variant="success"
          onClick={() => setCombineToken(p => ({ ...p, show: true }))}
        >Combine</Button>
      </Stack>
    </>
  );
};

export default TokenSetting;
