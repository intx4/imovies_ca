import { useNavigate } from "react-router-dom";
import AuthConsumer from "./useAuth";
import React, { useState, useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
//BootStrap react imports
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import Nav from "./Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import ModalTitle from "react-bootstrap/ModalTitle";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import "bootstrap/dist/css/bootstrap.min.css";

import { saveAs } from "file-saver";
import { Buffer } from "buffer";
const axios = require("axios").default;

function EditModal(props) {
  const handleChange = (e) => {
    props.setField(e.target.value);
  };

  const handleSubmit = async function (e) {
    const verifyInput = (input, length = 1) => {
      if (!input || input.length < length) {
        window.alert(
          `This field cannot be less than ${length} characters long !`
        );
        props.setShow(false);
        return true;
      }
      return false;
    };

    const isValidEmail = (val) => {
      let regEmail =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return regEmail.test(val);
    };

    let shouldAbort = false;

    let uid = props.user.UserId;
    let password = props.user.Password;
    let firstName = props.user.FirstName;
    let lastName = props.user.LastName;
    let email = props.user.Email;
    if (props.type === "User ID") {
      uid = props.field;
      shouldAbort = verifyInput(uid);
    }
    if (props.type === "Password") {
      password = props.field;
      shouldAbort = verifyInput(password, 6);
    }
    if (props.type === "First Name") {
      firstName = props.field;
      shouldAbort = verifyInput(firstName);
    }
    if (props.type === "Last Name") {
      lastName = props.field;
      shouldAbort = verifyInput(lastName);
    }
    if (props.type === "Email") {
      email = props.field;
      shouldAbort = verifyInput(email);

      if (!isValidEmail(email)) {
        window.alert("This is not a valid email !");
        shouldAbort = true;
      }
    }

    if (shouldAbort) {
      return;
    }

    /*
    props.setUser({
      UserId: uid,
      Password: "****",
      FirstName: firstName,
      LastName: lastName,
      Email: email,
    });
    */
    try {
      //remember that the password should be ignored if ****
      const res = await axios.post("/api/modify", {
        uid,
        lastName,
        firstName,
        email,
        password,
      });
      if (res.status == 200) {
        props.setUser({
          UserId: uid,
          Password: "****",
          FirstName: firstName,
          LastName: lastName,
          Email: email,
        });
        window.alert("Changes applied!");
      } else {
        window.alert("Error!");
      }
    } catch (err) {
      window.alert("Error sending data!");
    } finally {
      props.setShow(false);
    }
  };
  return (
    <Modal show={props.show} onHide={() => props.setShow(false)}>
      <ModalHeader closeButton>
        <ModalTitle>Edit {props.type}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group
            className="mb-3"
            controlId={props.type === "Password" ? "password" : "user"}
          >
            <Form.Label>{props.type}</Form.Label>
            <Form.Control
              type={
                props.type === "Password"
                  ? "password"
                  : props.type === "Email"
                  ? "email"
                  : "user"
              }
              rows={1}
              placeholder={""}
              value={props.field}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function RevokeModal(props) {
  const [uploadFile, setUploadFile] = useState(null);
  const [certificates, setCertificates] = useState([]); // certs of shape [serial: Int, revoked: Int]

  useEffect(() => {
    if (props.show) {
      (async () => {
        try {
          const res = await axios.get("/api/get_certs");
          if (res.status === 200) {
            setCertificates([...res.data]);
          }
        } catch (err) {
          window.alert("Error while fetching certificates" + err);
        }
      })();
    }
  }, [props.show]);

  const handleRevoke = async (serial) => {
    try {
      const res = await axios.post("/api/revoke", { serial });
      if (res.status === 200) {
        window.alert("Certificate revoked!");
      } else {
        window.alert("Error while revoking certificate!");
      }
    } catch (err) {
      window.alert("Error while revoking certificate!");
    } finally {
      props.setShow(false);
    }
  };

  const handleRevokeAll = async () => {
    if (window.confirm("Are you sure you want to revoke all certificates?")) {
      try {
        const res = await axios.post("/api/revoke_all");
        if (res.status == 200) {
          window.alert("Revoked!");
        }
      } catch (err) {
        console.log(err);
        window.alert("Something went wrong!");
      } finally {
        props.setShow(false);
      }
    }
  };

  const valid_certs = certificates.filter((cert) => cert[1] === 0);

  return (
    <Modal show={props.show} onHide={() => props.setShow(false)}>
      <ModalHeader closeButton>
        <ModalTitle>Manage PKCS12 Certificates</ModalTitle>
      </ModalHeader>
      <ModalBody>
        List of valid certificates
        <Container className="pr-5 mr-5">
          {valid_certs.length === 0 ? (
            <em>There are no valid certificates for this account</em>
          ) : (
            valid_certs.map((cert) => (
              <Row className="pt-1">
                <Col>Serial: </Col>
                <Col>{cert[0]}</Col>
                <Col>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRevoke(cert[0])}
                  >
                    Revoke
                  </Button>
                </Col>
              </Row>
            ))
          )}
        </Container>
        <Button
          onClick={handleRevokeAll}
          block
          className="center mt-4"
          variant="danger"
          type="submit"
          size="sm"
          disabled={valid_certs.length === 0}
        >
          Revoke all certificates
        </Button>
      </ModalBody>
    </Modal>
  );
}

export default function Home() {
  const AuthContext = AuthConsumer();
  const isadmin = AuthContext.isAdmin;
  //states for the modal for editing
  const [user, setUser] = useState({
    UserId: "",
    Password: "",
    FirstName: "",
    LastName: "",
    Email: "",
  });
  const [field, setField] = useState("");
  const [show, setShow] = useState(false);
  const [type, setType] = useState("");
  const [showRevoke, setShowRevoke] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  async function requestCertificate(e) {
    e.preventDefault();
    try {
      const res = await axios.post("/api/certificate");
      if (res.status == 200) {
        let data = new Blob([Buffer.from(res.data.pkcs12)], {
          type: "application/octet-stream",
        });
        saveAs(data, "cert.p12");
        window.alert("You can download your certificate!");
      }
    } catch (err) {
      window.alert("Error!");
    }
  }
  //fetch user data before rendering
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/info");
        if (res.status === 200) {
          setUser({
            UserId: res.data.userID,
            Password: res.data.password,
            FirstName: res.data.firstname,
            LastName: res.data.lastname,
            Email: res.data.email,
          });

          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(true);
        window.alert("Error retrieving data!");
      }
    })();
  }, []);

  return isLoading ? (
    <div>...</div>
  ) : (
    <div className="HomePage">
      <Nav />
      <Container className="pt-2 pr-5 mt-5 mr-5">
        <Row className="pt-1">
          <Col>User ID: </Col>
          <Col>{user.UserId}</Col>
          <Col>{/*just a placeholder*/}</Col>
        </Row>
        <Row className="pt-1">
          <Col>Password: </Col>
          <Col>{user.Password}</Col>
          <Col>
            <Button
              variant="success"
              onClick={() => {
                setField(user.Password);
                setShow(true);
                setType("Password");
              }}
            >
              Edit
            </Button>
          </Col>
        </Row>
        <Row className="pt-1">
          <Col>First Name: </Col>
          <Col>{user.FirstName}</Col>
          <Col>
            <Button
              variant="success"
              onClick={() => {
                setField(user.FirstName);
                setShow(true);
                setType("First Name");
              }}
            >
              Edit
            </Button>
          </Col>
        </Row>
        <Row className="pt-1">
          <Col>Last Name: </Col>
          <Col>{user.LastName}</Col>
          <Col>
            <Button
              variant="success"
              onClick={() => {
                setField(user.LastName);
                setShow(true);
                setType("Last Name");
              }}
            >
              Edit
            </Button>
          </Col>
        </Row>
        <Row className="pt-1">
          <Col>Email: </Col>
          <Col>{user.Email}</Col>

          <Col>
            <Button
              variant="success"
              onClick={() => {
                setField(user.Email);
                setShow(true);
                setType("Email");
              }}
            >
              Edit
            </Button>
          </Col>
        </Row>
      </Container>
      <Row>
        <Col className="pt-1 pr-5 m-5 d-flex justify-content-end">
          <Container className="pt-1 pr-5 m-5 d-flex justify-content-center">
            <Button variant="primary" onClick={requestCertificate}>
              Request New Certificate
            </Button>
          </Container>
          <Container className="pt-1 pr-5 m-5 d-flex justify-content-center">
            <Button variant="warning" onClick={() => setShowRevoke(true)}>
              Manage Certificates
            </Button>
          </Container>
          <Container
            className="pt-1 pr-5 m-5 d-flex justify-content-center"
            style={{ visibility: isadmin ? "visible" : "hidden" }}
          >
            <Button
              variant="warning"
              disabled={!isadmin}
              onClick={() => navigate("/admin")}
            >
              Admin Panel
            </Button>
          </Container>
        </Col>
      </Row>
      <EditModal
        field={field}
        setField={setField}
        user={user}
        setUser={setUser}
        show={show}
        setShow={setShow}
        type={type}
      />
      <RevokeModal show={showRevoke} setShow={setShowRevoke} />
    </div>
  );
}
