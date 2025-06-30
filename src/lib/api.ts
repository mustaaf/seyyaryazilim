import axios from 'axios';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData: { username: string; email: string; password: string; role?: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  create: async (categoryData: { name: string; description?: string; isActive?: boolean; sortOrder?: number }) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  update: async (id: string, categoryData: Partial<{ name: string; description?: string; isActive?: boolean; sortOrder?: number }>) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
  updateImage: async (id: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.put(`/categories/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Products API
export const productsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    popular?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  getByCategory: async (categoryId: string) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },
  create: async (productData: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    ingredients?: string[];
    allergens?: string[];
    isActive?: boolean;
    isPopular?: boolean;
    sortOrder?: number;
    nutritionalInfo?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    };
  }) => {
    const response = await api.post('/products', productData);
    return response.data;
  },
  update: async (id: string, productData: Partial<{
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    ingredients?: string[];
    allergens?: string[];
    isActive?: boolean;
    isPopular?: boolean;
    sortOrder?: number;
    nutritionalInfo?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    };
  }>) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
  updateImages: async (id: string, imageFiles: File[], replace: boolean = false) => {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('replace', replace.toString());
    const response = await api.put(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Upload API
export const uploadAPI = {
  uploadSingle: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  uploadMultiple: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    const response = await api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteImage: async (filename: string) => {
    const response = await api.delete(`/upload/${filename}`);
    return response.data;
  }
};

// Restaurant API
export const restaurantAPI = {
  getInfo: async () => {
    const response = await api.get('/restaurant');
    return response.data;
  },
  updateInfo: async (restaurantData: {
    name?: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      district?: string;
      postalCode?: string;
      country?: string;
    };
    workingHours?: any;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      website?: string;
    };
  }) => {
    const response = await api.put('/restaurant', restaurantData);
    return response.data;
  },
  updateLogo: async (logoFile: File) => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    const response = await api.put('/restaurant/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  updateBanner: async (bannerFile: File) => {
    const formData = new FormData();
    formData.append('banner', bannerFile);
    const response = await api.put('/restaurant/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default api;
