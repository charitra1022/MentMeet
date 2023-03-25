import { useState } from "react";
import { Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  // states for form fields
  const [email, setEmail] = useState("");
  const [pswd, setPassword] = useState("");

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

    axios
      .post("http://localhost:5000/login-mentor", {
        email: email,
        password: pswd,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);

        setProcessing(false); // hide spinner and show submit button

        if (data["success"]) {
          setErrorStatus(false); // hide error
          window.localStorage.setItem("authToken", data["authToken"]); // save authtoken
          navigate("/dashboard");
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

      <Form.Group className="mb-3" controlId="password-input">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          className="shadow-none"
          onChange={(event) => setPassword(event.target.value)}
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
