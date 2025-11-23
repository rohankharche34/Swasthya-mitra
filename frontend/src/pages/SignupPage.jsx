import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse } from 'react-bootstrap-icons';

function SignupPage() {
  const[name,setName]=useState("");
  const[password,setPassword]=useState("");
  const[gmail,setGmail]=useState("");
  const[dob,setDob]=useState("");
  const[gender,setGender]=useState("");
  const navigate=useNavigate();

  const handleSignup = () => {
    if (!name || !gmail || !password || !dob||!gender) return;

    fetch("http://localhost:8080/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name,gender,dob,gmail, password }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Signup successful! Please login.");
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };



  return (
    <div className="auth-page-wrapper">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="auth-card">
              <Row className="g-0">
                <Col md={6} className="auth-brand-section-signup">
                  <HeartPulse size={50} className="mb-3" />
                  <h2 className="fw-bold">Join Us</h2>
                  <p className="mt-3">
                    Create your free account to get personalized health insights and guidance.
                  </p>
                </Col>
                
                <Col md={6} className="auth-form-section">
                  <h3 className="text-center mb-4 fw-bold">Create Account</h3>
                  <Form>
                    <Form.Group className="mb-3" controlId="formBasicName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your name" onChange={(e)=>{setName(e.target.value)}} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" onChange={(e)=>{setGmail(e.target.value)}} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="text" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicDob">
                      <Form.Label>Date of birth:</Form.Label>
                      <Form.Control type="text" placeholder="dd/mm/yy" onChange={(e)=>{setDob(e.target.value)}} />
                    </Form.Group>
                    <Form.Select
                      value={gender}
                      onChange={(e)=>{setGender(e.target.value)}}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </Form.Select>
                    
                    <div className="d-grid">
                       {/* This button also links to /home to simulate signup */}
                      <Button  variant="primary" type="button" onClick={handleSignup}>
                        Create Account
                      </Button>
                    </div>
                  </Form>
                  <div className="text-center mt-3">
                    <small>
                      Already have an account? <Link to="/">Log In</Link>
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

export default SignupPage;