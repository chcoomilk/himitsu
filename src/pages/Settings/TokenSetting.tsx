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
import unwrap_default from "../../utils/functions/unwrap";
import { useForm } from "react-hook-form";

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

type CombineTokenFields = {
  firstToken: string,
  secondToken: string,
}

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

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (replaceAccessToken.success) {
      t = setTimeout(() => {
        setReplaceAccessToken(p => ({
          ...p,
          success: false,
        }));
      }, 3000);
    }
    return () => clearTimeout(t);
  }, [replaceAccessToken.success]);

  const combineTokenForm = useForm<CombineTokenFields>({
    mode: "all",
  });

  const toastInvalidJWT = () => toast.error("Invalid JWT token");

  const submitCombineToken = async (data: CombineTokenFields) => {
    if (data.firstToken === data.secondToken) {
      toast.error("Two of the same token!");
      return;
    }

    let res = await combine_token(data.firstToken, data.secondToken);
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
  };

  const submitReplaceToken = async () => {
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
          setReplaceAccessToken(p => ({ ...p, error: "Replacement unsuccessful", loading: false }));
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
        <Form noValidate onSubmit={combineTokenForm.handleSubmit(submitCombineToken)}>
          <Modal.Header closeButton closeVariant="white">
            Combine tokens
          </Modal.Header>
          <Modal.Body className="px-3 py-0 my-3">
            <FormGroup>
              <Form.Label>First Token</Form.Label>
              <InputGroup hasValidation className="mb-3">
                <Form.Control
                  {...combineTokenForm.register("firstToken", {
                    required: "token to replace with is required",
                    validate: {
                      isJwt: (v) => {
                        try {
                          jwtDecode(v);
                        } catch (error) {
                          console.log(error);
                        }

                        return undefined;
                      }
                    }
                  })}
                  isInvalid={combineTokenForm.formState.touchedFields.firstToken && !!combineTokenForm.formState.errors.firstToken}
                  style={{ zIndex: !!combineTokenForm.formState.errors.firstToken ? 3 : 2, }}
                />
                <Button
                  variant="outline-light"
                  title="Paste your current token"
                  onClick={() => combineTokenForm.setValue("firstToken", currentToken)}
                >
                  <i className="bi bi-pencil-square" />
                </Button>
                <Form.Control.Feedback type="invalid" tooltip>{combineTokenForm.formState.errors.firstToken?.message}</Form.Control.Feedback>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Form.Label>Second Token</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  {...combineTokenForm.register("secondToken", {
                    required: "token to replace with is required",
                    validate: {
                      isJwt: (v) => {
                        try {
                          jwtDecode(v);
                        } catch (error) {
                          console.log(error);
                        }

                        return undefined;
                      }
                    }
                  })}
                  isInvalid={combineTokenForm.formState.touchedFields.secondToken && !!combineTokenForm.formState.errors.secondToken}
                />
                <Form.Control.Feedback type="invalid" tooltip>{combineTokenForm.formState.errors.secondToken?.message}</Form.Control.Feedback>
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
            }}>Cancel</Button>
            <Button type="submit" disabled={!combineToken.availableToSubmit || combineTokenForm.formState.isSubmitting} variant="success">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <InputGroup>
        <Form.Control
          title="Your token here"
          value={currentToken}
          readOnly
          isValid={replaceAccessToken.success}
        />
        <Button
          title="Replace Token"
          size="sm"
          variant="outline-light"
          disabled={replaceAccessToken.loading}
          onClick={() => setReplaceAccessToken(p => ({ ...p, active: !p.active }))}
        >
          <i className={replaceAccessToken.active ? "bi bi-layers" : "bi bi-layers-half"} />
        </Button>
        <CopyButton size="sm" copy_value={currentToken} />
        <OverlayTrigger show={showHelp ? undefined : showHelp} placement="auto" rootClose={true} overlay={(p) => (
          <Tooltip id="accessTokenTooltipInfo" {...p}>
            This is your access token <span className="text-decoration-underline">solely</span>
            {" "} for granting access to delete the notes you've created. Token will clean out bad ids (nonexistent) periodically.
          </Tooltip>
        )}>
          <Button size="sm" variant="outline-light" onClick={() => setShowHelp(p => (!p))}>{showHelp ? <i className="bi bi-question-lg" /> : <i className="bi bi-x" />}</Button>
        </OverlayTrigger>
      </InputGroup>
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
            onClick={submitReplaceToken}
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
