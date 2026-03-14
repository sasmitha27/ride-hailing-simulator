// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  locations: `${API_BASE_URL}/api/locations`,
  packages: `${API_BASE_URL}/api/packages`,
  auth: `${API_BASE_URL}/api/auth`,
  upload: `${API_BASE_URL}/api/upload`,
};
