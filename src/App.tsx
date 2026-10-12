// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin panel gets matched first */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* Everything else goes to Home (handles its own internal nav) */}
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}