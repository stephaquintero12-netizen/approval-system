import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Form, 
  Alert, 
  Spinner,
  ListGroup,
  Modal
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { requestsAPI } from '../services/api';
import { ApprovalRequest, RequestHistory, User } from '../types';

const RequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ApprovalRequest | null>(null);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | ''>('');
  const [comment, setComment] = useState('');
  const currentUser: User = {
    id: 2,
    username: 'maria.garcia',
    email: 'maria.garcia@empresa.com',
    full_name: 'María García',
    role: 'user'
  };

  useEffect(() => {
    if (id) {
      loadRequestData();
    }
  }, [id]);

  const loadRequestData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [requestResponse, historyResponse] = await Promise.all([
        requestsAPI.getById(Number(id)),
        requestsAPI.getHistory(Number(id))
      ]);
      
      setRequest(requestResponse.data);
      setHistory(historyResponse.data || []);
      
    } catch (err: any) {
      setError('Error al cargar los datos de la solicitud');
    } finally {
      setLoading(false);
    }
  };

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'despliegue': return '🚀';
      case 'acceso': return '🔑';
      case 'cambio': return '⚙️';
      case 'herramienta': return '🛠️';
      default: return '📄';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'despliegue': return 'Despliegue';
      case 'acceso': return 'Acceso';
      case 'cambio': return 'Cambio Técnico';
      case 'herramienta': return 'Nueva Herramienta';
      default: return type;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return '📝';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'commented': return '💬';
      default: return '📄';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'created': return 'creó la solicitud';
      case 'approved': return 'aprobó la solicitud';
      case 'rejected': return 'rechazó la solicitud';
      case 'commented': return 'comentó';
      default: return action;
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
    return new Date(dateString).toLocaleString('es-ES');
  };

  if (loading) {
    return (
      <Container fluid="xl" className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando solicitud ID: {id}...</p>
        </div>
      </Container>
    );
  }

  if (!request) {
    return (
      <Container fluid="xl" className="py-4">
        <Alert variant="danger">
          No se pudo encontrar la solicitud con ID: {id}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/')}>
          Volver al Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid="xl" className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/')}
                className="mb-3"
              >
                ← Volver al Dashboard
              </Button>
              <h1 className="h2 fw-bold text-dark">{request.title}</h1>
              <div className="d-flex gap-2 align-items-center">
                <Badge bg={getStatusVariant(request.status)} className="fs-6">
                  {getStatusText(request.status)}
                </Badge>
                <span className="text-muted">
                  ID: {request.request_id} • Creado: {formatDate(request.created_at)}
                </span>
              </div>
            </div>
            
            {/* SE ELIMINARON LOS BOTONES DE APROBAR Y RECHAZAR */}
            {/* Solo se muestra información del estado */}
            <div className="text-end">
              <Badge bg={getStatusVariant(request.status)} className="fs-6 p-2">
                Estado: {getStatusText(request.status)}
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        {/* Información de la Solicitud */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-semibold">📋 Información de la Solicitud</h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>Título:</strong>
                  <p className="mb-2">{request.title}</p>
                </Col>
                <Col sm={6}>
                  <strong>Tipo:</strong>
                  <p className="mb-2">
                    <Badge bg="outline-secondary" text="dark" className="d-flex align-items-center gap-1" style={{width: 'fit-content'}}>
                      <span>{getTypeIcon(request.request_type)}</span>
                      {getTypeText(request.request_type)}
                    </Badge>
                  </p>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col sm={6}>
                  <strong>Prioridad:</strong>
                  <p className="mb-2">
                    <Badge bg={getPriorityVariant(request.priority)}>
                      {getPriorityText(request.priority)}
                    </Badge>
                  </p>
                </Col>
                <Col sm={6}>
                  <strong>Fecha de creación:</strong>
                  <p className="mb-2">{formatDate(request.created_at)}</p>
                </Col>
              </Row>

              <div className="mb-3">
                <strong>Descripción:</strong>
                <p className="mt-2 text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                  {request.description}
                </p>
              </div>

              <Row>
                <Col sm={6}>
                  <strong>Solicitante:</strong>
                  <p className="mb-2 fw-medium">
                    {request.requester_name || `Usuario ${request.requester_id}`}
                  </p>
                </Col>
                <Col sm={6}>
                  <strong>Aprobador:</strong>
                  <p className="mb-2 fw-medium">
                    {request.approver_name || `Usuario ${request.approver_id}`}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Panel de Historial y Acciones */}
        <Col lg={4}>
          {/* Panel de Historial */}
          <Card className="mb-4">
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-semibold">🕒 Historial de la Solicitud</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {history.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No hay historial disponible</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {history.map((item) => (
                    <ListGroup.Item key={item.id} className="border-0">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <span style={{ fontSize: '1.2rem' }}>
                            {getActionIcon(item.action)}
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <strong>{item.full_name || item.username}</strong>
                            <small className="text-muted">
                              {new Date(item.created_at).toLocaleTimeString()}
                            </small>
                          </div>
                          <p className="mb-1">
                            {getActionText(item.action)}
                            {item.comment && (
                              <span className="text-muted">: "{item.comment}"</span>
                            )}
                          </p>
                          <small className="text-muted">
                            {new Date(item.created_at).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>

          {/* Información de Estado */}
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0 fw-semibold">📊 Estado Actual</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <div className={`text-${getStatusVariant(request.status)} mb-3`}>
                  <span style={{ fontSize: '3rem' }}>
                    {request.status === 'pending' && '⏳'}
                    {request.status === 'approved' && '✅'}
                    {request.status === 'rejected' && '❌'}
                  </span>
                </div>
                <h4 className={`text-${getStatusVariant(request.status)}`}>
                  {getStatusText(request.status)}
                </h4>
                <p className="text-muted small">
                  {request.status === 'pending' && 'Esperando aprobación'}
                  {request.status === 'approved' && 'Solicitud aprobada'}
                  {request.status === 'rejected' && 'Solicitud rechazada'}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RequestDetail;