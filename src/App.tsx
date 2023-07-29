import React, { lazy, useEffect, useReducer } from "react";
import { Route, Routes } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";
import Initialization from "./Provision";
import { useAlert } from "./custom-hooks";
import useLastSavedNote from "./custom-hooks/localStorageState/useLastSavedNote";
import FindNote from "./pages/notes/FindNote";
import NewNote from "./pages/notes/NewNote";
import "./stylings/index.scss";
import { AppAction, reducer as appReducer } from "./utils/AppSettingContext";
import { DefaultValues, PATHS } from "./utils/constants";
import { local_storage } from "./utils/functions";
import { AppSetting } from "./utils/types";

const Note = lazy(() => import("./pages/notes/Note"));
const NotFound = lazy(() => import("./pages/404"));
const About = lazy(() => import("./pages/About"));
const AppSettings = lazy(() => import("./pages/Settings"));
const Notes = lazy(() => import("./pages/notes/Notes"));
const NoteInfoModal = lazy(() => import("./components/note/NoteInfoModal"));
const Debug = lazy(() => import("./Debug"));

export default function App() {
  const [lastSavedNote, setLastSavedNote] = useLastSavedNote();
  const [appSettings, dispatchAppSetting] = useReducer<React.Reducer<AppSetting, AppAction>>(
    appReducer, local_storage.get("settings") || DefaultValues.settings
  );
  // const [mqIsDark] = useState(window.matchMedia("(prefers-color-scheme: dark)"));
  const launch = useAlert();

  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onOfflineReady: () => {
      launch({
        variant: "success",
        title: "App's successfully installed",
        content: `App is ready for offline use, 
        keep in mind that it still requires connection
        to request for notes that are stored
        in the server`,
      });
      console.log("sw is installed for offline use");
    },
    onRegisterError: (e) => {
      launch({
        variant: "danger",
        title: "App cannot be installed",
        content: "An error has occurred, check the console to see what happened",
      });
      console.log("registration error!", e);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      launch({
        title: "Update is available!",
        content: <p>
          The update will be applied whenever you go back to this site. <br />
          If you have the app installed, {" "}
          <button className="btn-anchor alert-link" onClick={() => updateServiceWorker(true)}>click here</button> {" "}
          to reload the app!
        </p>,
        duration: Infinity,
        variant: "success",
      });
    }
  }, [launch, needRefresh, updateServiceWorker]);

  useEffect(() => local_storage.set("settings", appSettings), [appSettings]);

  return (
    <Initialization appSettings={appSettings}>
      {lastSavedNote && <NoteInfoModal data={lastSavedNote} onHide={() => setLastSavedNote(null)} />}
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
