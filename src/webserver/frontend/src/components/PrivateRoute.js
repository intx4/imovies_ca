import { Navigate, Route } from "react-router-dom";
import AuthConsumer from "./useAuth";
import React from "react";

export default function PrivateRoute({ path, children }) {
  /*
        Render children if user is logged in, ow redirects to login
    */
  const AuthContext = AuthConsumer();
  const { authed, isLoading } = AuthContext.state;

  return isLoading ? (
    <div>...</div>
  ) : authed ? (
    children
  ) : (
    <Navigate to="/login" replace state={path} />
  ); //state prop to redirect user to original dest after login
}
