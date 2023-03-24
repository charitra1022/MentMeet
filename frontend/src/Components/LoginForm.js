import { Form } from "react-bootstrap";

export default function LoginForm() {
  return (
    <Form className="p-5">
      <Form.Group className="mb-3" controlId="email-input">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password-input">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      
      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}

      <button color="#F2D388" type="submit" className="submit-btn">
        Submit
      </button>
    </Form>
  );
}
