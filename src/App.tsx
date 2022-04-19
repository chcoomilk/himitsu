import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Spinner, Container } from "react-bootstrap";
import { StoreContext } from "./utils/contexts";
import { BASE_URL, DefaultValue, PATHS } from "./utils/constants";
import { QueryClient, QueryClientProvider } from "react-query"
import { AppTheme, Alert, ErrorKind, UserActionInfo } from "./utils/types";

import "bootstrap/scss/bootstrap.scss";
import "./stylings/index.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-loading-skeleton/dist/skeleton.css";

import Home from "./pages/Home";
import NewNote from "./pages/notes/NewNote";
import FindNote from "./pages/notes/FindNote";
import NewNoteModal from "./components/note/NewNoteModal";
import Note from "./pages/notes/Note";
import Navigation from "./components/Navigation";
const NotFound = lazy(() => import("./pages/404"));
const Alerts = lazy(() => import("./components/Alerts"));
const About = lazy(() => import("./pages/About"));
const Settings = lazy(() => import("./pages/Settings"));

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
      },
      keepPreviousData: true,
      retry: (failureCount) => {
        if (failureCount <= 10) return true;
        else return false;
      },
      retryDelay: 6000,
      cacheTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  }
});

function App() {
  const [passphrase, setPassphrase] = useState<string | null>(null);
  const [alertsContext, setAlertsContext] = useState<ErrorKind | UserActionInfo>(DefaultValue.Alerts);
  const [propAlerts, setPropAlerts] = useState<Alert>(DefaultValue.Alerts);
  const [theme, setTheme] = useState<AppTheme>(AppTheme.Normal);

  const parseTheme = (str: String): AppTheme => {
    switch (str) {
      case AppTheme.Normal:
        return AppTheme.Normal;
      case AppTheme.Black:
        return AppTheme.Black;
      case AppTheme.Light:
        return AppTheme.Light;
      default:
        return AppTheme.Normal;
    }
  };

  useEffect(() => {
    window.document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    setPropAlerts(prev => {
      return {
        ...prev,
        ...alertsContext,
      };
    });
  }, [alertsContext]);

  useEffect(() => {
    const savedThemeStr = window.localStorage.getItem("theme");
    if (savedThemeStr) {
      const savedTheme = parseTheme(savedThemeStr);
      window.document.documentElement.setAttribute("data-theme", savedTheme);
      setTheme(savedTheme);
    }
  }, [setTheme]);

  return (
    <Router>
      <StoreContext.Provider
        value={{
          setPassphrase,
          alerts: propAlerts,
          setAlerts: setAlertsContext,
          passphrase
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Navigation theme={theme} />
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
            <Alerts alerts={propAlerts} setAlerts={setPropAlerts} />
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
                <Route path={PATHS.settings} element={<Settings theme={theme} setTheme={setTheme} />} />
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
