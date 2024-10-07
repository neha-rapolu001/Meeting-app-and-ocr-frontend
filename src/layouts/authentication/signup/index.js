/**
 * This component is the signup page of the application. It contains a form which is used to signup a user.
 *
 * @params: {props}
 *
 *
 */

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { signup } from '../../../api';
import { FaUserAlt, FaLock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const history = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    errors: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [signupMessage, setSignupMessage] = useState(null);

  const initialFormData = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };

  const validateForm = () => {
    const { first_name, last_name, email, password } = formData;
    const errors = {};

    // Check for errors and update the errors object accordingly
    if (!first_name) {
      errors.first_name = "First name is required.";
    }

    if (!last_name) {
      errors.last_name = "Last name is required.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        errors: { ...errors },
      }));
      return;
    }

    signup(formData)
      .then((response) => {
        console.log(response.data);
        setFormData(initialFormData);
        setIsSubmitted(true);
        setSignupMessage("Signup successful!");
      })
      .catch((error) => {
        console.log(error.response.data);
        // setError(error.response.data);
        setSignupMessage("Signup failed.");
      });
  };


  return (
    <div className="center-fullscreen">
      <Card className="vertical-card">
        <CardBody>
          <Card className="my-card">
            <CardBody className="my-card-body">
              <Form onSubmit={handleSubmit}>
                <Card className="my-card">
                  <CardBody className="my-card-body">
                    <Row>
                      <FormGroup>
                        <Label for="First Name" className="form-label">
                          First name
                        </Label>
                        <Input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          placeholder="Enter your first name"
                          invalid={!!formData.errors.first_name}
                        />
                        {formData.errors.first_name && <div className="invalid-feedback">{formData.errors.first_name}</div>}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Label for="username" className="form-label">
                          Last name
                        </Label>
                        <Input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          placeholder="Enter your last name"
                          invalid={!!formData.errors.last_name}
                        />
                        {formData.errors.last_name && <div className="invalid-feedback">{formData.errors.last_name}</div>}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Label for="username" className="form-label">
                          Email
                        </Label>
                        {/* <FaUserAlt className="mr-2" /> */}
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          invalid={!!formData.errors.last_name}
                          />
                          {formData.errors.email && <div className="invalid-feedback">{formData.errors.email}</div>}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Label for="password" className="form-label">
                          {/* <FaLock className="mr-2" />  */}
                          Password
                        </Label>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          invalid={!!formData.errors.last_name}
                          />
                          {formData.errors.password && <div className="invalid-feedback">{formData.errors.password}</div>}
                      </FormGroup>
                      <div className="mt-2">
                        <a className="link-text" href="/">
                          Back to login
                        </a>
                      </div>
                    </Row>
                    <Row>
                    <div style={{display: "flex", justifyContent: "center"}}>
                      <Card className="outer-card">
                        <CardBody>
                          <Button type="submit" color="success">
                            Sign up
                          </Button>
                        </CardBody>
                      </Card>
                    </div>
                    </Row>
                  </CardBody>
                </Card>
              </Form>
            </CardBody>
          </Card>
          {isSubmitted && <p>{signupMessage}</p>}
        </CardBody>
      </Card>
    </div>
  );
};

export default Signup;
