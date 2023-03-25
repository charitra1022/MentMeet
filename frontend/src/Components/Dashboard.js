import React, { useState, useEffect } from "react";
import { Badge, Container } from "react-bootstrap";
import NavbarComponent from "./Navbar";
import { useNavigate } from "react-router-dom";

import profile from "./images/profile.png";
import "./styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(window.localStorage.getItem("authToken"));

  // redirect to login page if not logged in
  useEffect(() => {
    if (token === null) navigate("/login");
  }, [token]);

  return (
    <>
      <NavbarComponent />
      <Container>
        <div>
          <div className="ProfileimgContainer text-center">
            {/* Profile image here */}
            <img
              className="roundedCircle profileimg"
              src={profile}
              alt=""
            ></img>
          </div>
          <div className="DetailContainer text-center">
            {/* User name will come here */}
            <h1 className="heading">Ayush Rai</h1>

            <div className="badgebox">
              {/* badges will come here */}
              <Badge bg="dark">JAVA</Badge> {/* this must includde */}
            </div>

            {/* Discription will come here */}
            <div id="Discription" className="text-center">
              Hello, I am software engeneer at TCS, having four years of
              experience in tech industry and a mentor. I have gueded more than
              hundred individuals.
            </div>

            <div className="footer">
              {/* Email will comehere */}
              <span id="email">
                Email : <b>ayush2022ca017@mnnit.ac.in</b>
              </span>{" "}
              <br />
              {/* Phone number will come here */}
              <span id="phone">
                Phone: <b>1234567890</b>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
