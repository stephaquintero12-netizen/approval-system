import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const MyRequests: React.FC = () => {
  return (
    <Container fluid="xl" className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2 fw-bold text-dark">📋 Mis Solicitudes</h1>
          <p className="text-muted">Solicitudes que has creado</p>
        </Col>
      </Row>

      <Alert variant="info" className="text-center">
        <h5>🚧 Página en Construcción</h5>
        <p className="mb-0">
          Esta funcionalidad estará disponible próximamente. 
          Mientras tanto, puedes usar el Dashboard para ver todas las solicitudes.
        </p>
      </Alert>
    </Container>
  );
};

export default MyRequests;