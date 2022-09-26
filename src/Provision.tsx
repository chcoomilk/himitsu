import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
// import { persistQueryClient } from "react-query/persistQueryClient-experimental";
import { BrowserRouter } from "react-router-dom";
import { applyTheme } from "./stylings/theme";
import AppContext from "./utils/app_state_context";
import { AppSetting } from "./utils/types";
import { useRegisterSW } from 'virtual:pwa-register/react';
import toast from "react-hot-toast";
import { Alert } from "react-bootstrap";
import unwrap_default, { toast_alert_opts } from "./utils/functions/unwrap";
import { local_storage } from "./utils/functions";
import { BASE_URL } from "./utils/constants";
import jwtDecode from "jwt-decode";

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
        const sch_ls = localStorage.getItem("refresh_token_timestamp");

        let schedule: Date = new Date();
        if (sch_ls) {
          let _sch_ls = new Date(sch_ls);
          if (_sch_ls instanceof Date && !isNaN(_sch_ls.valueOf())) {
            schedule = _sch_ls;
          }
        }

        if (schedule <= new Date()) {
          fetch(BASE_URL + "/token", {
            method: "PATCH",
            mode: "cors",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              token,
            })
          }).then(resp => (resp.json().then(res => {
            let is_token: boolean;
            try {
              jwtDecode(res.token);
              is_token = true;
            } catch (error) {
              is_token = false;
            }

            if (is_token) {
              local_storage.set("token", res.token);
            } else {
              // client's outdated
              unwrap_default("clientError");
            }
          }).catch(() => (unwrap_default("clientError")))).catch(() => ("retry later"))).finally(() => {
            let d = new Date();
            d.setHours(d.getHours() + 2);
            localStorage.setItem("refresh_token_timestamp", d.toString());
          });
        }
      }
    }, 30000);

    return () => {
      clearInterval(refresh_token_interval);
    };
  }, []);

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
