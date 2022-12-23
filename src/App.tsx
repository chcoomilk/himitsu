import React, { lazy, useEffect, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { DefaultValues, PATHS } from "./utils/constants";
import { AppSetting } from "./utils/types";
import { local_storage } from "./utils/functions";
import Initialization from "./Provision";
import { AppAction, reducer as appReducer } from "./utils/AppSettingContext";

import "./stylings/index.scss";
import "react-loading-skeleton/dist/skeleton.css";

import Navbar from "./components/Navigation";
import FindNote from "./pages/notes/FindNote";
import Note from "./pages/notes/Note";
const NewNote = lazy(() => import("./pages/notes/NewNote"));
const NotFound = lazy(() => import("./pages/404"));
const About = lazy(() => import("./pages/About"));
const AppSettings = lazy(() => import("./pages/Settings"));
const Notes = lazy(() => import("./pages/notes/Notes"));
const NewNoteModal = lazy(() => import("./components/note/NewNoteModal"));
const Debug = lazy(() => import("./Debug"));

function App() {
  const [appSettings, dispatchAppSetting] = useReducer<React.Reducer<AppSetting, AppAction>>(
    appReducer, local_storage.get("settings") || DefaultValues.settings
  );
  // const [mqIsDark] = useState(window.matchMedia("(prefers-color-scheme: dark)"));
  const checkLastModalPopup = () => {
    let data = local_storage.get("last_saved_note");
    return data && <NewNoteModal data={data} onHide={() => local_storage.remove("last_saved_note")} />;
  };

  useEffect(() => local_storage.set("settings", appSettings), [appSettings]);

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
        <Route path={"/debug"} element={<Debug />} />
        <Route path={PATHS.about} element={<About />} />
        <Route path={PATHS.new_note} element={<NewNote />} />
        <Route path={PATHS.notes} element={<Notes />} />
        <Route path={PATHS.find_note} element={<FindNote />} />
        <Route path={PATHS.note_detail + "/:id"} element={<Note />} />
        <Route path={PATHS.settings} element={<AppSettings setAppSettings={dispatchAppSetting} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Initialization>
  );
}

export default App;
