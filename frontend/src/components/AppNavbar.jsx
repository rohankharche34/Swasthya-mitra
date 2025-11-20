import React from 'react';
import { Navbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PersonCircle } from 'react-bootstrap-icons';
import ThemeToggleButton from './ThemeToggleButton'; // <-- Import
import { useTheme } from '../context/ThemeContext'; // <-- Import

function AppNavbar() {
  const { theme } = useTheme(); // Get theme to set navbar variant

  // Determine if the navbar should be light or dark
  const effectiveTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
    : theme;

  return (
    <Navbar 
      variant={effectiveTheme} // Use 'dark' or 'light' for text color
      bg={effectiveTheme === 'dark' ? 'dark' : 'white'} // Use bg class for consistency
      expand="lg" 
      sticky="top" 
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/home">
          🩺 Swasthya Mitra
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Main Nav Links (moved to the left) */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home" className="fw-bold">Home</Nav.Link>
            <Nav.Link as={Link} to="/dashboard" className="fw-bold">Symptom Checker</Nav.Link>
            <Nav.Link as={Link} to="/health-tips" className="fw-bold">Health Tips</Nav.Link>
            <Nav.Link as={Link} to="/reports" className="fw-bold">My Reports</Nav.Link>
          </Nav>
          
          {/* Right-aligned items */}
          <Nav className="align-items-center">
            <ThemeToggleButton /> {/* <-- Add Theme Toggle */}
            
            <NavDropdown 
              title={<PersonCircle size={24} />} 
              align="end" 
              className="ms-2"
            >
              <NavDropdown.Header>
                John Doe <br/>
                <small className="text-muted">john.doe@example.com</small>
              </NavDropdown.Header>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/profile">View Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;