// src/services/foodService.js
const API_BASE_URL = 'https://food-service-backend-production.up.railway.app/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(e => ({ message: 'Could not parse error response' }));
    console.error('Error response:', errorData);
    throw new Error(errorData.message || 'Request failed');
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

export const foodService = {
  getMenuItems: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/foods`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
      throw error;
    }
  },

  saveSelections: async (selections) => {
    try {
      const response = await fetch(`${API_BASE_URL}/selections`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(selections),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to save selections:', error);
      throw error;
    }
  },

  getSelections: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/selections`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to get selections:', error);
      throw error;
    }
  }
};

export default foodService;