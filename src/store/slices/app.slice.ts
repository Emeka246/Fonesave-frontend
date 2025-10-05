import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/services';

export interface AppConstants {
    // Static constants from backend
    PRICE_USER_REGISTRATION_NGN: number | 1000;
    PRICE_AGENT_REGISTRATION_NGN: number | 1000;
    PRICE_CONVERTER_POINT: number | 100;
    AGENCY_FREE_REGISTRATION_THRESHOLD: number | 5;
    REGISTRATION_VALIDITY_DAYS: number | 365;
    DEFAULT_CURRENCY: string | 'NGN';
    
    // Dynamic constants (from database)
    MAINTENANCE_MODE?: boolean;
    MAX_FILE_SIZE_MB?: number;
    SUPPORTED_FILE_TYPES?: string[];
    FEATURE_FLAGS?: Record<string, boolean>;
    NOTIFICATION_SETTINGS?: Record<string, boolean>;
    
    // Allow for additional dynamic constants
    [key: string]: any;
}

// Cache key for localStorage
const CONSTANTS_CACHE_KEY = 'fonsave_app_constants';
const CACHE_EXPIRY_KEY = 'fonsave_constants_expiry';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Define interfaces for the app state
export interface AppState {
  constants: AppConstants | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  lastFetched: number | null;
  cacheExpiry: number | null;
}

// Initial state
const initialState: AppState = {
  constants: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  lastFetched: null,
  cacheExpiry: null
};

// localStorage utilities
const localStorageUtils = {
  getCachedConstants: (): { constants: AppConstants | null; isExpired: boolean } => {
    try {
      const cached = localStorage.getItem(CONSTANTS_CACHE_KEY);
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      
      if (!cached || !expiry) {
        return { constants: null, isExpired: true };
      }

      const now = Date.now();
      const cacheExpiry = parseInt(expiry, 10);
      const isExpired = now > cacheExpiry;

      if (isExpired) {
        // Clean up expired cache
        localStorage.removeItem(CONSTANTS_CACHE_KEY);
        localStorage.removeItem(CACHE_EXPIRY_KEY);
        return { constants: null, isExpired: true };
      }

      return { constants: JSON.parse(cached), isExpired: false };
    } catch (error) {
      console.error('Error reading constants from cache:', error);
      return { constants: null, isExpired: true };
    }
  },

  setCachedConstants: (constants: AppConstants): void => {
    try {
      const now = Date.now();
      const expiry = now + CACHE_DURATION;
      
      localStorage.setItem(CONSTANTS_CACHE_KEY, JSON.stringify(constants));
      localStorage.setItem(CACHE_EXPIRY_KEY, expiry.toString());
    } catch (error) {
      console.error('Error caching constants:', error);
    }
  },

  clearCache: (): void => {
    try {
      localStorage.removeItem(CONSTANTS_CACHE_KEY);
      localStorage.removeItem(CACHE_EXPIRY_KEY);
    } catch (error) {
      console.error('Error clearing constants cache:', error);
    }
  }
};

// Async thunk for fetching constants
export const fetchAppConstants = createAsyncThunk(
  'app/fetchConstants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/constants');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch app constants');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load app constants';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for hybrid loading (cache first, then API)
