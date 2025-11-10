import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge,
  Table,
  Spinner,
  Alert,
  Collapse
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { requestsAPI, usersAPI } from '../services/api';
import { ApprovalRequest, User, NewRequestData } from '../types';
import RequestForm from '../components/requests/RequestForm';

const ConnectionDiagnostic: React.FC<{ onCheckConnection: () => void }> = ({ onCheckConnection }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setBackendStatus('checking');
      setDbStatus('checking');

      const response = await fetch('http://localhost:3001/api/health');
      if (response.ok) {
        setBackendStatus('connected');
        checkDatabaseConnection();
      } else {
        setBackendStatus('error');
        setDbStatus('error');
      }
    } catch (error) {
      setBackendStatus('error');
      setDbStatus('error');
    }
  };

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/requests');
      if (response.ok) {
        const data = await response.json();
        setDbStatus('connected');
      } else {
        setDbStatus('error');
      }
    } catch (error) {
      setDbStatus('error');
    }
  };

  const handleCheck = () => {
    onCheckConnection();
    checkBackendConnection();
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <small className="text-muted">Estado del sistema</small>
        <Button 
          variant="link" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
          className="p-0 text-decoration-none"
        >
          <small>{showDetails ? '▲ Ocultar' : '▼ Detalles'}</small>
        </Button>
      </div>
      
      <Collapse in={showDetails}>
        <div>
          <Card className="border-0 bg-light">
            <Card.Body className="py-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">🔍 Estado de la Conexión</h6>
                  <div className="d-flex gap-3">
                    <small>
                      <Badge bg={backendStatus === 'connected' ? 'success' : backendStatus === 'checking' ? 'warning' : 'danger'}>
                        {backendStatus === 'connected' ? '✅ Backend Conectado' : backendStatus === 'checking' ? '🔄 Verificando Backend' : '❌ Backend Desconectado'}
                      </Badge>
                    </small>
                    <small>
                      <Badge bg={dbStatus === 'connected' ? 'success' : dbStatus === 'checking' ? 'warning' : 'danger'}>
                        {dbStatus === 'connected' ? '✅ BD Conectada' : dbStatus === 'checking' ? '🔄 Verificando BD' : '❌ BD Desconectada'}
                      </Badge>
                    </small>
                  </div>
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={handleCheck}
                  className="d-flex align-items-center gap-1"
                >
                  🔄 Probar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Collapse>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [requestsResponse, usersResponse] = await Promise.all([
        requestsAPI.getAll(),
        usersAPI.getAll()
      ]);
      
      setRequests(requestsResponse.data || []);
      setUsers(usersResponse.data || []);
      
    } catch (err: any) {
      setError('No se pudo conectar con el backend: ' + err.message);
      setRequests([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (requestData: NewRequestData) => {
    try {
      const response = await requestsAPI.create(requestData);
      setSuccessMessage(`✅ Solicitud creada exitosamente!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadData();
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'No se pudo crear la solicitud');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError('');
  };

  const handleShowModal = () => setShowModal(true);

  const handleViewDetail = (requestId: number) => {
    navigate(`/request/${requestId}`);
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

  const stats = {
    pending: requests.filter(req => req.status === 'pending').length,
    approved: requests.filter(req => req.status === 'approved').length,
    rejected: requests.filter(req => req.status === 'rejected').length,
    total: requests.length
  };

  const statCards = [
    { 
      title: 'Pendientes', 
      value: stats.pending, 
      variant: 'warning', 
      icon: '⏳',
      description: 'Esperando aprobación'
    },
    { 
      title: 'Aprobadas', 
      value: stats.approved, 
      variant: 'success', 
      icon: '✅',
      description: 'Solicitudes aprobadas'
    },
    { 
      title: 'Rechazadas', 
      value: stats.rejected, 
      variant: 'danger', 
      icon: '❌',
      description: 'Solicitudes rechazadas'
    },
    { 
      title: 'Total', 
      value: stats.total, 
      variant: 'primary', 
      icon: '📊',
      description: 'Total de solicitudes'
    }
  ];

  if (loading) {
    return (
      <Container fluid="xl" className="py-5">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5 className="text-muted">Cargando...</h5>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid="xl" className="py-4">
      {/* Mensajes de alerta */}
      {error && (
        <Alert variant="warning" className="mb-4" dismissible onClose={() => setError('')}>
          <strong>⚠️ Error de Conexión</strong>
          <div className="mt-2">
            <small>Asegúrate de que el backend esté corriendo en http://localhost:3001</small>
          </div>
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      {/* Header simplificado */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 fw-bold text-dark mb-2">Dashboard</h1>
              <p className="text-muted mb-0">
                Resumen de solicitudes del sistema • {requests.length} solicitudes cargadas
              </p>
            </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleShowModal}
              className="d-flex align-items-center px-4"
            >
              <span className="me-2"></span>
              Nueva Solicitud
            </Button>
          </div>
        </Col>
      </Row>

      {/* Estadísticas */}
      <Row className="mb-5">
        {statCards.map((stat, index) => (
          <Col xs={12} sm={6} lg={3} key={index} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className={`text-${stat.variant} mb-3`}>
                  <span style={{ fontSize: '2.5rem' }}>{stat.icon}</span>
                </div>
                <h2 className={`fw-bold text-${stat.variant} mb-2`}>{stat.value}</h2>
                <h6 className="card-title text-dark mb-1">{stat.title}</h6>
                <p className="text-muted small mb-0">{stat.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tabla de Solicitudes */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-semibold text-dark">
                  Solicitudes Recientes
                </h5>
                <Badge bg="light" text="dark" className="fs-6">
                  {requests.length} total
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {requests.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>📭</div>
                  <h5 className="text-muted">No hay solicitudes</h5>
                  <p className="text-muted mb-4">Crea tu primera solicitud de aprobación</p>
                  <Button variant="primary" onClick={handleShowModal}>
                    ➕ Crear Primera Solicitud
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0">ID</th>
                        <th className="border-0">Título</th>
                        <th className="border-0">Tipo</th>
                        <th className="border-0">Prioridad</th>
                        <th className="border-0">Solicitante</th>
                        <th className="border-0">Aprobador</th>
                        <th className="border-0">Estado</th>
                        <th className="border-0">Fecha</th>
                        <th className="border-0 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request.id} className="align-middle">
                          <td className="fw-bold text-primary">
                            {request.request_id}
                            <br />
                            <small className="text-muted">ID: {request.id}</small>
                          </td>
                          <td>
                            <div>
                              <div className="fw-semibold text-dark">{request.title}</div>
                              <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                                {request.description.substring(0, 50)}...
                              </small>
                            </div>
                          </td>
                          <td>
                            <Badge bg="outline-secondary" text="dark" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                              <span>{getTypeIcon(request.request_type)}</span>
                              {request.request_type}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getPriorityVariant(request.priority)}>
                              {getPriorityText(request.priority)}
                            </Badge>
                          </td>
                          <td className="fw-medium">{request.requester_name || `Usuario ${request.requester_id}`}</td>
                          <td className="fw-medium">{request.approver_name || `Usuario ${request.approver_id}`}</td>
                          <td>
                            <Badge bg={getStatusVariant(request.status)} className="fs-6">
                              {getStatusText(request.status)}
                            </Badge>
                          </td>
                          <td>
                            <div className="text-nowrap">
                              {new Date(request.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="text-center">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewDetail(request.id)}
                              className="d-flex align-items-center gap-1"
                            >
                              <span>👁️</span>
                              Ver
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Diagnóstico de conexión (oculto por defecto) */}
      <ConnectionDiagnostic onCheckConnection={loadData} />

      {/* Modal de Nueva Solicitud */}
      <RequestForm
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleCreateRequest}
        currentUser={{
          id: 1,
          username: 'stephanie.baez',
          email: 'stephanie.baez@empresa.com',
          full_name: 'Stephanie Baez',
          role: 'user'
        }}
      />
    </Container>
  );
};

export default Dashboard;