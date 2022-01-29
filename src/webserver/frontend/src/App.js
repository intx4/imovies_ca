import "./App.css";
import React, { useState, useEffect } from "react";
//BootStrap react imports
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login/Login";
import LoginWithCert from "./components/Login/LoginWithCert";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";
import Admin from "./components/Admin";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./components/useAuth";

//components
const NotFound = () => <h1>404: Page not found on this server</h1>;
const Backdoor = () => <h1>To the attention of NSA Agent Michael J. Wiener<h2>The AES_CBC_128 key we used is: odelkyjivtqasmww</h2></h1>

//Routes
const routes = [
  { path: "/login", component: Login, protected: false },
  { path: "/login_w_cert", component: LoginWithCert, protected: false },
  { path: "/admin", component: Admin, protected: true },
  { path: "/home", component: Home, protected: true },
  { path: "/*", component: NotFound, protected: false },
  { path: "/b3ckd00r", component: Backdoor, protected: false}
];

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Login />} />
            {routes.map((route) =>
              route.protected === true ? (
                <Route
                  path={route.path}
                  element={
                    <PrivateRoute path={route.path}>
                      <route.component />
                    </PrivateRoute>
                  }
                />
              ) : (
                <Route path={route.path} element={<route.component />} />
              )
            )}
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
