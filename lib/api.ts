import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
// Use environment variable if set, otherwise use production URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digistore1-backend.onrender.com/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    name: string;
    role?: 'CUSTOMER' | 'VENDOR';
  }) => api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get('/auth/me'),

  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

// ============================================
// PRODUCTS API
// ============================================

export const productsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    sort?: string;
  }) => api.get('/products', { params }),

  getFeatured: () => api.get('/products/featured'),

  getBestsellers: () => api.get('/products/bestsellers'),

  getNewArrivals: () => api.get('/products/new-arrivals'),

  getBySlug: (slug: string) => api.get(`/products/${slug}`),

  getById: (id: string) => api.get(`/products/by-id/${id}`),

  create: (data: any) => api.post('/products', data),

  update: (id: string, data: any) => api.put(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),
};

// ============================================
// CATEGORIES API
// ============================================

export const categoriesAPI = {
  getAll: () => api.get('/categories'),

  getBySlug: (slug: string) => api.get(`/categories/${slug}`),

  create: (data: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    parentId?: string | null;
    order?: number;
    active?: boolean;
  }) => api.post('/categories', data),

  update: (id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    parentId?: string | null;
    order?: number;
    active?: boolean;
  }) => api.put(`/categories/${id}`, data),

  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ============================================
// ORDERS API
// ============================================

export const ordersAPI = {
  getMyOrders: () => api.get('/orders/my-orders'),

  getById: (id: string) => api.get(`/orders/${id}`),

  create: (data: {
    items: Array<{
      productId: string;
      license: 'PERSONAL' | 'COMMERCIAL' | 'EXTENDED';
    }>;
    couponCode?: string;
  }) => api.post('/orders', data),
};

// ============================================
// USER API
// ============================================

export const userAPI = {
  getProfile: () => api.get('/users/profile'),

  updateProfile: (data: any) => api.put('/users/profile', data),

  getWishlist: () => api.get('/users/wishlist'),

  addToWishlist: (productId: string) =>
    api.post(`/users/wishlist/${productId}`),

  removeFromWishlist: (productId: string) =>
    api.delete(`/users/wishlist/${productId}`),

  getDownloads: () => api.get('/users/downloads'),
};

// ============================================
// REVIEWS API
// ============================================

export const reviewsAPI = {
  getProductReviews: (productId: string) =>
    api.get(`/reviews/product/${productId}`),

  create: (data: {
    productId: string;
    rating: number;
    title?: string;
    comment: string;
  }) => api.post('/reviews', data),

  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),

  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// ============================================
// ATTRIBUTES API
// ============================================

export const attributesAPI = {
  getAll: () => api.get('/attributes'),

  getById: (id: string) => api.get(`/attributes/${id}`),

  create: (data: any) => api.post('/attributes', data),

  update: (id: string, data: any) => api.put(`/attributes/${id}`, data),

  delete: (id: string) => api.delete(`/attributes/${id}`),

  getProductAttributes: (productId: string) =>
    api.get(`/attributes/product/${productId}`),

  setProductAttributes: (productId: string, attributes: Array<{ attributeId: string; value: string }>) =>
    api.post(`/attributes/product/${productId}`, { attributes }),
};

// ============================================
// PAYMENTS API
// ============================================

export const paymentsAPI = {
  // Create PayPal order
  createPayPalOrder: (data: {
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      productId: string;
      vendorId?: string;
      license?: string;
    }>;
    totalAmount: number;
    currency?: string;
    couponCode?: string;
  }) => api.post('/payments/paypal/create-order', data),

  // Capture PayPal payment
  capturePayPalOrder: (data: {
    paypalOrderId: string;
    items: Array<{
      productId: string;
      vendorId?: string;
      quantity: number;
      price: number;
      license?: string;
    }>;
    billingInfo: {
      email: string;
      firstName: string;
      lastName: string;
      country: string;
    };
    couponCode?: string;
  }) => api.post('/payments/paypal/capture-order', data),

  // Create free order (for $0 products)
  createFreeOrder: (data: {
    items: Array<{
      productId: string;
      vendorId?: string;
      quantity: number;
      price: number;
      license?: string;
    }>;
    billingInfo: {
      email: string;
      firstName: string;
      lastName: string;
      country: string;
    };
  }) => api.post('/payments/free-order', data),

  // Get available payment methods
  getMethods: () => api.get('/payments/methods'),
};

// ============================================
// DOWNLOADS API
// ============================================

export const downloadsAPI = {
  getMyDownloads: () => api.get('/downloads'),

  generateDownloadLink: (downloadId: string) =>
    api.get(`/downloads/${downloadId}/link`),
};

// ============================================
// AI CONTENT GENERATION API
// ============================================

export const aiAPI = {
  generateContent: (data: {
    type: 'title' | 'shortDescription' | 'description' | 'tags' | 'all';
    context: {
      fileName?: string;
      category?: string;
      existingTitle?: string;
      existingDescription?: string;
    };
  }) => api.post('/ai/generate', data),

  // Generate image alt text for SEO
  generateImageAlt: (data: {
    productTitle?: string;
    categoryName?: string;
    imageIndex?: number;
    isMainImage?: boolean;
  }) => api.post('/ai/generate', {
    type: 'imageAlt',
    context: data,
  }),
};

// ============================================
// UPLOAD API
// ============================================

export const uploadAPI = {
  // Upload single image to Cloudinary
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Upload multiple images to Cloudinary
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Upload single product file to S3
  uploadProductFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload/product-file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Upload multiple product files to S3
  uploadProductFiles: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return api.post('/upload/product-files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============================================
// SETTINGS API
// ============================================

export const settingsAPI = {
  // Get public settings (includes menuItems)
  getPublic: () => api.get('/settings/public'),

  // Get all settings (admin only)
  getAll: () => api.get('/settings'),

  // Update settings (admin only)
  update: (data: Record<string, any>) => api.put('/settings', data),
};

export const tagsAPI = {
  // Bulk delete tags from all products (admin only)
  bulkDelete: (tags: string[]) => api.post('/admin/tags/bulk-delete', { tags }),
};

export default api;

