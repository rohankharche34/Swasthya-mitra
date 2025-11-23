import React from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { MicFill } from 'react-bootstrap-icons';

function DashboardPage({user}) {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-5 text-center">
              <h1 className="display-5">Symptom Checker</h1>
              <p className="lead text-muted">
                Describe your symptoms below, or use the voice input.
              </p>
              
              <div className="my-4">
                <textarea 
                  className="form-control" 
                  rows="5" 
                  placeholder="e.g., 'I have a fever, headache, and a sore throat...'"
                ></textarea>
              </div>
              
              <Button variant="success" size="lg" className="me-3">
                Predict Disease
              </Button>
              
              <Button variant="outline-primary" size="lg">
                <MicFill className="me-2" /> 
                Use Voice Input
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardPage;