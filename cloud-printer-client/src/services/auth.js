import { API_CONFIG } from '../constants/config';

export async function login(email, password, rememberMe) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store the token in localStorage or sessionStorage based on rememberMe
    if (rememberMe) {
      localStorage.setItem('token', data.token);
    } else {
      sessionStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  window.location.href = '/login';
}

export function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function isAuthenticated() {
  return !!getToken();
} 