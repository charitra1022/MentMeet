import { Form, Row, Col } from "react-bootstrap";

export default function SignUpForm() {
  return (
    <Form className="p-5">
      <Form.Group className="mb-3" controlId="name-input">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Your Name"
          className="shadow-none"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="email-input">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          className="shadow-none"
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="phone-input">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="number"
          min={10}
          max={10}
          className="shadow-none"
          placeholder="Enter Phone Number"
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
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3" controlId="city-input">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Your State"
              className="shadow-none"
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
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="confirm-password-input">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          className="shadow-none"
        />
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group> */}

      <button className="submit-btn" type="submit">
        Submit
      </button>
    </Form>
  );
}
