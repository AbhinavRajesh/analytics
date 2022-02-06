import "../styles/globals.css";
import type { AppProps } from "next/app";
import AuthProvider from "hooks/useAuth";
import DataProvider from "hooks/useData";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </AuthProvider>
  );
}

export default MyApp;
