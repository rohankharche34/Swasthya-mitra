import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MicFill, CpuFill, LockFill, ClipboardHeart } from 'react-bootstrap-icons';
import { Fade } from "react-awesome-reveal"; // <-- Import

function FeaturesSection() {
  return (
    <Container fluid className="py-5" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <Container>
        <h2 className="text-center mb-5 fw-bold">Key Features</h2>
        <Row>
          <Col md={6} className="mb-4">
            <Fade direction="left" delay={200} triggerOnce>
              <h4 className="icon-heading">
                <MicFill className="feature-icon" /> 
                Voice-Enabled Input
              </h4>
              <p>Simply speak your symptoms. Our app, using the Web Speech API, converts your voice to text, making it easier to log your health concerns.</p>
            </Fade>
          </Col>
          <Col md={6} className="mb-4">
            <Fade direction="right" delay={200} triggerOnce>
              <h4 className="icon-heading">
                <CpuFill className="feature-icon" />
                Smart Disease Prediction
              </h4>
              <p>Powered by a Python (Flask/FastAPI) microservice, our ML model provides intelligent insights into potential health issues based on your symptoms.</p>
            </Fade>
          </Col>
          <Col md={6} className="mb-4">
            <Fade direction="left" delay={300} triggerOnce>
              <h4 className="icon-heading">
                <LockFill className="feature-icon" />
                Secure Authentication
              </h4>
              <p>Your health data is private. We're implementing a secure user system with Spring Security and JWT to protect your information.</p>
            </Fade>
          </Col>
          <Col md={6} className="mb-4">
            <Fade direction="right" delay={300} triggerOnce>
              <h4 className="icon-heading">
                <ClipboardHeart className="feature-icon" />
                Precautions & Remedies
              </h4>
              <p>Receive immediate, practical advice. Get a clear list of precautions and home remedies to manage your symptoms effectively.</p>
            </Fade>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default FeaturesSection;