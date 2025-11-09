import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';

const History: React.FC = () => {
  return (
    <Container fluid="xl" className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2 fw-bold text-dark">📊 Historial Completo</h1>
          <p className="text-muted">Todas las solicitudes del sistema</p>
        </Col>
      </Row>

      <Alert variant="info" className="text-center">
        <h5>🚧 Página en Construcción</h5>
        <p className="mb-0">
          El historial completo estará disponible en la siguiente versión.
        </p>
      </Alert>
    </Container>
  );
};

export default History;
