import { useState } from "react";
import { Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUpForm() {
  // states for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [stateUser, setUserState] = useState("");
  const [phn, setPhone] = useState("");
  const [pswd, setPassword] = useState("");
  const [cfm_pswd, setConfirmPassword] = useState("");

  // states for displaying alert card
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // state for showing loader and submit button
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate(); // router navigator

  // called when form is submitted
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevents form default behaviour

    setProcessing(true); // show loading spinner and hide submit button

    // if password fields don't match
    if (pswd !== cfm_pswd) {
      setErrorStatus(true);
      setErrorMsg("Passwords doesn't match");
      setProcessing(false); // hide loading spinner and show submit button
      return;
    }

    // data to send to the API
    const data = {
      name: name,
      email: email,
      city: city,
      state: stateUser,
      skills: [],
      phone: phn,
      password: pswd,
    };

    // request API for data addition
    axios
      .post("http://localhost:5000/create-mentee", data)
      .then((res) => {
        const data = res.data;
        console.log(data);

        setProcessing(false); // hide spinner and show submit button

        if (data["success"]) {
          setErrorStatus(false); // hide error
          window.localStorage.setItem("authToken", data["authToken"]); // save authtoken
          navigate("/update-mentee");
        } else {
          setErrorStatus(true); // show error
          if (data["error"] !== undefined) setErrorMsg(data["error"]);
          else setErrorMsg(data["errors"][0]["msg"]);
        }
      })
      .catch((err) => {
        setProcessing(false); // hide spinner and show submit button
        setErrorStatus(true); // show error
        setErrorMsg("Internal Error! Try again after some time.");
        console.log(err);
      });
  };

  return (
    <Form className="p-5" onSubmit={handleSubmit}>
      <h2 className="text-center">Mentee</h2>

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

      {errorStatus && window.scrollTo(0, 0)}

      <Form.Group className="mb-3" controlId="name-input">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Your Name"
          className="shadow-none"
          onChange={(event) => setName(event.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="email-input">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          className="shadow-none"
          onChange={(event) => setEmail(event.target.value)}
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
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
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="new-password-input">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Password"
          className="shadow-none"
          onChange={(event) => setPassword(event.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="confirm-password-input">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          className="shadow-none"
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group> */}

      {!processing && (
        <button color="#F2D388" type="submit" className="submit-btn">
          Submit
        </button>
      )}

      {processing && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </Form>
  );
}
