const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  register: async (email, password, username) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // User endpoints
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  updateProfile: async (token, username) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });
    return response.json();
  },

  // Payment endpoints
  createCheckoutSession: async (token, priceId) => {
    const response = await fetch(`${API_BASE_URL}/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ priceId }),
    });
    return response.json();
  },

  getSubscriptionStatus: async (token) => {
    const response = await fetch(`${API_BASE_URL}/payment/subscription-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};
