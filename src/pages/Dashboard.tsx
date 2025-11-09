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
  Alert
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { requestsAPI, usersAPI } from '../services/api';
import { ApprovalRequest, User, NewRequestData } from '../types';
import RequestForm from '../components/requests/RequestForm';

const ConnectionDiagnostic: React.FC<{ onCheckConnection: () => void }> = ({ onCheckConnection }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

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
    <Card className="mb-4 border-0 bg-light">
      <Card.Body className="py-3">
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
            {backendStatus === 'connected' && dbStatus === 'connected' && (
              <small className="text-success mt-1 d-block">
                ✅ El frontend está conectado correctamente al backend y la base de datos
              </small>
            )}
          </div>
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={handleCheck}
            className="d-flex align-items-center gap-1"
          >
            🔄 Probar Conexión
          </Button>
        </div>
      </Card.Body>
    </Card>
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
  const [connectionChecked, setConnectionChecked] = useState(false);
  const currentUser: User = {
    id: 1,
    username: 'juan.perez',
    email: 'juan.perez@empresa.com',
    full_name: 'Juan Pérez',
    role: 'user'
  };

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
      
      console.log('✅ [DASHBOARD] Datos cargados del backend:', {
        requestsCount: requestsResponse.data?.length || 0,
        usersCount: usersResponse.data?.length || 0
      });
      
      setRequests(requestsResponse.data || []);
      setUsers(usersResponse.data || []);
      setConnectionChecked(true);
      
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
      console.log('📤 [DASHBOARD] Enviando nueva solicitud al backend:', {
        ...requestData,
        timestamp: new Date().toISOString()
      });
      
      const response = await requestsAPI.create(requestData);
      
      setSuccessMessage(`✅ Solicitud creada exitosamente! ID: ${response.data?.id || 'Nuevo'}`);
      setTimeout(() => setSuccessMessage(''), 5000);
      await loadData();
      
      return response;
    } catch (err: any) {
      console.error('❌ [DASHBOARD] Error creando solicitud:', {
        message: err.message,
        error: err
      });
      throw new Error(err.message || 'No se pudo crear la solicitud. Verifica que el backend esté funcionando en http://localhost:3001');
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
      class: 'stat-pending',
      description: 'Esperando aprobación'
    },
    { 
      title: 'Aprobadas', 
      value: stats.approved, 
      variant: 'success', 
      icon: '✅', 
      class: 'stat-approved',
      description: 'Solicitudes aprobadas'
    },
    { 
      title: 'Rechazadas', 
      value: stats.rejected, 
      variant: 'danger', 
      icon: '❌', 
      class: 'stat-rejected',
      description: 'Solicitudes rechazadas'
    },
    { 
      title: 'Total', 
      value: stats.total, 
      variant: 'primary', 
      icon: '📊', 
      class: 'stat-total',
      description: 'Total de solicitudes'
    }
  ];

  if (loading) {
    return (
      <Container fluid="xl" className="py-5">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" className="mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <h5 className="text-muted">Cargando sistema de aprobaciones...</h5>
          <p className="text-muted small">Conectando con el servidor</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid="xl" className="py-4">
      {/* Mensajes de alerta */}
      {error && (
        <Alert variant="warning" className="mb-4" dismissible onClose={() => setError('')}>
          <Alert.Heading>⚠️ Error de Conexión</Alert.Heading>
          {error}
          <hr />
          <div className="mb-0">
            <strong>Para solucionar:</strong>
            <ol className="mb-0 mt-2">
              <li>Asegúrate de que el backend esté corriendo en <code>http://localhost:3001</code></li>
              <li>Verifica que la base de datos MySQL esté funcionando</li>
              <li>Haz clic en "Probar Conexión" abajo</li>
            </ol>
          </div>
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>✅ Éxito</Alert.Heading>
          {successMessage}
          <hr />
          <div className="mb-0">
            <strong>¿Qué pasó?</strong>
            <ul className="mb-0 mt-2">
              <li>La solicitud se envió al backend</li>
              <li>Se guardó en la base de datos MySQL</li>
              <li>La tabla se actualizó automáticamente</li>
              <li>El contador "Total" aumentó en 1</li>
            </ul>
          </div>
        </Alert>
      )}

      {/* Diagnóstico de conexión */}
      <ConnectionDiagnostic onCheckConnection={loadData} />

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 fw-bold text-primary mb-2">
                {connectionChecked ? '🚀 Sistema de Aprobaciones' : '🔄 Conectando...'}
              </h1>
              <p className="text-muted mb-0">
                {connectionChecked 
                  ? 'Centraliza y gestiona todas las solicitudes de tu equipo' 
                  : 'Estableciendo conexión con el servidor...'
                }
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={loadData}
                className="d-flex align-items-center"
              >
                <span className="me-2">🔄</span>
                Actualizar
              </Button>
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleShowModal}
                className="d-flex align-items-center px-4"
              >
                <span className="me-2">➕</span>
                Nueva Solicitud
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Estadísticas */}
      <Row className="mb-5">
        {statCards.map((stat, index) => (
          <Col xs={12} sm={6} lg={3} key={index} className="mb-4">
            <Card className={`h-100 border-0 shadow-sm hover-lift transition-all ${stat.class}`}>
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
                  📋 Solicitudes {connectionChecked ? 'Reales' : 'de Demo'}
                </h5>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg="light" text="dark" className="fs-6">
                    {requests.length} solicitudes
                  </Badge>
                  {!connectionChecked && (
                    <Badge bg="warning" text="dark">
                      Modo Demo
                    </Badge>
                  )}
                </div>
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
                          <td className="fw-bold text-primary">{request.request_id}</td>
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
                              <br />
                              <small className="text-muted">
                                {new Date(request.created_at).toLocaleTimeString()}
                              </small>
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

      {/* Modal de Nueva Solicitud */}
      <RequestForm
        show={showModal}
        onHide={handleCloseModal}
        onSubmit={handleCreateRequest}
        currentUser={currentUser}
      />
    </Container>
  );
};

export default Dashboard;