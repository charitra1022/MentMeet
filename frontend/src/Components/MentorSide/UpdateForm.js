import { useState, useEffect } from "react";
import { Form, Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import NavbarComponent from "./Navbar";
import "./styles/login.css";

export default function UpdateForm() {
  const navigate = useNavigate(); // router navigator

  // for user data
  const [token, setToken] = useState(window.localStorage.getItem("authToken"));
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // for form fields
  const [name, setName] = useState("");
  const [phn, setPhone] = useState("");
  const [stateUser, setUserState] = useState("");
  const [city, setCity] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [skill, setSkill] = useState([]);
  // const [pswd, setPassword] = useState("");
  // const [cfm_pswd, setConfirmPassword] = useState("");

  // states for displaying alert card
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // state for showing loader and submit button
  const [processing, setProcessing] = useState(false);

  // redirect to login page if not logged in
  useEffect(() => {
    if (token === null) navigate("/login-mentor");
  }, [token]);

  // fetch user data
  useEffect(() => {
    setDataLoaded(false);
    setDataLoading(true);
    // fetch mentor details
    axios
      .get("http://localhost:5000/check-mentor", {
        headers: { "auth-token": token },
      })
      .then((res) => {
        const data = res.data.mentor;

        // update state with mentor data
        setName(data.name);
        setPhone(data.phone);
        setUserState(data.state);
        setCity(data.city);
        setCompany(data.company);
        setPosition(data.position);
        setDescription(data.description);
        setSkill(data.skills.join(","));

        setDataLoaded(true);
        setDataLoading(false);
        console.log(data);
      });
  }, []);

  // called when form is submitted
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevents form default behaviour

    setProcessing(true); // show loading spinner and hide submit button

    // updated data to pass to the api
    const data = {
      name: name,
      phone: phn,
      state: stateUser,
      city: city,
      company: company,
      position: position,
      description: description,
      skills: skill.split(","),
    };

    axios
      .post("http://localhost:5000/update-mentor-details", data, {
        headers: { "auth-token": token },
      })
      .then((res) => {
        const data = res.data;
        console.log(data);

        setProcessing(false); // hide spinner and show submit button

        if (data["success"]) {
          setErrorStatus(false); // hide error
          navigate("/dashboard-mentor");
        } else {
          setErrorStatus(true); // show error
          if (data["error"] !== undefined) setErrorMsg(data["error"]);
          else setErrorMsg(data["errors"][0]["msg"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <NavbarComponent />

      <div className="login-page">
        <Container className="login-container">
          {dataLoading && (
            <div className="py-5 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}

          {!dataLoading && dataLoaded && (
            <>
              <Form className="p-5" onSubmit={handleSubmit}>
                {errorStatus && (
                  <Alert
                    key="danger"
                    variant="danger"
                    onClose={() => setErrorStatus(false)}
                    dismissible
                  >
                    {errorMsg}
                  </Alert>
                )}

                <Form.Group className="mb-3" controlId="name-input">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Your Name"
                    className="shadow-none"
                    defaultValue={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="phone-input">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="number"
                    // min={10}
                    // max={10}
                    className="shadow-none"
                    placeholder="Enter Phone Number"
                    onChange={(event) => setPhone(event.target.value)}
                    defaultValue={phn}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="state-input">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Your State"
                        className="shadow-none"
                        onChange={(event) => setUserState(event.target.value)}
                        defaultValue={stateUser}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3" controlId="city-input">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Your City"
                        className="shadow-none"
                        onChange={(event) => setCity(event.target.value)}
                        defaultValue={city}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="company-input">
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Your Company"
                        className="shadow-none"
                        onChange={(event) => setCompany(event.target.value)}
                        defaultValue={company}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group className="mb-3" controlId="position-input">
                      <Form.Label>Position</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Position at Company"
                        className="shadow-none"
                        onChange={(event) => setPosition(event.target.value)}
                        defaultValue={position}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="description-input">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="shadow-none"
                    placeholder="Tell something about yourself!"
                    onChange={(event) => setDescription(event.target.value)}
                    defaultValue={description}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="skills-input">
                  <Form.Label>Skills</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="shadow-none"
                    placeholder="skill 1,skill 2,skill 3"
                    onChange={(event) => setSkill(event.target.value)}
                    defaultValue={skill}
                    required
                  />
                  <Form.Text className="text-muted">
                    separated by comma (,)
                  </Form.Text>
                </Form.Group>

                {/* <Form.Group className="mb-3" controlId="new-password-input">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    className="shadow-none"
                    onChange={(event) => setPassword(event.target.value)}
                    onFocus={(event) => setPassword(event.target.value)}
                  />
                </Form.Group> */}

                {/* <Form.Group className="mb-3" controlId="confirm-password-input">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    className="shadow-none"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    onFocus={(event) => setConfirmPassword(event.target.value)}
                  />
                </Form.Group> */}

                {!processing && (
                  <button type="submit" className="submit-btn">
                    Update
                  </button>
                )}

                {processing && (
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                )}
              </Form>
            </>
          )}
        </Container>
      </div>
    </>
  );
}
