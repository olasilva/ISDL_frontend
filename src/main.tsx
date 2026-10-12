// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'boxicons/css/boxicons.min.css'   // ← Add this line
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)