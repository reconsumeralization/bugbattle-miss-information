
// services/apiClient.ts
import { MOCK_API_BASE_URL } from '../constants/api.constants';
import { ApiResponse } from '../types';

const SIMULATED_DELAY = 500; // ms

async function request<T>(
  method: string,
  endpoint: string,
  body?: any,
  isPublic: boolean = false
): Promise<ApiResponse<T>> {
  console.log(`[API Client] Request: ${method} ${endpoint}`, body);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (!isPublic) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // For protected routes, if no token, simulate an auth error without making a "network" call
      // In a real app, the server would return 401. Here we short-circuit for simulation.
      // However, for this mock, we'll let the specific mock endpoints decide how to handle missing tokens
      // if they want to simulate auth errors. For now, just log it.
      console.warn(`[API Client] No auth token found for protected endpoint: ${endpoint}`);
    }
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

  // In a real app, this would be:
  // const response = await fetch(`${MOCK_API_BASE_URL}${endpoint}`, {
  //   method,
  //   headers,
  //   body: body ? JSON.stringify(body) : undefined,
  // });
  // const data = await response.json();
  // if (!response.ok) throw new Error(data.message || 'API request failed');
  // return data;

  // MOCK IMPLEMENTATION - This is where you'd typically have a mock server or complex switch statement.
  // For simplicity, we'll assume successful responses and let services handle specific mock data.
  // This apiClient is now more of a request structure simulator.
  // Services using this client will need to provide their own mock data logic based on the endpoint.

  // This generic client won't return mock data itself but sets up the call structure.
  // The actual mocking of responses will happen in the service files for specific endpoints.
  // This is a placeholder response structure.
  console.log(`[API Client] Simulating ${method} to ${endpoint}. Specific mock handling should be in the calling service.`);
  
  // For demonstration, let's return a generic success for "GET" and a success with body for others.
  // This is highly simplified.
  if (method === 'GET') {
    return { success: true, message: `Mock GET to ${endpoint} successful.` } as ApiResponse<T>;
  } else {
    return { success: true, data: body || { message: `Mock ${method} to ${endpoint} successful.`} } as ApiResponse<T>;
  }
  // A real mock API client would have a large switch or map for endpoints to return specific mock data.
}

export const apiClient = {
  get: <T>(endpoint: string, isPublic: boolean = false) => request<T>('GET', endpoint, undefined, isPublic),
  post: <T>(endpoint: string, data: any, isPublic: boolean = false) => request<T>('POST', endpoint, data, isPublic),
  put: <T>(endpoint: string, data: any, isPublic: boolean = false) => request<T>('PUT', endpoint, data, isPublic),
  delete: <T>(endpoint: string, isPublic: boolean = false) => request<T>('DELETE', endpoint, undefined, isPublic),
};
