import "./index.scss";
import { QueryClient, QueryClientProvider } from "react-query";

const App = ({ Component, pageProps }) => {
  const QueryClient = new QueryClient()
  return (
    <QueryClientProvider client={}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default App;
