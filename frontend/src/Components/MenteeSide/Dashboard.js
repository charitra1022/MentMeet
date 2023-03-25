import React, { useState, useEffect } from "react";
import { Badge, Container } from "react-bootstrap";
import NavbarComponent from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import profile from "./images/profile.png";
import "./styles/Dashboard.css";

// get rating component
// const getStarComponent = (count) => {
//   let arr = [];
//   for (let i = 1; i <= count; i++)
//     arr.push(<span style={{ color: "gold" }}>✭</span>);
//   for (let i = 1; i <= 5 - count; i++) arr.push(<span>☆</span>);
//   return arr;
// };

export default function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(window.localStorage.getItem("authToken"));
  const [userData, setUserData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const handleEditButton = () => {
    navigate("/update-mentee")
  };

  // redirect to login page if not logged in
  useEffect(() => {
    if (token === null) navigate("/login-mentee");
  }, [token]);

  // fetch user data
  useEffect(() => {
    setDataLoaded(false);
    setDataLoading(true);
    // fetch mentee details
    axios
      .get("http://localhost:5000/get-mentee-details", {
        headers: {
          "auth-token": token,
        },
      })
      .then((res) => {
        const data = res.data.mentee;
        setUserData(data);
        setDataLoaded(true);
        setDataLoading(false);
        console.log(data);
      });
  }, []);

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
            <h1 className="heading">{userData.name}</h1>

            <div className="badgebox">
              {/* badges will come here */}
              {!dataLoading &&
                dataLoaded &&
                userData.skills.map((skill) => (
                  <>
                    <Badge bg="dark">{skill}</Badge>
                    <> </>
                  </>
                ))}
            </div>

            {/* Discription will come here */}
            {/* <div id="description" className="text-center">
              {userData.description}
            </div> */}

            <div className="footer">
              {/* Email will comehere */}
              <span id="email">
                Email : <b>{userData.email}</b>
              </span>{" "}
              <br />
              {/* Phone number will come here */}
              <span id="phone">
                Phone: <b>{userData.phone}</b>
              </span>
              <br />
              {/* location details come here */}
              <span id="location">
                Location: <b>{userData.city}</b>, <b>{userData.state}</b>
              </span>
              <br />
              {/* job details come here */}
              {/* <span id="job">
                Works as:{" "}
                <b>
                  {userData.position} @{userData.company}
                </b>
              </span>
              <br /> */}
              {/* star rating */}
              {/* <span id="rating">
                {!dataLoading &&
                  dataLoaded &&
                  getStarComponent(userData.rating)}
              </span> */}
              <br />
              <button onClick={handleEditButton}>Edit</button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
