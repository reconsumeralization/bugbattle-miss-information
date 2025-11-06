
// services/auth.service.ts
import { apiClient } from './apiClient';
import { LoginRequest, LoginResponse } from '../types/apiTypes';
import { ApiResponse, User } from '../types';

const AUTH_TOKEN_KEY = 'authToken';
const CURRENT_USER_KEY = 'currentUser';

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    // Simulate API call
    console.log('[AuthService] Attempting login with:', credentials);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

    let user: User;
    let token: string;

    if (credentials.email === '' && credentials.password === '') { // "Null, Null" login
        user = { id: 'user_null_login', email: 'guest@example.com', name: 'Guest User' };
        token = `mock-token-guest-${Date.now()}`;
    } else if (credentials.apiKey && credentials.userId) { // Hunt-to-login simulation
        if (credentials.apiKey === 'SIM_EXTRACTED_API_KEY' && credentials.userId === 'SIM_EXTRACTED_USER_ID') {
            user = { id: credentials.userId, email: 'hunteduser@example.com', name: 'Hunted User' };
            token = `mock-token-hunted-${Date.now()}`;
        } else {
            return { success: false, error: { message: "Invalid hunted credentials" } };
        }
    } else if (credentials.email && credentials.password) { // Standard login simulation
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
            user = { id: 'user123', email: 'test@example.com', name: 'Test User' };
            token = `mock-token-standard-${Date.now()}`;
        } else {
            // Check if it's not the "null,null" case that fell through due to partial input
            if (credentials.email !== '' || credentials.password !== '') {
                 return { success: false, error: { message: "Invalid email or password for standard login." } };
            }
            // This path should ideally be caught by client-side validation if only one field is empty.
            // But if it reaches here, treat as invalid.
            return { success: false, error: { message: "Invalid credentials." } };
        }
    } else {
         // This case handles if email is provided but password is not, or vice-versa,
         // and it wasn't the "null,null" case.
        if (credentials.email || credentials.password) { // One is filled, the other is not (and not the specific null,null case)
             return { success: false, error: { message: "Both email and password are required for standard login, or leave both empty for guest access." } };
        }
        return { success: false, error: { message: "Invalid login request structure." } };
    }
    
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    console.log('[AuthService] Login successful, token and user stored for:', user.email);
    return { success: true, data: { user, token } };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    console.log('[AuthService] Logging out.');
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true, data: null };
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Failed to parse current user from localStorage", e);
        localStorage.removeItem(CURRENT_USER_KEY); 
        return null;
      }
    }
    return null;
  },

  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
};
