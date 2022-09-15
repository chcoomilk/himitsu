import { lazy, Suspense, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { DefaultValues, PATHS } from "./utils/constants";
import { AppSetting } from "./utils/types";

import "./stylings/index.scss";
import "react-loading-skeleton/dist/skeleton.css";

import Home from "./pages/Home";
import NewNote from "./pages/notes/NewNote";
import FindNote from "./pages/notes/FindNote";
import Note from "./pages/Note";
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
  const [appSettings, setAppSettings] = useState<AppSetting>(local_storage.get("settings") || DefaultValues.settings);
  // const [mqIsDark] = useState(window.matchMedia("(prefers-color-scheme: dark)"));

  return (
    <ContextCoupler appSettings={appSettings}>
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
