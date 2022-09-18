import React from 'react';

// Component
import { Form, Button } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom";

// Images
import ChaiOne from '../assets/chaione.svg';

function Login(props: any) {
    let history = useHistory();
    return <main className="login-container">
  
      <article className="login-main">
        <img src={ChaiOne} alt="ChaiOne" className="login-logo" />
        <h1 className="login-title">Welcome!</h1>
        <h2 className="login-subtitle">Sign in to our services</h2>
  
        <Form onSubmit={(e) => {
          e.preventDefault();
          history.push('/dashboard')
          props.setIsUserAuth(true);
        }}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="login-label">Username</Form.Label>
            <Form.Control 
                data-testid="login-username"
                className="login-input" 
                type="email" 
                placeholder="Enter Your Username or Email" />
          </Form.Group>
  
          <Form.Group controlId="formBasicPassword">
            <Form.Label className="login-label">Password</Form.Label>
            <Form.Control 
                data-testid="login-password"
                className="login-input"
                type="password" 
                placeholder="Enter Your Password" />
          </Form.Group>
  
          <Button className="login-button" type="submit"  data-testid="login-signin">
            <div className="login-button-text">Sign in</div>
          </Button>
          <br />
          <Link 
            data-testid="login-reset"
            className="login-footer-label" 
            to="/reset">Forgot Password?</Link>
  
          <div className="login-footer-label">Do not have account yet? Sign up now!
          <i className="login-arrow login-right"></i>
          </div>
  
        </Form>
      </article>
      <aside className="login-side"></aside>
    </main>;
  }

  export default Login;