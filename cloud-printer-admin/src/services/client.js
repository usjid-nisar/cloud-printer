import { API_CONFIG } from '../constants/config';
import { getToken } from './auth';

export async function createClient(clientData) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/onboarding/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create client');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getClients(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/clients?page=${page}&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch clients');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateClientBranding(clientId, brandingData) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/clients/${clientId}/branding`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(brandingData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update client branding');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getClientStats(clientId) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/clients/${clientId}/stats`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch client statistics');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function deactivateClient(clientId) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/clients/${clientId}/deactivate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to deactivate client');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function reactivateClient(clientId) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/clients/${clientId}/reactivate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reactivate client');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
} 