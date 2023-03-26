import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "./styles/NavbarStyle.css";

export default function NavbarComponent(props) {
  const navigate = useNavigate();

  // delete token and redirect to login page
  const handleLogOut = () => {
    window.localStorage.clear();
    navigate("/login-mentee");
  };

  // handle mentee login button
  const handleMenteeLogin = () => {
    navigate("/login-mentee");
  };

  // handle mentor login button
  const handleMentorLogin = () => {
    navigate("/login-mentor");
  };

  // handle chat button click
  const handleChat = () => {
    navigate("/chat");
  };

  return (
    <Navbar className="navcontainer">
      <Container>
        <Navbar.Brand>
          <Link to={"/"} style={{ textDecoration: "none", color: "black" }}>
            <h2>MentMeet</h2>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar className="justify-content-end">
          {props.showMenteeLogin && (
            <Navbar.Text>
              <button className="menteeloginbtn" onClick={handleMenteeLogin}>
                Mentee Login
              </button>
            </Navbar.Text>
          )}
          {props.showMentorLogin && (
            <Navbar.Text>
              <button className="menteeloginbtn" onClick={handleMentorLogin}>
                Mentor Login
              </button>
            </Navbar.Text>
          )}

          {props.isLoginPage !== true && (
            <Navbar.Text>
              <button className="chatbtn" onClick={handleChat}>Chat</button>
              <button className="logoutbtn" onClick={handleLogOut}>
                Logout
              </button>
            </Navbar.Text>
          )}
        </Navbar>
      </Container>
    </Navbar>
  );
}
