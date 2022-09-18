import React from 'react';

// Component
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

// Images
import ChaiOne from '../assets/chaione.svg';

function Reset() {
    return <main className="login-container">
  
      <article className="login-main">
  
  
        <img src={ChaiOne} alt="ChaiOne" className="login-logo" />
        <h1 className="reset-title">Recover Password</h1>
        <h2 className="reset-subtitle">Please enter your email address below.<br />
          You will receive a link to reset your password.</h2>
  
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label className="login-label">Username</Form.Label>
            <Form.Control className="login-input" type="email" placeholder="Enter Your Username or Email" />
  
          </Form.Group>
  
  
  
          <Button className="login-button" type="submit">
            <div className="login-button-text">Submit</div>
          </Button><br />
          <Link className="login-footer-label" to="/login">Back to Login
          <i className="login-arrow login-right"></i></Link>
  
  
        </Form>
      </article>
      <aside className="login-side"></aside>
    </main>;
  }

  export default Reset;