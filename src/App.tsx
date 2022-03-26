import { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import { StoreContext } from "./utils/context";
import { BASE_URL, DefaultValue, PATHS } from "./utils/constants";
import { QueryClient, QueryClientProvider } from "react-query"
import { Popup } from "./utils/types";

import "./stylings/index.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-loading-skeleton/dist/skeleton.css";

import Home from "./pages/Home";
import NewNote from "./pages/notes/NewNote";
import FindNote from "./pages/notes/FindNote";
import NewNoteModal from "./components/note/NewNoteModal";
import NotFound from "./pages/404";
const Popups = lazy(() => import("./components/Popups"))
const About = lazy(() => import("./pages/About"));
const Navigation = lazy(() => import("./components/Navigation"))
const Note = lazy(() => import("./pages/notes/Note"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        let url = BASE_URL + queryKey[0];

        let response = await fetch(url, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json"
          },
        });

        return await response.json();
      }
    }
  }
});

function App() {
  const [passphrase, setPassphrase] = useState<string | null>(null);
  const [popups, setPopups] = useState<Popup>({
    ...DefaultValue.Popups,
  });

  return (
    <Router>
      <StoreContext.Provider
        value={{
          setPassphrase,
          popups,
          setPopups,
          passphrase
        }}
      >
        <QueryClientProvider client={queryClient}>
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
            <Navigation />
            <Popups popups={popups} setPopups={setPopups} />
            <Container className="himitsu">
              {
                window.localStorage.getItem(DefaultValue.Pages.NewNote.RESULT_STATE_NAME)
                  ? <NewNoteModal
                    data={JSON.parse(
                      window.localStorage.getItem(DefaultValue.Pages.NewNote.RESULT_STATE_NAME) || "There has to be something!"
                    )} />
                  : null
              }
              <Routes>
                <Route path={PATHS.home} element={<Home />} />
                <Route path={"/404"} element={<NotFound />} />
                <Route path={PATHS.about} element={<About />} />
                <Route path={PATHS.new_note} element={<NewNote />} />
                <Route path={PATHS.find_note} element={<FindNote />} />
                <Route path={PATHS.note_detail + "/:_id"} element={<Note />} />
                <Route path="*" element={
                  <Navigate to="/404" />
                } />
              </Routes>
            </Container>
          </Suspense>
        </QueryClientProvider>
      </StoreContext.Provider >
    </Router >
  );
}

export default App;
