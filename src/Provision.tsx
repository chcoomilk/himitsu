import { useEffect } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
// import { persistQueryClient } from "react-query/persistQueryClient-experimental"
import { BrowserRouter } from "react-router-dom"
import { applyTheme } from "./theme"
import { BASE_URL } from "./utils/constants"
import AppContext from "./utils/app_state_context"
import { AppSetting } from "./utils/types"

type AppDefinitions = {
  children: React.ReactNode,
  appSettings: AppSetting,
  // setAppSettings: React.Dispatch<React.SetStateAction<AppSetting>>,
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
      onError: (e) => {
        console.log("abc");
      }
    },
  }
});

const ContextCoupler = ({ appSettings, children }: AppDefinitions) => {
  useEffect(() => applyTheme(appSettings.app_theme), [appSettings.app_theme]);
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
