import { Alert } from "react-bootstrap";
import toast, { ToastOptions } from "react-hot-toast";
import { Alert as AlertT, BootstrapIcon } from "../types";

export const toast_alert_opts: ToastOptions = {
  className: "toast-alert",
  position: "top-center",
};

export const bs_alert = (head: string | JSX.Element, body: string | JSX.Element, icon?: BootstrapIcon): JSX.Element => {
  let bi = icon ? (<><i className={"bi bi-" + icon} /> {" "}</>) : undefined;
  return (
    <>
      <Alert.Heading>
        {bi}
        {head}
      </Alert.Heading>
      <p>
        {body}
      </p>
    </>
  );
}

const unwrap_default = (key: keyof AlertT): void => {
  switch (key) {
    case "accessDenied":
      toast.custom((t) => (
        <Alert show={t.visible} variant="warning" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle-fill"></i> {" "}
            Access Denied
          </Alert.Heading>
          <p>
            Oi, have you got a loicense for that?
          </p>
        </Alert>
      ), { duration: 6000, ...toast_alert_opts });
      break;
    case "handled":
      break;
    case "clientError":
      toast.custom((t) => (
        <Alert show={t.visible} variant="secondary" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          {bs_alert(
            "Error occurred",
            (
              <>
                There is something wrong with your himitsu app. <br />
                Try "Ctrl+Shift+R (Hard Refresh)" or clear out the cache of this site in your browser.
              </>
            ),
            "cloud-slash",
          )}
        </Alert>
      ), { duration: Infinity, ...toast_alert_opts });
      break;
    case "genericDelete":
      toast.custom((t) => (
        <Alert show={t.visible} variant="danger" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          <Alert.Heading>
            <i className="bi bi-trash"></i> {" "}
            Deleted
          </Alert.Heading>
          <p>
            Well boys, we did it, racism is no more
          </p>
        </Alert>
      ), { duration: 6000, ...toast_alert_opts });
      break;
    case "genericSave":
      toast.custom((t) => (
        <Alert show={t.visible} variant="primary" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          <Alert.Heading>
            <i className="bi bi-check"></i> {" "}
            Saved
          </Alert.Heading>
          <p>
            Item has been saved
          </p>
        </Alert>
      ), { duration: 6000, ...toast_alert_opts });
      break;
    case "notFound":
      toast.custom((t) => (
        <Alert show={t.visible} variant="info" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          <Alert.Heading>
            <i className="bi bi-question-circle"></i> {" "}
            Not found
          </Alert.Heading>
          <p>
            Possibly expired or deleted
          </p>
        </Alert>
      ), { duration: 6000, ...toast_alert_opts });
      break;
    case "serverError":
      toast.custom((t) => (
        <Alert show={t.visible} variant="secondary" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          <Alert.Heading>
            <i className="bi bi-cloud-slash"></i> {" "}
            Server error
          </Alert.Heading>
          <p>
            Service is unresponsive at the moment, please try again later.
          </p>
        </Alert>
      ), { duration: Infinity, ...toast_alert_opts });
      break;
    case "tooManyRequests":
      toast.custom((t) => (
        <Alert show={t.visible} variant="warning" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          <Alert.Heading>
            <i className="bi bi-pause-circle"></i> {" "}
            Slow down!
          </Alert.Heading>
          <p>
            You're not trying to break the server, are'ya?.
          </p>
        </Alert>
      ), { duration: 4000, ...toast_alert_opts });
      break;
    case "wrongPassphrase":
      toast.custom((t) => (
        <Alert show={t.visible} variant="danger" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          <Alert.Heading>
            <i className="bi bi-dash-circle"></i> {" "}
            Invalid secret
          </Alert.Heading>
          <p>
            Think Mark, thicc!
          </p>
        </Alert>
      ), { duration: 6000, ...toast_alert_opts });
      break;
  }
};

export default unwrap_default;
