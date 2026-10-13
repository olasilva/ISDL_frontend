import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AdminApp from './admin/AdminApp';
import LiveChat from './components/LiveChat';

function LiveChatWrapper() {
  const location = useLocation();
  // Hide the chat widget inside the admin area
  if (location.pathname.startsWith('/admin')) return null;
  return <LiveChat />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<Home />} />
      </Routes>
      <LiveChatWrapper />
    </BrowserRouter>
  );
}