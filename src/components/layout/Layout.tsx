import React from 'react';
import Header from './Header';
import { Container } from 'react-bootstrap';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-vh-100 bg-light">
      <Header />
      <Container fluid="xl" className="py-4">
        {children}
      </Container>
    </div>
  );
};

export default Layout;