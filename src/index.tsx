import React from 'react';
// import { Alert } from 'react-bootstrap';
import ReactDOM from 'react-dom/client';
// import toast from 'react-hot-toast';
import App from './App';
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import { toast_alert_opts } from './utils/functions/unwrap';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// serviceWorkerRegistration.register({
//   onUpdate: () => {
//     serviceWorkerRegistration.unregister();
//     toast.custom((t) => (
//       <Alert show={t.visible} variant="primary" dismissible onClose={() => {
//         toast.dismiss(t.id);
//       }}>
//         <Alert.Heading>
//           <i className="bi bi-exclamation-triangle-fill"></i> {" "}
//           An update is available
//         </Alert.Heading>
//         <p>
//           The update will be applied whenever you go back to this site. <br />
//           If you have the app installed, {" "}
//           <a className="alert-link" href={window.location.href}>click here</a> {" "}
//           to reload the app!
//         </p>
//       </Alert>
//     ), {
//       ...toast_alert_opts,
//       id: "himitsu-app-update",
//       duration: Infinity,
//     });
//   },

//   onSuccess: (reg) => {
//     reg.update();
//   }
// });
