import { Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
// import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { BrowserRouter } from "react-router-dom";
import { applyTheme } from "./stylings/theme";
import AppSettingContext from "./utils/AppSettingContext";
import { AppSetting } from "./utils/types";
import { useRegisterSW } from 'virtual:pwa-register/react';
import toast from "react-hot-toast";
import { Alert, Spinner } from "react-bootstrap";
import { toast_alert_opts } from "./utils/functions/unwrap";
import { local_storage } from "./utils/functions";
import { patch_token } from "./queries";
import Navbar from "./components/Navigation";

type AppDefinition = {
  children: React.ReactNode,
  appSettings: AppSetting,
  // setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>,
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      retry: (failureCount, error) => {
        if (error === 400) return false;
        if (failureCount <= 3) return true;
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

const Initialization = ({ appSettings, children }: AppDefinition) => {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onOfflineReady: () => console.log("sw is installed for offline use"),
    onRegisterError: (e) => console.log("registration error!", e),
  });

  useEffect(() => applyTheme(appSettings.app_theme), [appSettings.app_theme]);

  useEffect(() => {
    if (needRefresh) {
      toast.custom((t) => (
        <Alert show={t.visible} variant="primary" dismissible onClose={() => {
          toast.dismiss(t.id);
        }}>
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle-fill"></i> {" "}
            An update is available
          </Alert.Heading>
          <p>
            The update will be applied whenever you go back to this site. <br />
            If you have the app installed, {" "}
            <button className="btn-anchor alert-link" onClick={() => updateServiceWorker(true)}>click here</button> {" "}
            to reload the app!
          </p>
        </Alert>
      ), {
        ...toast_alert_opts,
        id: "himitsu-app-update",
        duration: Infinity,
      });
    }
  }, [needRefresh, updateServiceWorker]);

  useEffect(() => {
    let refresh_token_interval = setInterval(() => {
      const token = local_storage.get("token");
      if (token) {
        const last_refresh_str = localStorage.getItem("refresh_token_timestamp");

        let schedule: Date = new Date();
        if (last_refresh_str) {
          let last_refresh_datetype = new Date(last_refresh_str);
          if (last_refresh_datetype instanceof Date && !isNaN(last_refresh_datetype.valueOf())) {
            schedule = last_refresh_datetype;
          }
        }

        if (schedule <= new Date()) {
          patch_token({ token });
        }
      }
    }, 30000);

    return () => {
      clearInterval(refresh_token_interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppSettingContext.Provider
        value={appSettings}
      >
        <QueryClientProvider client={queryClient}>
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
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          }>
            {children}
          </Suspense>
        </QueryClientProvider>
      </AppSettingContext.Provider>
    </BrowserRouter>
  );
};

export default Initialization;
