// src/lib/api.ts
import axios from 'axios';
import { supabase } from './supabaseClient'; // Make sure this path is correct

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use(async (config) => {
  // 1. Check for Admin token first
  let token = localStorage.getItem('admin_token');

  // 2. If no Admin token, check if a Client is logged in via Supabase
  if (!token) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      token = session.access_token;
    }
  }

  // 3. Attach the token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Handle Content-Type for file uploads
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
      // Clear admin stuff
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      // Redirect based on where they are
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else if (window.location.pathname.startsWith('/dashboard')) {
        // If a client session expired, send them back to client login
        supabase.auth.signOut().then(() => {
          window.location.href = '/login';
        });
      }
    }
    return Promise.reject(err);
  }
);

export default api;