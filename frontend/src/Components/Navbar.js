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
    navigate("/login");
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
          {props.isLoginPage !== true && (
            <Navbar.Text>
              <button className="chatbtn">Chat</button>
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
