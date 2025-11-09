import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">
                Sistema de Aprobaciones
              </h1>
            </div>
          </div>

          <nav className="hidden md:block">
            <div className="flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Mis Solicitudes
              </a>
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Pendientes
              </a>
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Historial
              </a>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="relative p-1 text-gray-400 hover:text-gray-600">
              <FaBell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 bg-red-400 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-2">
              <FaUserCircle className="h-8 w-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                usuario@empresa.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
