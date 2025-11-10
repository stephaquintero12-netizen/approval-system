import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge, 
  Spinner,
  Alert
} from 'react-bootstrap';
import { requestsAPI, usersAPI } from '../services/api';
import { ApprovalRequest, User } from '../types';

interface HistoryItem {
  id: number;
  request_id: number;
  user_id: number;
  user_name: string;
  action: 'created' | 'approved' | 'rejected' | 'updated';
  comment?: string;
  previous_status?: string;
  new_status?: string;
  created_at: string;
  request_title: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      
      const requestsResponse = await requestsAPI.getAll();
      const requests: ApprovalRequest[] = requestsResponse.data || [];
      const usersResponse = await usersAPI.getAll();
      const users: User[] = usersResponse.data || [];
      const generatedHistory: HistoryItem[] = [];
      
      requests.forEach(request => {
        generatedHistory.push({
          id: request.id * 1000 + 1,
          request_id: request.id,
          user_id: request.requester_id,
          user_name: request.requester_name || users.find(u => u.id === request.requester_id)?.full_name || `Usuario ${request.requester_id}`,
          action: 'created',
          comment: 'Solicitud creada',
          new_status: request.status,
          created_at: request.created_at,
          request_title: request.title
        });
        
        if (request.status === 'approved' || request.status === 'rejected') {
          generatedHistory.push({
            id: request.id * 1000 + 2,
            request_id: request.id,
            user_id: request.approver_id,
            user_name: request.approver_name || users.find(u => u.id === request.approver_id)?.full_name || `Usuario ${request.approver_id}`,
            action: request.status as 'approved' | 'rejected',
            comment: request.status === 'approved' ? 'Solicitud aprobada' : 'Solicitud rechazada',
            previous_status: 'pending',
            new_status: request.status,
            created_at: request.updated_at || request.created_at,
            request_title: request.title
          });
        }
      });
      
      generatedHistory.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setHistory(generatedHistory);
      
    } catch (err: any) {
      setError('Error al cargar el historial');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getActionVariant = (action: string) => {
    switch (action) {
      case 'created': return 'primary';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'updated': return 'warning';
      default: return 'secondary';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'created': return 'Creó solicitud';
      case 'approved': return 'Aprobó';
      case 'rejected': return 'Rechazó';
      case 'updated': return 'Actualizó';
      default: return action;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return '📝';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'updated': return '✏️';
      default: return '📄';
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) return <span className="text-muted">-</span>;
    
    const variant = status === 'pending' ? 'warning' : 
                   status === 'approved' ? 'success' : 'danger';
    return <Badge bg={variant}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container fluid="xl" className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando historial...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid="xl" className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="h2 fw-bold text-dark">📊 Historial del Sistema</h1>
          <p className="text-muted">
            Registro de actividades generado a partir de las solicitudes • {history.length} eventos
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">🕒 Línea de Tiempo de Actividades</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {history.length === 0 ? (
                <div className="text-center py-5">
                  <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>📭</div>
                  <h5 className="text-muted">No hay actividades registradas</h5>
                  <p className="text-muted">Las actividades aparecerán cuando se creen solicitudes</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0">Acción</th>
                        <th className="border-0">Usuario</th>
                        <th className="border-0">Solicitud</th>
                        <th className="border-0">Estado Anterior</th>
                        <th className="border-0">Estado Nuevo</th>
                        <th className="border-0">Comentario</th>
                        <th className="border-0">Fecha y Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <Badge 
                              bg={getActionVariant(item.action)} 
                              className="d-flex align-items-center gap-1" 
                              style={{ width: 'fit-content' }}
                            >
                              <span>{getActionIcon(item.action)}</span>
                              {getActionText(item.action)}
                            </Badge>
                          </td>
                          <td className="fw-medium">
                            {item.user_name}
                          </td>
                          <td>
                            <div>
                              <div className="fw-bold text-primary">#{item.request_id}</div>
                              <small className="text-muted">{item.request_title}</small>
                            </div>
                          </td>
                          <td>
                            {item.previous_status ? getStatusBadge(item.previous_status) : '-'}
                          </td>
                          <td>
                            {item.new_status ? getStatusBadge(item.new_status) : '-'}
                          </td>
                          <td>
                            <small className="text-muted">"{item.comment}"</small>
                          </td>
                          <td>
                            <div className="text-nowrap">
                              {new Date(item.created_at).toLocaleDateString()}
                              <br />
                              <small className="text-muted">
                                {new Date(item.created_at).toLocaleTimeString()}
                              </small>
                            </div>
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
    </Container>
  );
};

export default History;