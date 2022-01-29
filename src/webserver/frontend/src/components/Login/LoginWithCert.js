"use strict;"
import React, {Component, useState, useEffect} from 'react';

//BootStrap react imports

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';

import 'whatwg-fetch';
import "./Login.css";
import Nav from "../Nav";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AuthConsumer from '../useAuth';
import Container from 'react-bootstrap/esm/Container';

const forge = require("node-forge");
forge.options.usePureJavascript = true;
const asn1 = forge.asn1;

export default function Login(props){
    const navigate = useNavigate();
    const AuthContext = AuthConsumer();
    const { state } = useLocation();

    const handleSubmit = async function (e) {
        e.preventDefault();
        
        AuthContext.loginWithCert().then(() => {
            if (state !== null){
                navigate(state);
            }
            else{
                navigate("/home");
            }
        });
    };
    return (
        <div className="LoginPage">
            <Container fluid>
                <Nav certificate={true}></Nav>
            </Container>

                        
                
                <div className="LoginButton">
                    <Button block variant="success" size ="lg" type="submit" onClick={handleSubmit}>
                        Login
                    </Button>
                </div>
        </div>
      );
}