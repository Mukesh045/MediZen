const API_BASE_URL = 'http://localhost:5000/api';

export const analyzeSymptoms = async (symptoms) => {
  try {
    const response = await fetch(`${API_BASE_URL}/symptoms/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze symptoms');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getMedicines = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/medicines`);

    if (!response.ok) {
      throw new Error('Failed to fetch medicines');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getMedicineById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch medicine');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getRoutine = async (condition) => {
  try {
    const response = await fetch(`${API_BASE_URL}/routine/${condition}`);

    if (!response.ok) {
      throw new Error('Failed to fetch routine');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const queryWHOApi = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/who/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to query WHO API');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default {
  analyzeSymptoms,
  getMedicines,
  getMedicineById,
  getRoutine,
  queryWHOApi,
};