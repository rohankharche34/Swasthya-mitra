import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Fade } from 'react-awesome-reveal';

function ProfilePage({user}) {
  const [formData, setFormData] = useState({
    name: user.name,
    gmail: user.gmail,
    dob: user.dob,
    gender: user.gender,
    image: user.image
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://swasthya-mitra-g7v7.onrender.com";

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch(`${API_BASE_URL}/api/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + localStorage.getItem("token"),
    },
    body: JSON.stringify(formData)
  });

  if (res.ok) {
    alert("Profile updated successfully");
  } else {
    alert("Update failed");
  }
};
  
  return (
    <Container className="py-5">
      <Fade direction="down" triggerOnce>
        <h1 className="mb-4">My Profile</h1>
      </Fade>

      <Row>
        <Col md={4}>
          <Fade direction="left" delay={200} triggerOnce>
            <Card className="text-center p-4">
              <Card.Img 
                variant="top" 
                src={formData.image} 
                className="rounded-circle mx-auto" 
                style={{ width: '150px', height: '150px' }}
              />
              <Card.Body>
                <Card.Title className="h4">{formData.name}</Card.Title>
                <Card.Text className="text-muted">{formData.gmail}</Card.Text>
                
              </Card.Body>
            </Card>
          </Fade>
        </Col>
        <Col md={8}>
          <Fade direction="right" delay={300} triggerOnce>
            <Card>
              <Card.Body className="p-4">
                <h3 className="mb-4">Account Details</h3>
                <Form  onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formFullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" value={user.gmail} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formBirthDate">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                            type="text"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                          />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formGender">
                        <Form.Label>Gender</Form.Label>
                       <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Prefer not to say</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Fade>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;