import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '@/services/auth.service';
import { clearAuthCookies } from '@/lib/auth-utils';



// Define interfaces for the auth state
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  role?: 'USER' | 'AGENT' | 'ADMIN';
  isEmailVerified?: boolean;
  oAuthProvider?: string; // e.g., 'google', 'github'
  defaultCurrency?: string; // User's default currency
  balance?: number; // User's balance
  createdAt?: Date; // User's account creation date
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasCheckedAuth: boolean; // Flag to track if we've attempted auth check
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasCheckedAuth: false
};

// Async thunks for authentication actions
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: authService.LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error?.data || 'Login failed');
    }
  })

export const register = createAsyncThunk(
  'auth/register',
  async (userData: authService.RegisterUserData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error?.data || 'Registration failed');
    }
  })

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      // Backend handles cookie clearing, no need to clear on frontend
      return null;
    } catch (error: any) {
      // If logout fails, clear cookies on frontend as fallback
      clearAuthCookies();
      return rejectWithValue(error.data || 'Logout failed');
    }
  })

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response.data.success) {
        return response.data.user;
      }
      throw new Error('Not authenticated');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check authentication status');
    }
  })

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Additional reducers for specific state changes
    clearErrors: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthCookies();
    },
  },
  extraReducers: (builder) => {
    // Login actions
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.hasCheckedAuth = true; // Mark that we've checked auth status
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Register actions
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      // Set the user info but remember they still need to verify their email
      state.user = action.payload;
      state.isAuthenticated = true; // They are authenticated but with incomplete profile
      state.hasCheckedAuth = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout actions
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.hasCheckedAuth = false; // Reset so auth can be checked again
      // Backend handles cookie clearing
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.hasCheckedAuth = false; // Reset so auth can be checked again
      // Clear authentication cookies
      clearAuthCookies();
      state.error = action.payload as string;
    });

    // Check auth status actions
    builder.addCase(checkAuthStatus.pending, (state) => {
      state.isLoading = true;
      state.hasCheckedAuth = true; // Mark that we've attempted to check
    });
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.hasCheckedAuth = true;
    });
    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = 'Not authenticated';
      state.hasCheckedAuth = true; // Mark that we've attempted to check
      // Clear invalid cookies
      clearAuthCookies();
    });
  },
});

// Export actions and reducer
export const { clearErrors, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
