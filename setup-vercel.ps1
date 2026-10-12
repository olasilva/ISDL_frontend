# =============================================================================
# Vercel Setup Script for ISDL Website (ASCII-safe)
# Run from project root: C:\Users\user\Desktop\isdl\
# =============================================================================

Write-Host "Starting Vercel setup..." -ForegroundColor Cyan

function Write-File($path, $content) {
    $fullPath = Join-Path $PWD $path
    $dir = Split-Path $fullPath -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    [System.IO.File]::WriteAllText($fullPath, $content, [System.Text.UTF8Encoding]::new($false))
    Write-Host "  [OK] $path" -ForegroundColor Green
}

# =============================================================================
# ROOT FILES
# =============================================================================

Write-Host ""
Write-Host "Creating root config files..." -ForegroundColor Yellow

Write-File ".env" "VITE_API_URL=http://localhost:5000/api`n"

Write-File ".env.production" "VITE_API_URL=https://your-backend.vercel.app/api`n"

$vercelJson = @"
{
  "`$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
"@
Write-File "vercel.json" $vercelJson

Write-File "api/index.js" "import app from '../server/src/server.js';`nexport default app;`n"

# =============================================================================
# SRC FILES
# =============================================================================

Write-Host ""
Write-Host "Creating src/ files..." -ForegroundColor Yellow

Write-File "src/vite-env.d.ts" @'
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
'@

Write-File "src/main.tsx" @'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'boxicons/css/boxicons.min.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
'@

Write-File "src/App.tsx" @'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
'@

Write-File "src/lib/api.ts" @'
import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
'@

Write-File "src/lib/db.ts" @'
import api from './api';

export const messagesApi = {
  create: async (payload) => {
    const res = await api.post('/inbox', payload);
    return res.data;
  },
  list: async () => {
    const res = await api.get('/inbox');
    return res.data.data;
  },
  markRead: async (id) => {
    const res = await api.patch(`/inbox/${id}/read`);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/inbox/${id}`);
    return res.data;
  },
};

export const outreachApi = {
  create: async (payload) => {
    const res = await api.post('/outreach', payload);
    return res.data;
  },
  list: async () => {
    const res = await api.get('/outreach');
    return res.data.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/outreach/${id}`, { status });
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/outreach/${id}`);
    return res.data;
  },
};

export const reviewsApi = {
  listApproved: async () => {
    const res = await api.get('/reviews/approved');
    return res.data.data;
  },
  create: async (payload) => {
    const res = await api.post('/reviews', payload);
    return res.data;
  },
  listAll: async () => {
    const res = await api.get('/reviews');
    return res.data.data;
  },
  approve: async (id, is_approved) => {
    const res = await api.patch(`/reviews/${id}/approve`, { is_approved });
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  },
};

export const updatesApi = {
  listPublished: async () => {
    const res = await api.get('/updates/published');
    return res.data.data;
  },
  listAll: async () => {
    const res = await api.get('/updates');
    return res.data.data;
  },
  create: async (formData) => {
    const res = await api.post('/updates', formData);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/updates/${id}`);
    return res.data;
  },
};

export const add = async (collection, data) => {
  switch (collection) {
    case 'messages':
      return messagesApi.create({
        name: data.name,
        email: data.email,
        message: data.message || data.body || '',
      });
    case 'reviews':
      return reviewsApi.create(data);
    case 'outreach':
      return outreachApi.create(data);
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
};

const POLL_INTERVAL = 5000;

const fetchers = {
  messages: () => messagesApi.list(),
  reviews: () => reviewsApi.listAll(),
  'reviews:approved': () => reviewsApi.listApproved(),
  outreach: () => outreachApi.list(),
  updates: () => updatesApi.listAll(),
  'updates:published': () => updatesApi.listPublished(),
};

export function subscribe(collection, callback) {
  const fetcher = fetchers[collection];
  if (!fetcher) {
    console.warn(`[subscribe] Unknown collection: ${collection}`);
    return () => {};
  }
  let active = true;
  const tick = async () => {
    try {
      const data = await fetcher();
      if (active) callback(data);
    } catch (err) {
      console.error(`[subscribe] Fetch failed for "${collection}":`, err);
    }
  };
  tick();
  const id = setInterval(tick, POLL_INTERVAL);
  return () => {
    active = false;
    clearInterval(id);
  };
}
'@

Write-File "src/hooks/useCollection.ts" @'
import { useEffect, useState } from 'react';
import { subscribe } from '../lib/db';

export function useCollection(collection, initial = []) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    const unsubscribe = subscribe(collection, (rows) => {
      setData(rows);
    });
    return unsubscribe;
  }, [collection]);

  return data;
}
'@

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update .env.production with your actual backend URL"
Write-Host "  2. Run: npm install"
Write-Host "  3. Run: npm run build"
Write-Host "  4. Run: npm run preview"
Write-Host "  5. Push to Git and deploy on Vercel"
Write-Host ""
Write-Host "Don't forget to update server/src/server.js CORS list with your Vercel domain." -ForegroundColor Magenta