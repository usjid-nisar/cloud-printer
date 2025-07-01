import { API_CONFIG } from '../constants/config';
import { getToken } from './auth';

export async function getOrders(page = 1, limit = 10, filters = {}) {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/orders?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch orders');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getOrderDetails(orderId) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch order details');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/orders/${orderId}/status`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update order status');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getFulfillmentMetrics(startDate, endDate) {
  try {
    const queryParams = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/orders/metrics?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch fulfillment metrics');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateForwardingSettings(settings) {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/settings/forwarding`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(settings),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update forwarding settings');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getForwardingSettings() {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/settings/forwarding`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch forwarding settings');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
} 