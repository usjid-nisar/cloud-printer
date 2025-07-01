import { API_CONFIG } from '../constants/config';

export async function login(email, password, rememberMe) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();

    // Verify that the user is an admin
    if (data.user.role !== 'admin') {
      throw new Error('Unauthorized. Admin access only.');
    }
    
    // Store the token and user data
    if (rememberMe) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function register({ email, password, firstName, lastName }) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password,
        firstName,
        lastName,
        role: 'admin' // Always register as admin in admin portal
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    
    // Store the token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw error;
  }
}

export async function createAdminUser({ email, password, firstName, lastName }) {
  try {
    const token = getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        email, 
        password,
        firstName,
        lastName,
        role: 'admin'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create admin user');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const token = getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const user = await response.json();
    return user;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const token = getToken();
    await fetch(`${API_CONFIG.BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  }
}

export function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export function getUser() {
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  const token = getToken();
  const user = getUser();
  return !!token && !!user && user.role === 'admin';
} 