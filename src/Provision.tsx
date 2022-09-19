import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
// import { persistQueryClient } from "react-query/persistQueryClient-experimental"
import { BrowserRouter } from "react-router-dom";
import { applyTheme } from "./stylings/theme";
import AppContext from "./utils/app_state_context";
import { AppSetting } from "./utils/types";
import { useRegisterSW } from 'virtual:pwa-register/react';
import toast from "react-hot-toast";
import { Alert } from "react-bootstrap";
import { toast_alert_opts } from "./utils/functions/unwrap";

type AppDefinitions = {
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

const ContextCoupler = ({ appSettings, children }: AppDefinitions) => {
  useEffect(() => applyTheme(appSettings.app_theme), [appSettings.app_theme]);

  const sw = useRegisterSW({
    onNeedRefresh() {
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
            <button className="btn-anchor alert-link" onClick={() => sw.updateServiceWorker(true)}>click here</button> {" "}
            to reload the app!
          </p>
        </Alert>
      ), {
        ...toast_alert_opts,
        id: "himitsu-app-update",
        duration: Infinity,
      });
    },
    onOfflineReady: () => console.log("sw is installed for offline use"),
    onRegisterError: (e) => console.log("registration error!", e),
    onRegisteredSW: (_, r) => {
      r && setInterval(() => {
        r.update()
      }, 60 * 30 * 1000);
    },
  });

  return (
    <BrowserRouter>
      <AppContext.Provider
        value={{
          appSettings,
        }}
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AppContext.Provider>
    </BrowserRouter>
  );
};

export default ContextCoupler;
