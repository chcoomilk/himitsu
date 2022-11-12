import { lazy, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DefaultValues, PATHS } from "./utils/constants";
import { AppSetting } from "./utils/types";
import { local_storage } from "./utils/functions";
import Initialization from "./Provision";

import "./stylings/index.scss";
import "react-loading-skeleton/dist/skeleton.css";

import Navbar from "./components/Navigation";
import FindNote from "./pages/notes/FindNote";
import NewNote from "./pages/notes/NewNote";
import Note from "./pages/notes/Note";
const NotFound = lazy(() => import("./pages/404"));
const About = lazy(() => import("./pages/About"));
const Settings = lazy(() => import("./pages/Settings"));
const Notes = lazy(() => import("./pages/notes/Notes"));
const NewNoteModal = lazy(() => import("./components/note/NewNoteModal"));
const Debug = lazy(() => import("./Debug"));

function App() {
  const [appSettings, setAppSettings] = useState<AppSetting>(local_storage.get("settings") || DefaultValues.settings);
  // const [mqIsDark] = useState(window.matchMedia("(prefers-color-scheme: dark)"));
  const checkLastModalPopup = () => {
    let data = local_storage.get("last_saved_note");
    return data ? <NewNoteModal data={data} onHide={() => local_storage.remove("last_saved_note")} /> : null;
  };

  return (
    <Initialization appSettings={appSettings}>
      <Navbar />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      {checkLastModalPopup()}
      <Routes>
        <Route path={"/404"} element={<NotFound />} />
        <Route path={"/debug"} element={<Debug />} />
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
    </Initialization>
  );
}

export default App;
