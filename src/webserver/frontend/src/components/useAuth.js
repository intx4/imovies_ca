"use strict;";
import * as React from "react";
const axios = require("axios").default;
const https = require("https");

const authContext = React.createContext();
const parseJwt = (token) => {
  try {
    let jwt = Buffer.from(token.split(".")[1], "base64").toString();
    console.log(jwt);
    return JSON.parse(jwt);
  } catch (e) {
    return null;
  }
};

function useAuth() {
  /*
    authed: is the user authed or not
    isLoading: tell components if the check of the token is done or not
  */
  const [state, setState] = React.useState({
    authed: false,
    isLoading: true,
    isAdmin: false,
  });

  return {
    state,
    verifyTokenCookie: async () => {
      try {
        const res = await axios.post("/api/is_logged_in");
        if (res.status === 200) {
          const { authed, isAdmin } = res.data;
          setState({ isLoading: false, authed, isAdmin });
        }
      } catch (err) {
        setState((s) => ({ ...s, isLoading: false }));
      }
    },
    login: async (uid, password) => {
      try {
        const res = await axios.post("/api/login", {
          uid,
          password,
        });

        if (res.status === 200) {
          const { authed, isAdmin } = res.data;

          setState({
            authed,
            isAdmin,
            isLoading: false,
          });
        }
      } catch (err) {
        window.alert("Invalid credentials");
        setState((s) => ({ ...s, isLoading: false }));
      }
    },
    loginWithCert: async () => {
      try {
        const res = await axios.post("/api/login_with_cert");

        if (res.status === 200) {
          const { authed, isAdmin } = res.data;
          setState({
            authed,
            isAdmin,
            isLoading: false,
          });
        }
      } catch (err) {
        window.alert("Invalid credentials");
        setState((s) => ({ ...s, isLoading: false }));
      }
    },
    logout: async () => {
      try {
        await axios.post("/api/logout");
        setState((s) => ({ authed: false, isLoading: false, isAdmin: false }));
      } catch (err) {
        setState((s) => ({ authed: false, isLoading: false, isAdmin: false }));
      }
    },
  };
}

export function AuthProvider({ children }) {
  /*
        Takes components children as argument
        Children can subscribe to the context that is passed as value props from Provider
        In this case is the context
    */
  const auth = useAuth();

  // Fetch the token from local storage if it exsits
  React.useEffect(() => {
    auth.verifyTokenCookie();
  }, []);

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  //The AuthConsumer must be enclosed with a AuthProvider
  return React.useContext(authContext);
}
