import {
  ApiResponse,
  CreateOrderRequest,
  CustomerOrderRequest,
  DailySalesReport,
  ItemSalesReport,
  OrderStatus,
  OrderWithItems,
  PaymentModeSummary,
  Product,
  ProductFormData,
  Table,
  TableSession,
  TableWithSession,
  User,
} from './types';

// Base API fetch wrapper
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Request failed',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Specific API methods
export const api = {
  // Products
  getProducts: () => apiRequest<Product[]>('/api/products'),
  getActiveProducts: () => apiRequest<Product[]>('/api/products?active=true'),
  getProduct: (id: number) => apiRequest<Product>(`/api/products/${id}`),
  createProduct: (data: ProductFormData) =>
    apiRequest<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: number, data: ProductFormData) =>
    apiRequest<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  toggleProductStatus: (id: number, isActive: boolean) =>
    apiRequest<Product>(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),

  // Orders
  getOrders: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest<OrderWithItems[]>(`/api/orders${query}`);
  },
  // Kitchen-specific fetch — only APPROVED, PREPARING, READY orders
  getKitchenOrders: () => apiRequest<OrderWithItems[]>('/api/orders?kitchen=true'),
  getOrder: (id: number) => apiRequest<OrderWithItems>(`/api/orders/${id}`),
  createOrder: (data: CreateOrderRequest) =>
    apiRequest<OrderWithItems>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateOrderStatus: (id: number, status: OrderStatus) =>
    apiRequest<OrderWithItems>(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  // QR Order endpoints
  createCustomerOrder: (data: CustomerOrderRequest) =>
    apiRequest<OrderWithItems>('/api/orders/customer', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  approveOrder: (id: number) =>
    apiRequest<OrderWithItems>(`/api/orders/${id}/approve`, {
      method: 'PATCH',
    }),
  getPendingApproval: () => apiRequest<OrderWithItems[]>('/api/orders/pending-approval'),

  // Tables
  getTables: () => apiRequest<TableWithSession[]>('/api/tables'),
  createTable: (tableNo: string) =>
    apiRequest<Table>('/api/tables', {
      method: 'POST',
      body: JSON.stringify({ tableNo }),
    }),
  getTableByToken: (token: string) => apiRequest<Table>(`/api/tables/${token}`),
  getTableSession: (token: string) => apiRequest<TableSession>(`/api/tables/${token}/session`),
  toggleTableStatus: (id: number, isActive: boolean) =>
    apiRequest<Table>(`/api/tables/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),
  settleTable: (id: number) =>
    apiRequest<{ message: string; table: Table }>(`/api/tables/${id}/settle`, {
      method: 'PATCH',
    }),
  deleteTable: (id: number) =>
    apiRequest<{ message: string }>(`/api/tables/${id}`, {
      method: 'DELETE',
    }),

  // Reports
  getDailySales: (date?: string) => {
    const query = date ? `?date=${date}` : '';
    return apiRequest<DailySalesReport>(`/api/reports/daily-sales${query}`);
  },
  getItemSales: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<ItemSalesReport[]>(`/api/reports/item-sales${query}`);
  },
  getPaymentSummary: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<PaymentModeSummary[]>(`/api/reports/payment-summary${query}`);
  },

  // Users
  getUsers: () => apiRequest<User[]>('/api/users'),
};

