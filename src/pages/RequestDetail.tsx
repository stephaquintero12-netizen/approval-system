import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Form,
  ListGroup,
  Alert
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const mockRequest = {
  id: 'REQ-001',
  title: 'Despliegue Microservicio Usuarios v2.1',
  description: 'Se requiere aprobación para desplegar la versión 2.1 del microservicio de usuarios que incluye nuevas funcionalidades de autenticación y mejoras en el rendimiento.',
  requester: 'juan.perez',
  approver: 'maria.garcia',
  requestType: 'despliegue',
  status: 'pending',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  history: [
    {
      id: 1,
      action: 'created',
      user: 'juan.perez',
      comment: 'Solicitud creada',
      timestamp: '2024-01-15T10:30:00Z'
    }
  ]
};

const RequestDetail: React.FC = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [request, setRequest] = useState(mockRequest);
  const [comment, setComment] = useState('');
  const [showApprovalButtons, setShowApprovalButtons] = useState(true);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'despliegue': return '🚀 Despliegue';
      case 'acceso': return '🔑 Acceso';
      case 'cambio': return '🛠️ Cambio Técnico';
      case 'herramienta': return '📦 Nueva Herramienta';
      default: return type;
    }
  };

  const handleApprove = () => {
    setRequest(prev => ({
      ...prev,
      status: 'approved',
      updatedAt: new Date().toISOString(),
      history: [
        ...prev.history,
        {
          id: prev.history.length + 1,
          action: 'approved',
          user: 'usuario.actual',
          comment: comment || 'Solicitud aprobada',
          timestamp: new Date().toISOString()
        }
      ]
    }));
    setComment('');
    setShowApprovalButtons(false);
  };

  const handleReject = () => {
    setRequest(prev => ({
      ...prev,
      status: 'rejected',
      updatedAt: new Date().toISOString(),
      history: [
        ...prev.history,
        {
          id: prev.history.length + 1,
          action: 'rejected',
          user: 'usuario.actual',
          comment: comment || 'Solicitud rechazada',
          timestamp: new Date().toISOString()
        }
      ]
    }));
    setComment('');
    setShowApprovalButtons(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  return (
    <Container fluid="xl" className="py-4">
      {/* Header y Navegación */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/')}
                className="mb-3"
              >
                ← Volver al Dashboard
              </Button>
              <h1 className="h2 fw-bold text-dark">Detalle de Solicitud</h1>
              <p className="text-muted">ID: {request.id}</p>
            </div>
            <Badge bg={getStatusVariant(request.status)} className="fs-6 px-3 py-2">
              {getStatusText(request.status)}
            </Badge>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Columna izquierda - Información de la solicitud */}
        <Col lg={8} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-white">
              <h5 className="card-title mb-0 fw-semibold">📋 Información de la Solicitud</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>Tipo:</strong>
                  <br />
                  <span className="text-muted">{getTypeText(request.requestType)}</span>
                </Col>
                <Col sm={6}>
                  <strong>Fecha de creación:</strong>
                  <br />
                  <span className="text-muted">{formatDate(request.createdAt)}</span>
                </Col>
              </Row>

              <div className="mb-3">
                <strong>Título:</strong>
                <br />
                <span className="text-muted">{request.title}</span>
              </div>

              <div className="mb-3">
                <strong>Descripción:</strong>
                <br />
                <p className="text-muted mt-2">{request.description}</p>
              </div>

              <Row>
                <Col sm={6}>
                  <strong>Solicitante:</strong>
                  <br />
                  <Badge bg="primary" className="mt-1">
                    {request.requester}
                  </Badge>
                </Col>
                <Col sm={6}>
                  <strong>Aprobador:</strong>
                  <br />
                  <Badge bg="info" className="mt-1">
                    {request.approver}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna derecha - Acciones e Historial */}
        <Col lg={4}>
          {/* Panel de Aprobación (solo si está pendiente y el usuario es el aprobador) */}
          {request.status === 'pending' && showApprovalButtons && (
            <Card className="mb-4 border-warning">
              <Card.Header className="bg-warning text-dark">
                <h6 className="mb-0 fw-semibold">⏳ Acción Requerida</h6>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Comentario (opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Agrega un comentario sobre tu decisión..."
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button variant="success" onClick={handleApprove}>
                    ✅ Aprobar Solicitud
                  </Button>
                  <Button variant="danger" onClick={handleReject}>
                    ❌ Rechazar Solicitud
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Panel de Historial */}
          <Card>
            <Card.Header className="bg-white">
              <h6 className="mb-0 fw-semibold">📊 Historial de la Solicitud</h6>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {request.history.map((event) => (
                  <ListGroup.Item key={event.id} className="border-0">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className={`rounded-circle bg-${getStatusVariant(event.action)} d-flex align-items-center justify-content-center`} style={{width: '32px', height: '32px'}}>
                          {event.action === 'created' && '📝'}
                          {event.action === 'approved' && '✅'}
                          {event.action === 'rejected' && '❌'}
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="fw-semibold">
                          {event.action === 'created' && 'Solicitud creada'}
                          {event.action === 'approved' && 'Solicitud aprobada'}
                          {event.action === 'rejected' && 'Solicitud rechazada'}
                        </div>
                        <small className="text-muted">
                          Por {event.user} • {formatDate(event.timestamp)}
                        </small>
                        {event.comment && (
                          <div className="mt-1 p-2 bg-light rounded">
                            <small>{event.comment}</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RequestDetail;