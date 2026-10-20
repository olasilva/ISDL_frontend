// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminApp from './admin/AdminApp';

// Auth Pages
import ClientLogin from './pages/ClientLogin';
import ClientSignUp from './pages/ClientSignUp';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import ClientDashboard from './pages/ClientDashboard';

import LiveChat from './components/LiveChat';

function LiveChatWrapper() {
  if (window.location.pathname.startsWith('/admin')) return null;
  return <LiveChat />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* Client Auth */}
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/signup" element={<ClientSignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        
        {/* Client Dashboard */}
        <Route path="/dashboard" element={<ClientDashboard />} />
        
        {/* Public Site */}
        <Route path="/*" element={<Home />} />
      </Routes>
      <LiveChatWrapper />
    </BrowserRouter>
  );
}