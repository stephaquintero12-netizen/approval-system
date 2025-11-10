import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Table,
  Alert,
  Modal,
  Form,
  Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { requestsAPI } from '../services/api';
import { ApprovalRequest, User, ApprovalActionData } from '../types';

const ApprovalInbox: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | ''>('');
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);

  const currentUser: User = {
    id: 2,
    username: 'maria.garcia',
    email: 'maria.garcia@empresa.com',
    full_name: 'María García',
    role: 'user'
  };

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await requestsAPI.getAll();
      const allRequests: ApprovalRequest[] = response.data || [];
      
      const pendingRequests = allRequests.filter(request => 
        request.status === 'pending' && request.approver_id === currentUser.id
      );
      
      setRequests(pendingRequests);
      
    } catch (err: any) {
      setError('Error al cargar las solicitudes pendientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (request: ApprovalRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setComment('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSelectedRequest(null);
      setActionType('');
      setComment('');
    }, 300);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      setProcessing(true);
      setError('');

      const actionData: ApprovalActionData = {
        user_id: currentUser.id,
        comment: comment || (actionType === 'approve' ? 'Solicitud aprobada' : 'Solicitud rechazada')
      };

      if (actionType === 'approve') {
        await requestsAPI.approve(selectedRequest.id, actionData);
      } else {
        await requestsAPI.reject(selectedRequest.id, actionData);
      }

      setShowModal(false);
      setTimeout(() => {
        loadPendingRequests();
      }, 500);
      
      const successMsg = actionType === 'approve' 
        ? `✅ Solicitud #${selectedRequest.request_id} aprobada correctamente` 
        : `❌ Solicitud #${selectedRequest.request_id} rechazada correctamente`;
      
      setSuccess(successMsg);

      setTimeout(() => {
        setSuccess('');
      }, 5000);
      
    } catch (err: any) {
      setError('Error al procesar la acción: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetail = (requestId: number) => {
    navigate(`/request/${requestId}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'despliegue': return '🚀';
      case 'acceso': return '🔑';
      case 'cambio': return '⚙️';
      case 'herramienta': return '🛠️';
      default: return '📄';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      default: return 'secondary';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <Container fluid="xl" className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5 className="text-muted">Cargando bandeja de aprobación...</h5>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid="xl" className="py-4">
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
              <h1 className="h2 fw-bold text-dark mb-2">📬 Bandeja de Aprobación</h1>
              <p className="text-muted mb-0">
                Solicitudes pendientes que requieren tu revisión
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Badge bg="warning" text="dark" className="fs-6">
                {requests.length} pendientes
              </Badge>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={loadPendingRequests}
              >
                🔄 Actualizar
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {requests.length === 0 ? (
        <Alert variant="success" className="text-center">
          <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>🎉</div>
          <h5 className="text-muted">¡No hay solicitudes pendientes!</h5>
          <p className="text-muted mb-4">Tu bandeja de aprobación está al día</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            📊 Ir al Dashboard
          </Button>
        </Alert>
      ) : (
        <Row>
          <Col>
            <Card className="shadow-sm">
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
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, index) => (
                      <tr key={`request-${request.id}-${index}`}>
                        <td className="fw-bold text-primary">{request.request_id}</td>
                        <td>
                          <div>
                            <div className="fw-semibold">{request.title}</div>
                            <small className="text-muted">
                              {request.description.substring(0, 60)}...
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <span>{getTypeIcon(request.request_type)}</span>
                            <span>{request.request_type}</span>
                          </div>
                        </td>
                        <td>
                          <Badge bg="primary">
                            {request.requester_name || `Usuario ${request.requester_id}`}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getPriorityVariant(request.priority)}>
                            {getPriorityText(request.priority)}
                          </Badge>
                        </td>
                        <td>{formatDate(request.created_at)}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => openModal(request, 'approve')}
                              disabled={processing}
                            >
                              ✅ Aprobar
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => openModal(request, 'reject')}
                              disabled={processing}
                            >
                              ❌ Rechazar
                            </Button>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewDetail(request.id)}
                            >
                              👁️ Ver
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

      {/* Modal simplificado */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton className={actionType === 'approve' ? 'bg-success text-white' : 'bg-danger text-white'}>
          <Modal.Title>
            {actionType === 'approve' ? '✅ Confirmar Aprobación' : '❌ Confirmar Rechazo'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div className="mb-3">
              <h6>Solicitud: {selectedRequest.request_id}</h6>
              <p className="mb-2">{selectedRequest.title}</p>
              <small className="text-muted">
                Solicitante: {selectedRequest.requester_name || `Usuario ${selectedRequest.requester_id}`}
              </small>
            </div>
          )}
          
          <Form.Group>
            <Form.Label>
              {actionType === 'approve' ? 'Comentario (opcional)' : 'Comentario (recomendado)'}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={
                actionType === 'approve' 
                  ? 'Agregar un comentario opcional...' 
                  : 'Explicar por qué se rechaza la solicitud...'
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={processing}>
            Cancelar
          </Button>
          <Button 
            variant={actionType === 'approve' ? 'success' : 'danger'}
            onClick={handleConfirmAction}
            disabled={processing}
          >
            {processing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : (
              actionType === 'approve' ? '✅ Aprobar' : '❌ Rechazar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ApprovalInbox;