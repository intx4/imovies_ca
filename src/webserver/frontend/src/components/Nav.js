import { useNavigate } from "react-router-dom";
import AuthConsumer from "./useAuth";
import React, { useState, useEffect } from "react";
//BootStrap react imports
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Nav(props) {
  const certificate = props.certificate;
  const AuthContext = AuthConsumer();
  const navigate = useNavigate();
  const handleLogout = async function (e) {
    e.preventDefault();
    AuthContext.logout().then(() => {
      navigate("/login", { replace: true });
    });
  };
  return (
    <Container>
      <Navbar sticky="top" variant="light" bg="light">
        <Container fluid className="d-flex justify-content-between">
          <Navbar.Brand href="/home">
            <img
              src="imovies.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="IMovies"
            />
            IMovies
          </Navbar.Brand>
          {!AuthContext.state.authed ? (
            certificate ? (
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/login", { replace: true })}
              >
                Login with Credentials
              </Button>
            ) : (
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/login_w_cert", { replace: true })}
              >
                Login with Certificate
              </Button>
            )
          ) : (
            <>
              {AuthContext.state.isAdmin ? (
                <Button
                  block
                  type="button"
                  variant="outline-warning"
                  onClick={() => navigate("/admin", { replace: true })}
                >
                  Admin
                </Button>
              ) : null}
              <Button
                block
                type="button"
                onClick={handleLogout}
                variant="outline-danger"
              >
                Logout
              </Button>
            </>
          )}
        </Container>
      </Navbar>
    </Container>
  );
}
