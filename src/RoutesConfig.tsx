import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PATHS } from "./utils/constants";
import { AppTheme } from "./utils/types";

import Home from "./pages/Home";
import NewNote from "./pages/notes/NewNote";
import FindNote from "./pages/notes/FindNote";
import Note from "./pages/notes/Note";
const NotFound = lazy(() => import("./pages/404"));
const About = lazy(() => import("./pages/About"));
const Settings = lazy(() => import("./pages/Settings"));
const Notes = lazy(() => import("./pages/notes/Notes"));

type PropsPageSetting = {
  theme: AppTheme,
  setTheme: React.Dispatch<React.SetStateAction<AppTheme>>,
}

const AppRoutes = ({ theme, setTheme }: PropsPageSetting) => {
  return (
    <Routes>
      <Route path={"/404"} element={<NotFound />} />
      <Route path={PATHS.home} element={<Home />} />
      <Route path={PATHS.about} element={<About />} />
      <Route path={PATHS.new_note} element={<NewNote />} />
      <Route path={PATHS.notes} element={<Notes />} />
      <Route path={PATHS.find_note} element={<FindNote />} />
      <Route path={PATHS.note_detail + "/:_id"} element={<Note />} />
      <Route path={PATHS.settings} element={<Settings theme={theme} setTheme={setTheme} />} />
      <Route path="*" element={
        <Navigate to="/404" />
      } />
    </Routes>
  );
};

export default AppRoutes;
