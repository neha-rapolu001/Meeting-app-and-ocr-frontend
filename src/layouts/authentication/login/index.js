/**
 * This component is the landing page of the application. It contains a form which is used to login a user.
 *
 * @params: {props}
 *
 *
 */

import React, { useState } from "react";
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
import { FaUserAlt, FaLock } from "react-icons/fa";
import { login } from "../../../api";
import "bootstrap/dist/css/bootstrap.min.css";

function Login(props) {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleChurchChange=(e)=>{
    return (
    e.target.value)
    }
  const history = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    errors: {
      username: "",
      password: "",
      invalid:""
    },
    churchList:[
      { id: 1, name: 'Church1' },
      { id: 2, name: 'Church2' },
      { id: 3, name: 'Church3' }
    ]

  });

  const [error, setError] = useState(null);
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

  const validateForm = () => {
    const { username, password } = formData;
    const errors = {};

    // Check for errors and update the errors object accordingly
    if (!username) {
      errors.username = "Username is required.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    return errors;
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

    login(formData)
      .then(() => {
        navigate('/dashboard');
        // props.setAuthenticate(true);
      })
      .catch((error) => {
        
        const errors = {};
        errors.invalid = error.response.data.message;
        setFormData((prevState) => ({
          ...prevState,
          errors: { ...errors },
        }));
        setError(error.response.data.message);
        console.log(formData.errors.invalid);
      });
  };

  return (
    <div className="center-fullscreen">
      <Card className="vertical-card">
        <CardBody>
          <Card className="my-card">
            <CardBody className="my-card-body">
              <Form>
                <Card className="my-card">
                  <CardBody className="my-card-body">
                  {formData.errors.invalid && <div className="form-error">{formData.errors.invalid}</div>}
                    <Row>
            
                    
                      <FormGroup>
                      
                        <Label for="username" className="form-label">
                          Username
                        </Label>
                        {/* <FaUserAlt className="mr-2" /> */}
                        <Input
                          type="text"
                          className="form-input"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter your username"
                          invalid={!!formData.errors.username}
                        />
                        
                        {formData.errors.username && <div >{formData.errors.username}</div>}
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
                          className="form-input"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          invalid={!!formData.errors.password}
                        />
                        {formData.errors.password && <div className="invalid-feedback">{formData.errors.password}</div>}
                        
                        {/* <div className="text-right mt-2">
                          <a className="link-text" href="/forgot-password">
                            Forgot password?
                          </a>
                        </div> */}
                      </FormGroup>
                    </Row>
                    <Row>
                      <FormGroup>
                        <Label for="password" className="form-label">
                          Church
                        </Label>
                        <Input
                          type="select"
                          className="form-input"
                          name="church"
                          value={formData.church}
                          onChange={handleChange}
                          invalid={!!formData.errors.church}
                        >
                          <option value="">Select Church</option>
                          {formData.churchList.map((church) => (
                            <option key={church.id} value={church.id}>
                              {church.name}
                            </option>
                          ))}
                        </Input>
                        
                        <div className="text-right mt-2">
                          <a className="link-text" href="/forgot-password">
                            Forgot password?
                          </a>
                        </div>
                      </FormGroup>
                    </Row>
                  </CardBody>
                </Card>
              </Form>
              <Row>
                <div>
                  <Card className="outer-card">
                    <CardBody>
                      <Button className="my-button" color="success" onClick={handleSubmit}>
                        Sign In
                      </Button>{" "}
                      <Button className="my-button" color="success" onClick={handleSignUp}>
                        Sign Up
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              </Row>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;
