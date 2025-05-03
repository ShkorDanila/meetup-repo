import { CookiesProvider } from "react-cookie";
import AuthProvider from "./AuthProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ApiProvider from "./ApiProvider";
import UsersCompaniesProvider from "./UsersCompaniesProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";

const queryClient = new QueryClient();

export const IndexProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        // 1. Use dark algorithm
        algorithm: theme.darkAlgorithm,

        // 2. Combine dark algorithm and compact algorithm
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <AuthProvider>
            <ApiProvider>
              <UsersCompaniesProvider>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </UsersCompaniesProvider>
            </ApiProvider>
          </AuthProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};
