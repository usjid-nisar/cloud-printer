const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function fetchApi(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function get(endpoint) {
  return fetchApi(endpoint);
}

export async function post(endpoint, data) {
  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function put(endpoint, data) {
  return fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function del(endpoint) {
  return fetchApi(endpoint, {
    method: 'DELETE',
  });
} 