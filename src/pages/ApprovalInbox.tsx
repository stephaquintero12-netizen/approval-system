import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Table,
  Alert,
  Form,
  Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const mockPendingRequests = [
  {
    id: 'REQ-001',
    title: 'Despliegue Microservicio Usuarios v2.1',
    type: 'despliegue',
    status: 'pending',
    requester: 'juan.perez',
    approver: 'maria.garcia',
    createdAt: '2024-01-15T10:30:00Z',
    description: 'Nueva versión del microservicio de usuarios con mejoras en autenticación',
    priority: 'high'
  },
  {
    id: 'REQ-004',
    title: 'Acceso a Dashboard de Monitoreo',
    type: 'acceso',
    status: 'pending',
    requester: 'carlos.lopez',
    approver: 'maria.garcia',
    createdAt: '2024-01-16T08:15:00Z',
    description: 'Solicitud de acceso al dashboard de Kibana para monitoreo',
    priority: 'medium'
  },
  {
    id: 'REQ-005',
    title: 'Configuración Nuevo Pipeline CI/CD',
    type: 'cambio',
    status: 'pending',
    requester: 'ana.martinez',
    approver: 'maria.garcia',
    createdAt: '2024-01-16T14:30:00Z',
    description: 'Implementación de nuevo pipeline para servicio de notificaciones',
    priority: 'high'
  }
];

const ApprovalInbox: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(mockPendingRequests);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [comment, setComment] = useState('');
  const handleQuickApprove = (requestId: string) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleQuickReject = (requestId: string) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const handleViewDetail = (requestId: string) => {
    navigate(`/request/${requestId}`);
  };

  const handleApproveWithComment = () => {
    if (selectedRequest) {
      setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      setShowApproveModal(false);
      setComment('');
    }
  };

  const handleRejectWithComment = () => {
    if (selectedRequest) {
      setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      setShowRejectModal(false);
      setComment('');
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'despliegue': return '🚀 Despliegue';
      case 'acceso': return '🔑 Acceso';
      case 'cambio': return '🛠️ Cambio';
      case 'herramienta': return '📦 Herramienta';
      default: return type;
    }
  };

  return (
    <Container fluid="xl" className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 fw-bold text-dark">📬 Bandeja de Aprobación</h1>
              <p className="text-muted">
                Tienes <strong>{requests.length}</strong> solicitudes pendientes de aprobación
              </p>
            </div>
            <Badge bg="warning" className="fs-6 px-3 py-2">
              ⏳ {requests.length} Pendientes
            </Badge>
          </div>
        </Col>
      </Row>

      {/* Alertas si no hay solicitudes */}
      {requests.length === 0 ? (
        <Alert variant="success" className="text-center">
          <h5>🎉 ¡No tienes solicitudes pendientes!</h5>
          <p className="mb-0">Tu bandeja de aprobación está vacía.</p>
        </Alert>
      ) : (
        /* Tabla de solicitudes pendientes */
        <Row>
          <Col>
            <Card className="custom-shadow">
              <Card.Header className="bg-white">
                <h5 className="card-title mb-0 fw-semibold">
                  📋 Solicitudes Pendientes de Tu Aprobación
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Tipo</th>
                      <th>Solicitante</th>
                      <th>Prioridad</th>
                      <th>Fecha</th>
                      <th>Acciones Rápidas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id}>
                        <td className="fw-semibold">{request.id}</td>
                        <td>
                          <div>
                            {request.title}
                            <br />
                            <small className="text-muted">
                              {request.description.substring(0, 60)}...
                            </small>
                          </div>
                        </td>
                        <td>
                          <Badge bg="outline-primary">
                            {getTypeText(request.type)}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="secondary">{request.requester}</Badge>
                        </td>
                        <td>
                          <Badge bg={getPriorityVariant(request.priority)}>
                            {getPriorityText(request.priority)}
                          </Badge>
                        </td>
                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="d-flex gap-1 flex-wrap">
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleQuickApprove(request.id)}
                              title="Aprobar sin comentario"
                            >
                              ✅
                            </Button>
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowApproveModal(true);
                              }}
                              title="Aprobar con comentario"
                            >
                              📝
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRejectModal(true);
                              }}
                              title="Rechazar con comentario"
                            >
                              ❌
                            </Button>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewDetail(request.id)}
                              title="Ver detalles completos"
                            >
                              👁️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal para Aprobar con Comentario */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>✅ Aprobar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Solicitud:</strong> {selectedRequest?.title}
          </p>
          <Form.Group>
            <Form.Label>Comentario (opcional):</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Agrega un comentario para el solicitante..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleApproveWithComment}>
            ✅ Aprobar Solicitud
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Rechazar con Comentario */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>❌ Rechazar Solicitud</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Solicitud:</strong> {selectedRequest?.title}
          </p>
          <Form.Group>
            <Form.Label>Motivo del rechazo:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explica el motivo del rechazo..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRejectWithComment}>
            ❌ Rechazar Solicitud
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ApprovalInbox;