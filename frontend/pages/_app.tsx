import { AppProps } from "next/app";
import "normalize.css";
import "typeface-roboto";
import "../styles/common.css";
import "../styles/ckeditor.css";
import { Provider } from "react-redux";
import { useStore } from "../store";
import { Amplify } from "aws-amplify";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../styles/theme";
import React from "react";
import { SimpleDialog } from "../components/common/dialogs/simple-dialog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Amplify.configure({
  Auth: {
    region: "eu-west-1",
    userPoolId: "eu-west-1_fBTG93n1v",
    userPoolWebClientId: "6s77cp6j93tqmjh9tkmjod95db"
  },
  ssr: true
});

export default function App({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
        <SimpleDialog />
      </ThemeProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </Provider>
  );
}
