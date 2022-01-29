import { useNavigate } from "react-router-dom";
import AuthConsumer from "./useAuth";
import React, { useState, useEffect } from "react";

//BootStrap react imports
import Container from "react-bootstrap/Container";

import Nav from "./Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

import "bootstrap/dist/css/bootstrap.min.css";

const axios = require("axios").default;

export default function Home() {
  const AuthContext = AuthConsumer();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  //const isadmin = true;
  const [CAState, setCAState] = useState({
    serial: 0,
    issued: 0,
    revoked: 0,
    revoked_certs: [],
  });

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/admin");
        if (res.status === 200) {
          setCAState({
            serial: res.data.serial,
            issued: res.data.issued,
            revoked: res.data.revoked,
            revoked_certs: [...res.data.revoked_certs],
          });
          setIsAdmin(true);
          setIsLoading(false);
        }
      } catch (err) {
        window.alert("Error!");
        setIsAdmin(false);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <div></div>;
  } else if (!isAdmin) {
    return <div> 403 Unauthorized</div>;
  } else {
    return (
      <div>
        <Nav />
        <Container className="pt-2 pr-5 mt-5 mr-5">
          <Row className="pt-1">
            <Col>Serial: </Col>
            <Col>{CAState.serial}</Col>
          </Row>
          <Row className="pt-1">
            <Col>Issued: </Col>
            <Col>{CAState.issued}</Col>
          </Row>
          <Row className="pt-1">
            <Col>Revoked: </Col>
            <Col>{CAState.revoked}</Col>
          </Row>
        </Container>
        <Container className="pt-2">
          <h3>Revoked certificates</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>uid</th>
                <th>Serial</th>
                <th>PEM Certificate</th>
              </tr>
            </thead>
            <tbody>
              {CAState.revoked_certs.map((cert) => (
                <tr>
                  <td>{cert[0]}</td>
                  <td>{cert[1]}</td>
                  <td
                    style={{
                      fontSize: 12,
                      lineHeight: "initial",
                      textAlign: "left",
                    }}
                  >
                    {Buffer.from(cert[2], "base64")
                      .toString()
                      .split("\n")
                      .map((x) => (
                        <>
                          {x}
                          <br />
                        </>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}
