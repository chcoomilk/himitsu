import { lazy, Suspense, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Spinner, Container, Alert } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { DefaultValue, PATHS } from "./utils/constants";
import { AppSetting } from "./utils/types";

import "bootstrap/scss/bootstrap.scss";
import "./stylings/index.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-loading-skeleton/dist/skeleton.css";

import Home from "./pages/Home";
import NewNote from "./pages/notes/NewNote";
import FindNote from "./pages/notes/FindNote";
import Note from "./pages/notes/Note";
import { default as Navbar } from "./components/Navigation";
import ContextCoupler from "./Provision";
import { local_storage } from "./utils/functions";
const NotFound = lazy(() => import("./pages/404"));
const About = lazy(() => import("./pages/About"));
const Settings = lazy(() => import("./pages/Settings"));
const Notes = lazy(() => import("./pages/notes/Notes"));
const NewNoteModal = lazy(() => import("./components/note/NewNoteModal"));
const Debug = lazy(() => import("./Debug"));

function App() {
  const [appSettings, setAppSettings] = useState<AppSetting>(local_storage.get("settings") || DefaultValue.settings);
  // const [mqIsDark] = useState(window.matchMedia("(prefers-color-scheme: dark)"));
  const [show, setShow] = useState<boolean>(sessionStorage.getItem("read") === "true" ? false : true);

  return (
    <ContextCoupler appSettings={appSettings}>
      <Alert show={show} variant="warning" dismissible closeLabel="x" onClose={() => { sessionStorage.setItem("read", "true"); setShow(false) }}>
        {/* <Alert.Heading>
          <i className="bi bi-exclamation-triangle-fill"></i> {" "}
          Warning!!!
        </Alert.Heading> */}
        <p className="fw-bolder">
          WARNING!!!, Please read this before using the app
        </p>
        Heroku will stop offering its free product plans on 26th October this year. Please make a backup of your saved notes because migrating data from Heroku seems impossible and may result in data loss.
        As for the service, expect nothing because it's plenty difficult to deploy a Rust application anywhere. I might consider buying a raspberry pi, or a mini arm computer of some sorts but like I'm broke asf boii
      </Alert>
      <Navbar />
      <Suspense fallback={
        <Spinner animation="border" role="status"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: "50vh",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      }>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <Container className="himitsu">
          {
            (() => {
              let data = local_storage.get("last_saved_note");
              return data ? <NewNoteModal data={data} onHide={() => local_storage.remove("last_saved_note")} /> : null;
            })()
          }
          <Routes>
            <Route path={"/404"} element={<NotFound />} />
            <Route path={"/debug"} element={<Debug />} />
            <Route path={PATHS.home} element={<Home />} />
            <Route path={PATHS.about} element={<About />} />
            <Route path={PATHS.new_note} element={<NewNote />} />
            <Route path={PATHS.notes} element={<Notes />} />
            <Route path={PATHS.find_note} element={<FindNote />} />
            <Route path={PATHS.note_detail + "/:id"} element={<Note />} />
            <Route path={PATHS.settings} element={<Settings setAppSettings={setAppSettings} />} />
            <Route path="*" element={
              <Navigate to="/404" />
            } />
          </Routes>
        </Container>
      </Suspense>
    </ContextCoupler>
  );
}

export default App;
