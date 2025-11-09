import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { usersAPI } from '../../services/api';
import { NewRequestData, User } from '../../types';

interface RequestFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: NewRequestData) => void;
  currentUser: User;
}

const RequestForm: React.FC<RequestFormProps> = ({ show, onHide, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState<NewRequestData>({
    title: '',
    description: '',
    request_type: 'despliegue',
    priority: 'medium',
    requester_id: 0,
    approver_id: 0
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const directUsers: User[] = [
    { id: 1, username: 'juan.perez', email: 'juan.perez@empresa.com', full_name: 'Juan Pérez', role: 'user' },
    { id: 2, username: 'maria.garcia', email: 'maria.garcia@empresa.com', full_name: 'María García', role: 'user' },
    { id: 3, username: 'carlos.lopez', email: 'carlos.lopez@empresa.com', full_name: 'Carlos López', role: 'user' },
    { id: 4, username: 'ana.martinez', email: 'ana.martinez@empresa.com', full_name: 'Ana Martínez', role: 'user' },
    { id: 5, username: 'admin', email: 'admin@empresa.com', full_name: 'Administrador', role: 'admin' }
  ];

  useEffect(() => {
    if (show) {
      loadUsers();
      setFormData(prev => ({
        ...prev,
        requester_id: currentUser.id
      }));
    }
  }, [show, currentUser]);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      
      if (response && response.data) {
        setUsers(response.data);
      } else {
        setUsers(directUsers);
      }
    } catch (err) {
      setUsers(directUsers);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.title.trim()) {
        setError('El título es obligatorio');
        return;
      }
      if (!formData.description.trim()) {
        setError('La descripción es obligatoria');
        return;
      }
      if (!formData.approver_id) {
        setError('Debes seleccionar un aprobador');
        return;
      }

      await onSubmit(formData);
      onHide();
      setFormData({
        title: '',
        description: '',
        request_type: 'despliegue',
        priority: 'medium',
        requester_id: currentUser.id,
        approver_id: 0
      });
    } catch (err: any) {
      setError(err.message || 'Error al crear la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof NewRequestData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const availableUsers = users.filter(user => user.id !== currentUser.id);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>📝 Nueva Solicitud de Aprobación</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Título *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Título de la solicitud"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo *</Form.Label>
                <Form.Select
                  value={formData.request_type}
                  onChange={(e) => handleChange('request_type', e.target.value)}
                  required
                >
                  <option value="despliegue">🚀 Despliegue</option>
                  <option value="acceso">🔑 Acceso</option>
                  <option value="cambio">⚙️ Cambio</option>
                  <option value="herramienta">🛠️ Herramienta</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Descripción *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Descripción detallada"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Prioridad</Form.Label>
                <Form.Select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  <option value="low">🟢 Baja</option>
                  <option value="medium">🟡 Media</option>
                  <option value="high">🔴 Alta</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Aprobador *</Form.Label>
                <Form.Select
                  value={formData.approver_id}
                  onChange={(e) => handleChange('approver_id', parseInt(e.target.value))}
                  required
                >
                  <option value={0}>Selecciona un aprobador</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.role})
                    </option>
                  ))}
                </Form.Select>
                {availableUsers.length === 0 && users.length > 0 && (
                  <Form.Text className="text-warning">
                    No hay otros usuarios disponibles para aprobar
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Solicitante</Form.Label>
            <Form.Control
              type="text"
              value={currentUser.full_name}
              disabled
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RequestForm;