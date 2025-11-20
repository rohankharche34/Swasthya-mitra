import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Mic, SearchHeart, JournalMedical } from 'react-bootstrap-icons';
import { Slide } from "react-awesome-reveal"; // <-- Import

function HowItWorks() {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">How It Works</h2>
      <Row>
        <Col md={4} className="mb-3">
          <Slide direction="up" delay={100} triggerOnce>
            <Card className="text-center h-100 shadow-sm how-it-works-card">
              <Card.Body className="p-4">
                <Mic className="how-it-works-icon mb-3" />
                <Card.Title className="h3">1. Describe Symptoms</Card.Title>
                <Card.Text>
                  Use our simple form or the voice-enabled input (via Web Speech API) to tell us how you're feeling.
                </Card.Text>
              </Card.Body>
            </Card>
          </Slide>
        </Col>
        <Col md={4} className="mb-3">
          <Slide direction="up" delay={200} triggerOnce>
            <Card className="text-center h-100 shadow-sm how-it-works-card">
              <Card.Body className="p-4">
                <SearchHeart className="how-it-works-icon mb-3" />
                <Card.Title className="h3">2. Get Prediction</Card.Title>
                <Card.Text>
                  Our ML model (powered by Python) analyzes your symptoms to predict potential diseases.
                </Card.Text>
              </Card.Body>
            </Card>
          </Slide>
        </Col>
        <Col md={4} className="mb-3">
          <Slide direction="up" delay={300} triggerOnce>
            <Card className="text-center h-100 shadow-sm how-it-works-card">
              <Card.Body className="p-4">
                <JournalMedical className="how-it-works-icon mb-3" />
                <Card.Title className="h3">3. Receive Guidance</Card.Title>
                <Card.Text>
                  Get a clear list of precautions and quick remedies based on the prediction to help you feel better.
                </Card.Text>
              </Card.Body>
            </Card>
          </Slide>
        </Col>
      </Row>
    </Container>
  );
}

export default HowItWorks;