import { useEffect } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
// import { persistQueryClient } from "react-query/persistQueryClient-experimental"
import { BrowserRouter } from "react-router-dom"
import { applyTheme } from "./theme"
import { BASE_URL } from "./utils/constants"
import AppContext from "./utils/app_state_context"
import { local_storage } from "./utils/functions"
import { AppSetting } from "./utils/types"

type AppDefinitions = {
  children: React.ReactNode,
  appSettings: AppSetting,
  setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>,
}

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

        if (response.ok) {
          return await response.json();
        } else {
          throw response.status;
        }
      },
      keepPreviousData: true,
      retry: (failureCount, error) => {
        if (error === 400) return false;
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

const ContextCoupler = ({ appSettings, setAppSettings, children }: AppDefinitions) => {
  // App renders twice for no reason in development, so this fire twice
  // but issue does not occur in production, so as expected this should only fire once
  useEffect(() => {
    const saved_settings = local_storage.get("settings");
    if (saved_settings) {
      setAppSettings(saved_settings);
    }
  }, [setAppSettings]);

  useEffect(() => applyTheme(appSettings.preferences.app_theme), [appSettings.preferences.app_theme]);
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