export const loadAppConstants = createAsyncThunk(
  'app/loadConstants',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Step 1: Check cache first
      const { constants: cachedConstants, isExpired } = localStorageUtils.getCachedConstants();
      
      if (cachedConstants && !isExpired) {
        // Step 2: Hydrate state from cache immediately
        dispatch(setConstantsFromCache(cachedConstants));
        
        // Step 3: Fetch fresh data in background (don't wait for it)
        dispatch(fetchAppConstants()).unwrap().catch((error) => {
          console.warn('Background constants fetch failed:', error);
          // Don't update state if background fetch fails
        });
        
        return cachedConstants;
      }

      // Step 4: If no cache or expired, fetch from API
      const response = await api.get('/constants');
      
      if (response.data.success && response.data.data) {
        const constants = response.data.data;
        
        // Cache the fresh data
        localStorageUtils.setCachedConstants(constants);
        
        return constants;
      } else {
        throw new Error(response.data.message || 'Failed to fetch app constants');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load app constants';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for refreshing constants (force API call)
export const refreshAppConstants = createAsyncThunk(
  'app/refreshConstants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/constants');
      
      if (response.data.success && response.data.data) {
        const constants = response.data.data;
        
        // Update cache with fresh data
        localStorageUtils.setCachedConstants(constants);
        
        return constants;
      } else {
        throw new Error(response.data.message || 'Failed to fetch app constants');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to refresh app constants';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create the slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Set constants from cache (immediate hydration)
    setConstantsFromCache: (state, action: PayloadAction<AppConstants>) => {
      state.constants = action.payload;
      state.isInitialized = true;
      state.error = null;
      state.lastFetched = Date.now();
      state.cacheExpiry = Date.now() + CACHE_DURATION;
    },

    // Clear constants and cache
    clearConstants: (state) => {
      state.constants = null;
      state.isInitialized = false;
      state.error = null;
      state.lastFetched = null;
      state.cacheExpiry = null;
      localStorageUtils.clearCache();
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load constants (hybrid approach)
      .addCase(loadAppConstants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAppConstants.fulfilled, (state, action) => {
        state.constants = action.payload;
        state.isLoading = false;
        state.isInitialized = true;
        state.error = null;
        state.lastFetched = Date.now();
        state.cacheExpiry = Date.now() + CACHE_DURATION;
      })
      .addCase(loadAppConstants.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true; // Set to true even on error to prevent infinite loading
        state.error = action.payload as string;
      })

      // Fetch constants (background refresh)
      .addCase(fetchAppConstants.pending, () => {
        // Don't set loading to true for background fetches
      })
      .addCase(fetchAppConstants.fulfilled, (state, action) => {
        state.constants = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
        state.cacheExpiry = Date.now() + CACHE_DURATION;
        // Cache the updated constants
        localStorageUtils.setCachedConstants(action.payload);
      })
      .addCase(fetchAppConstants.rejected, (_, action) => {
        // Don't update error state for background fetch failures
        console.warn('Background constants fetch failed:', action.payload);
      })

      // Refresh constants (force API call)
      .addCase(refreshAppConstants.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAppConstants.fulfilled, (state, action) => {
        state.constants = action.payload;
        state.isLoading = false;
        state.isInitialized = true;
        state.error = null;
        state.lastFetched = Date.now();
        state.cacheExpiry = Date.now() + CACHE_DURATION;
      })
      .addCase(refreshAppConstants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// Export actions
export const { 
  setConstantsFromCache, 
  clearConstants, 
  clearError, 
  setLoading 
} = appSlice.actions;

// Export selectors
export const selectConstants = (state: { app: AppState }) => state.app.constants;
export const selectConstantsLoading = (state: { app: AppState }) => state.app.isLoading;
export const selectConstantsError = (state: { app: AppState }) => state.app.error;
export const selectConstantsInitialized = (state: { app: AppState }) => state.app.isInitialized;
export const selectConstantsLastFetched = (state: { app: AppState }) => state.app.lastFetched;
export const selectConstantsCacheExpiry = (state: { app: AppState }) => state.app.cacheExpiry;

// Export utility functions
export const constantsUtils = {
  getConstant: <T = any>(state: { app: AppState }, key: string, defaultValue?: T): T | undefined => {
    if (!state.app.constants) return defaultValue;
    return state.app.constants[key] !== undefined ? state.app.constants[key] : defaultValue;
  },
  
  isCacheValid: (state: { app: AppState }): boolean => {
    if (!state.app.cacheExpiry) return false;
    return Date.now() < state.app.cacheExpiry;
  },
  
  shouldRefresh: (state: { app: AppState }): boolean => {
    if (!state.app.lastFetched) return true;
    const timeSinceLastFetch = Date.now() - state.app.lastFetched;
    return timeSinceLastFetch > CACHE_DURATION;
  }
};

// Export reducer
export default appSlice.reducer;
