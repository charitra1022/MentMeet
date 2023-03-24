import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "./NavbarStyle.css";

export default function NavbarComponent() {
    return (
        <Navbar className="navcontainer">
            <Container >
                <Navbar.Brand href="#home"><h2>MentiMeet</h2></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar className="justify-content-end">
                    <Navbar.Text>
                        <button className="chatbtn">Chat</button>
                        <button className="logoutbtn">Logout</button>
                    </Navbar.Text>
                </Navbar>
            </Container>
        </Navbar>
    );
}
