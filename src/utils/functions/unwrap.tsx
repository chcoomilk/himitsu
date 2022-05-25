import { Alert } from "react-bootstrap";
import toast, { ToastOptions } from "react-hot-toast";
import { Alert as AlertT } from "../types";

export const opts: ToastOptions = {
  className: "toast-alert",
  position: "top-center",
};

const unwrap_default = (key: keyof AlertT): void => {
  switch (key) {
    case "clientError":
      toast.custom((t) => (
        <Alert show={t.visible} variant="secondary" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          <Alert.Heading>
            <i className="bi bi-cloud-slash"></i> {" "}
            Error occurred
          </Alert.Heading>
          <p>
            There is something wrong with your himitsu app.
            Try "Shift+R (Refresh)" or clear out the cache of this site in your browser.
          </p>
        </Alert>
      ), { duration: Infinity, ...opts });
      // toast(
      //   <Alert variant="secondary">
      //     <Alert.Heading>
      //       <i className="bi bi-cloud-slash"></i> {" "}
      //       Client Error Occurred
      //     </Alert.Heading>
      //     <p>
      //       There is something wrong with your himitsu app.
      //       Try "Shift+R (Refresh)" or clear out the cache of this site in your browser.
      //     </p>
      //   </Alert>
      // );
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
      ), { duration: 6000, ...opts });
      // return (
      //   <Alert variant="success">
      //     <Alert.Heading>
      //       <i className="bi bi-trash"></i> {" "}
      //       Deletion Successful
      //     </Alert.Heading>
      //     <p>
      //       Well boys, we did it, racism is no more
      //     </p>
      //   </Alert>
      // );
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
      ), { duration: 6000, ...opts });
      // return (
      //   <Alert>
      //   </Alert>
      // );
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
            We even searched through your mind and found nothing there.
          </p>
        </Alert>
      ), { duration: 6000, ...opts });
      // return (
      //   <Alert variant="info" dismissible>
      //     <Alert.Heading>
      //       <i className="bi bi-question-circle"></i> {" "}
      //       Item was not found
      //     </Alert.Heading>
      //     <p>
      //       We even searched into your mind, there was literally nothing.
      //     </p>
      //   </Alert>
      // );
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
      ), { duration: Infinity, ...opts });
      // return (
      //   <Alert variant="secondary" dismissible>
      //     <Alert.Heading>
      //       <i className="bi bi-cloud-slash"></i> {" "}
      //       Error Occurred
      //     </Alert.Heading>
      //     <p>
      //       Service is unresponsive at the moment, please try again later.
      //     </p>
      //   </Alert>
      // );
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
      ), { duration: 4000, ...opts });
      // return (
      //   <Alert variant="warning" dismissible>
      //     <Alert.Heading>
      //       <i className="bi bi-pause-circle"></i> {" "}
      //       Slow down!
      //     </Alert.Heading>
      //     <p>
      //       You're not trying to break the server, are'ya?.
      //     </p>
      //   </Alert>
      // );
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
      ), { duration: 6000, ...opts });
      // return (
      //   <Alert variant="danger" dismissible>
      //     <Alert.Heading>
      //       <i className="bi bi-dash-circle"></i> {" "}
      //       Wrong passphrase
      //     </Alert.Heading>
      //     <p>
      //       Think Mark, thicc!
      //     </p>
      //   </Alert>
      // );
      break;
  }
};

export default unwrap_default;
