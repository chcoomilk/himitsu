import { QueryClient, QueryClientProvider } from "react-query";
import { Wrapper } from "./library";
// import { persistQueryClient } from "react-query/persistQueryClient-experimental";

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

export default function ReactQuery({ children }: Wrapper) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
