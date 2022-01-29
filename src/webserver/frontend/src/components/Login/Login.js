"use strict;";
import React, { Component, useState, useEffect } from "react";

//BootStrap react imports

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.min.css";

import "whatwg-fetch";
import "./Login.css";
import Nav from "../Nav";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import AuthConsumer from "../useAuth";
import Container from "react-bootstrap/esm/Container";

export default function Login(props) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const AuthContext = AuthConsumer();
  const { authed } = AuthContext.state;
  const { state } = useLocation();

  React.useEffect(() => {
    console.log("Coucou", authed);
    if (authed) {
      navigate("/home");
    }
  }, [authed]);

  const handleSubmit = async function (e) {
    e.preventDefault();

    AuthContext.login(user, password).then(() => {
      if (state !== null) {
        navigate(state);
      } else {
        navigate("/home");
      }
    });
  };

  function validateForm() {
    return user.length > 0 && password.length > 0;
  }

  return (
    <div className="LoginPage">
      <Container fluid>
        <Nav></Nav>
      </Container>
      <div className="Login">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="user">
            <Form.Label>UserID</Form.Label>

            <Form.Control
              autoFocus
              type="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </Form.Group>

          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>

            <Form.Control
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="LoginButton">
            <Button
              block
              variant="success"
              size="lg"
              type="submit"
              disabled={!validateForm()}
            >
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
