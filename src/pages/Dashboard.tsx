import React from 'react';
import { FaPlus, FaClock, FaCheck, FaTimes } from 'react-icons/fa';

// Datos de ejemplo
const mockStats = {
  pending: 3,
  approved: 12,
  rejected: 2,
  total: 17
};

const mockRequests = [
  {
    id: 'REQ-001',
    title: 'Despliegue Microservicio Usuarios',
    type: 'despliegue',
    status: 'pending',
    requester: 'juan.perez',
    approver: 'maria.garcia',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'REQ-002',
    title: 'Acceso a Base de Datos',
    type: 'acceso',
    status: 'approved',
    requester: 'carlos.lopez',
    approver: 'ana.martinez',
    createdAt: '2024-01-14T14:20:00Z'
  }
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de solicitudes de aprobación</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <FaPlus />
          <span>Nueva Solicitud</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaClock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aprobadas</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FaTimes className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rechazadas</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.rejected}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FaCheck className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Solicitudes Recientes */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Solicitudes Recientes</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockRequests.map((request) => (
            <div key={request.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    request.status === 'pending' ? 'bg-yellow-400' :
                    request.status === 'approved' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{request.title}</h3>
                    <p className="text-sm text-gray-500">
                      {request.id} • Solicitado por {request.requester}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 capitalize">{request.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
