CREATE DATABASE IF NOT EXISTS approval_system;
USE approval_system;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de solicitudes
CREATE TABLE IF NOT EXISTS requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  request_type ENUM('despliegue', 'acceso', 'cambio', 'herramienta') NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  requester_id INT NOT NULL,
  approver_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (approver_id) REFERENCES users(id)
);

-- Tabla de historial/comentarios
CREATE TABLE IF NOT EXISTS request_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  user_id INT NOT NULL,
  action ENUM('created', 'approved', 'rejected', 'commented') NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insertar datos de ejemplo
INSERT IGNORE INTO users (username, email, password, full_name, role) VALUES
('juan.perez', 'juan.perez@empresa.com', '$2a$10$ExampleHash1', 'Juan Pérez', 'user'),
('maria.garcia', 'maria.garcia@empresa.com', '$2a$10$ExampleHash2', 'María García', 'user'),
('carlos.lopez', 'carlos.lopez@empresa.com', '$2a$10$ExampleHash3', 'Carlos López', 'user'),
('ana.martinez', 'ana.martinez@empresa.com', '$2a$10$ExampleHash4', 'Ana Martínez', 'user'),
('admin', 'admin@empresa.com', '$2a$10$ExampleHash5', 'Administrador', 'admin');

-- Insertar solicitudes de ejemplo
INSERT IGNORE INTO requests (request_id, title, description, request_type, status, priority, requester_id, approver_id) VALUES
('REQ-001', 'Despliegue Microservicio Usuarios v2.1', 'Nueva versión del microservicio de usuarios con mejoras en autenticación', 'despliegue', 'pending', 'high', 1, 2),
('REQ-002', 'Acceso a Base de Datos Producción', 'Solicitud de acceso de lectura a BD producción', 'acceso', 'approved', 'medium', 3, 4),
('REQ-003', 'Cambio Configuración CI/CD', 'Modificación pipeline CI/CD para optimizar despliegues', 'cambio', 'rejected', 'high', 1, 2);

-- Insertar historial
INSERT IGNORE INTO request_history (request_id, user_id, action, comment) VALUES
(1, 1, 'created', 'Solicitud creada para despliegue'),
(2, 3, 'created', 'Necesito acceso para debugging'),
(2, 4, 'approved', 'Aprobado por 30 días'),
(3, 1, 'created', 'Optimización necesaria'),
(3, 2, 'rejected', 'Requiere más análisis');