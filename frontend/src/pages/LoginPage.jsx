import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse } from 'react-bootstrap-icons';

function LoginPage({setAuth}) {
  const [gmail,setGmail]=useState("");
  const[password,setPassword]=useState("");
  let navigate=useNavigate();

  // useEffect(()=>{
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("token");
  // },[]);

  let handleLogin=()=>{
    if (!gmail || !password) return;

    
    const token = btoa(gmail + ":" + password);
    navigate("/home");
    setAuth(token);
    
  }
  return (
    <div className="auth-page-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="auth-card">
              <Row className="g-0">
                <Col md={6} className="auth-brand-section">
                  <HeartPulse size={50} className="mb-3" />
                  <h2 className="fw-bold">Swasthya Mitra</h2>
                  <p className="mt-3">
                    Your trusted health companion. Log in to access your personal dashboard, predictions, and guidance.
                  </p>
                </Col>
                
                <Col md={6} className="auth-form-section">
                  <h3 className="text-center mb-4 fw-bold">User Login</h3>
                  <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" onChange={(e)=>{setGmail(e.target.value)}} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}} />
                    </Form.Group>
                    
                    <div className="d-grid">
                      {/* This button now links to /home to simulate login */}
                      <Button  variant="primary" type="submit" onClick={handleLogin}>
                        Login
                      </Button>
                    </div>
                  </Form>
                  <div className="text-center mt-3">
                    <small>
                      Don't have an account? <Link to="/signup">Sign Up</Link>
                    </small>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginPage;