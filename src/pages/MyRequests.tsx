import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge,
  Table
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { requestsAPI } from '../services/api';
import { ApprovalRequest, User } from '../types';

const MyRequests: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const currentUser: User = {
    id: 1,
    username: 'juan.perez',
    email: 'juan.perez@empresa.com',
    full_name: 'Juan Pérez',
    role: 'user'
  };

  useEffect(() => {
    loadMyRequests();
  }, []);

  const loadMyRequests = async () => {
    try {
      const response = await requestsAPI.getAll();
      const allRequests = response.data || [];
      
      const myRequests = allRequests.filter((request: ApprovalRequest) => 
        request.requester_id === currentUser.id
      );
      
      setRequests(myRequests);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error cargando mis solicitudes:', err);
    }
  };

  const handleCreateNew = () => {
    navigate('/');
  };
  const lastFourRequests = requests.slice(-4);

  return (
    <Container fluid="xl" className="py-4">
      {/* Header simplificado */}
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
              <h1 className="h2 fw-bold text-primary mb-2">📋 Mis Solicitudes</h1>
              <p className="text-muted mb-0">
                Historial de todas las solicitudes que ha creado • Actualizado: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={handleCreateNew}
            >
              ➕ Nueva Solicitud
            </Button>
          </div>
        </Col>
      </Row>

      {/* Tabla con últimos 4 registros - SIN COLUMNA ACCIONES */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Título</th>
                      <th className="border-0">Tipo</th>
                      <th className="border-0">Prioridad</th>
                      <th className="border-0">Aprobador</th>
                      <th className="border-0">Estado</th>
                      <th className="border-0">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastFourRequests.map((request) => (
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
                          <Badge bg="outline-secondary" text="dark">
                            {request.request_type}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={
                            request.priority === 'high' ? 'danger' : 
                            request.priority === 'medium' ? 'warning' : 'success'
                          }>
                            {request.priority}
                          </Badge>
                        </td>
                        <td className="fw-medium">{request.approver_name || `Usuario ${request.approver_id}`}</td>
                        <td>
                          <Badge bg={
                            request.status === 'pending' ? 'warning' : 
                            request.status === 'approved' ? 'success' : 'danger'
                          }>
                            {request.status}
                          </Badge>
                        </td>
                        <td>
                          <div className="text-nowrap">
                            {new Date(request.created_at).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyRequests;