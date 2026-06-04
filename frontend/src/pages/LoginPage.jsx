import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse } from 'react-bootstrap-icons';

function LoginPage({setAuth}) {
  const [gmail,setGmail]=useState("");
  const[password,setPassword]=useState("");
  const [loading, setLoading] = useState(false);
  let navigate=useNavigate();

  // useEffect(()=>{
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("token");
  // },[]);

  let handleLogin = async (e) => {
  e.preventDefault();

  if (!gmail || !password) return;

  try {
    setLoading(true);

    // simulate API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const token = btoa(gmail + ":" + password);

    setAuth(token);

    navigate("/home");
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      {loading && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.4)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        </div>
      )}
      <div className="auth-page-wrapper" style={{ filter: loading ? 'blur(4px)' : 'none',  pointerEvents: loading ? 'none' : 'auto' }}>
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
                  <Form onSubmit={handleLogin}>
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
                      <Button  variant="primary" type="submit">
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
    </>
  );
}

export default LoginPage;