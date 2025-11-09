import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import RequestDetail from './pages/RequestDetail';
import ApprovalInbox from './pages/ApprovalInbox';
import MyRequests from './pages/MyRequests';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/request/:id" element={<RequestDetail />} />
          <Route path="/approval-inbox" element={<ApprovalInbox />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;