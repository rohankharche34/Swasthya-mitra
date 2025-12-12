import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PersonCircle } from 'react-bootstrap-icons';
import ThemeToggleButton from './ThemeToggleButton';
import { useTheme } from '../context/ThemeContext';

function AppNavbar({ user, handleLogout }) {
  const { theme } = useTheme();

  const effectiveTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  return (
    <Navbar
      variant={effectiveTheme}
      bg={effectiveTheme === 'dark' ? 'dark' : 'white'}
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/home">
          🩺 <strong>Swasthya Mitra</strong>
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home" className="fw-bold">Home</Nav.Link>
            <Nav.Link as={Link} to="/dashboard" className="fw-bold">Symptom Checker</Nav.Link>
            <Nav.Link as={Link} to="/health-tips" className="fw-bold">Health Tips</Nav.Link>
            <Nav.Link as={Link} to="/reports" className="fw-bold">My Reports</Nav.Link>
            <Nav.Link as={Link} to="/map" className="fw-bold">Nearest Hospitals</Nav.Link>
          </Nav>

          {/* Right side */}
          <Nav className="align-items-center">
            <ThemeToggleButton />

            <NavDropdown
              title={<PersonCircle size={24} />}
              align="end"
              className="ms-2"
            >
              <NavDropdown.Header>
                {user ? (
                  <>
                    {user.name} <br />
                    <small className="text-muted">{user.gmail}</small>
                  </>
                ) : (
                  <>
                    Loading... <br />
                  </>
                )}
              </NavDropdown.Header>

              <NavDropdown.Divider />

              <NavDropdown.Item as={Link} to="/profile">
                View Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/settings">
                Settings
              </NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout} as={Link} to="/login">
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
