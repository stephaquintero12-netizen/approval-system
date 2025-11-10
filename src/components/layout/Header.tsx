import React from 'react';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const currentUser = {
    name: 'Stephanie Baez',
    email: 'stephanie.baez@empresa.com',
    role: 'Usuario'
  };

  return (
    <Navbar bg="white" expand="lg" className="border-bottom shadow-sm sticky-top">
      <Container fluid="xl">
        <Navbar.Brand 
          className="text-primary fw-bold fs-3"
          onClick={() => handleNavigation('/')}
          style={{ cursor: 'pointer' }}
        >
          🚀 Sistema de Aprobaciones
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as="button"
              className={`fw-semibold mx-2 border-0 bg-transparent ${isActive('/') ? 'text-primary' : 'text-dark'}`}
              onClick={() => handleNavigation('/')}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as="button"
              className={`fw-semibold mx-2 border-0 bg-transparent ${isActive('/my-requests') ? 'text-primary' : 'text-dark'}`}
              onClick={() => handleNavigation('/my-requests')}
            >
              Mis Solicitudes
            </Nav.Link>
            <Nav.Link 
              as="button"
              className={`fw-semibold mx-2 border-0 bg-transparent ${isActive('/approval-inbox') ? 'text-primary' : 'text-dark'}`}
              onClick={() => handleNavigation('/approval-inbox')}
            >
              Bandeja <Badge bg="warning" text="dark" className="ms-1">3</Badge>
            </Nav.Link>
            <Nav.Link 
              as="button"
              className={`fw-semibold mx-2 border-0 bg-transparent ${isActive('/history') ? 'text-primary' : 'text-dark'}`}
              onClick={() => handleNavigation('/history')}
            >
              Historial
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant="outline-primary" 
                id="dropdown-basic"
                className="d-flex align-items-center"
              >
                <span className="me-2">👤</span>
                {currentUser.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header>
                  <div className="fw-bold">{currentUser.name}</div>
                  <small className="text-muted">{currentUser.email}</small>
                  <br />
                  <Badge bg="outline-primary" text="primary" className="mt-1">
                    {currentUser.role}
                  </Badge>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item 
                  className="d-flex align-items-center"
                  onClick={() => alert('Perfil - Próximamente!')}
                >
                  <span className="me-2">👤</span> Mi Perfil
                </Dropdown.Item>
                <Dropdown.Item 
                  className="d-flex align-items-center"
                  onClick={() => alert('Configuración - Próximamente!')}
                >
                  <span className="me-2">⚙️</span> Configuración
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item 
                  className="d-flex align-items-center text-danger"
                  onClick={() => alert('Cerrar sesión - Próximamente!')}
                >
                  <span className="me-2">🚪</span> Cerrar Sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;