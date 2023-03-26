import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import NavbarComponent from "./Navbar";

import "./styles/login.css";

export default function LoginSignupComponent() {
  const [mode, setMode] = useState("login");

  const toggleMode = (mode) => {
    const loginEl = document.getElementById("login-section");
    const signupEl = document.getElementById("signup-section");

    if (mode === "login") {
      setMode(mode);
      signupEl.style.borderTopRightRadius = "0.8rem";
      signupEl.style.borderBottomLeftRadius = "0.8rem";
      signupEl.style.backgroundColor = "#d8f8f3";

      loginEl.style.backgroundColor = "white";
      loginEl.style.borderTopLeftRadius = "0.8rem";
    } else {
      setMode(mode);
      signupEl.style.backgroundColor = "white";

      loginEl.style.backgroundColor = "#d8f8f3";
      loginEl.style.borderBottomRightRadius = "0.8rem";
    }
  };

  return (
    <>
      <NavbarComponent isLoginPage={true} showMenteeLogin={true} />
      <div className="login-page">
        <Container className="login-container">
          <Row>
            <Col
              id="login-section"
              className="section-button px-5 py-2"
              onClick={() => toggleMode("login")}
            >
              Login
            </Col>

            <Col
              id="signup-section"
              className="section-button px-5 py-2"
              onClick={() => toggleMode("signup")}
              style={{
                backgroundColor: "#d8f8f3",
                borderTopRightRadius: "0.8rem",
                borderBottomLeftRadius: "0.8rem",
              }}
            >
              Sign Up
            </Col>
          </Row>

          {mode === "login" && <LoginForm />}
          {mode === "signup" && <SignUpForm />}
        </Container>
      </div>
    </>
  );
}
