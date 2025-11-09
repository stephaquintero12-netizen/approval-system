const API_BASE_URL = 'http://localhost:3001/api';
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data };
    
  } catch (error) {
    throw error;
  }
};

export const requestsAPI = {
  getAll: async () => {
    return await fetchAPI('/requests');
  },
  
  getById: async (id: number) => {
    return await fetchAPI(`/requests/${id}`);
  },
  
  create: async (requestData: any) => {
    return await fetchAPI('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }
};

export const usersAPI = {
  getAll: async () => {
    return await fetchAPI('/users');
  },
  
  getById: async (id: number) => {
    return await fetchAPI(`/users/${id}`);
  }
};

export default { requestsAPI, usersAPI };