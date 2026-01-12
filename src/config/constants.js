// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Application Constants
export const APP_NAME = 'SentimentalAnalytics'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Political & News Sentiment Intelligence Platform'

// Sentiment Types
export const SENTIMENT_TYPES = {
  POSITIVE: 'Positive',
  NEGATIVE: 'Negative',
  NEUTRAL: 'Neutral',
}

export const SENTIMENT_OPTIONS = ['Positive', 'Negative', 'Neutral']

export const TYPE_OPTIONS = ['News', 'Tweet', 'Text', 'Speech', 'Press Release']

// Form Fields Configuration
export const FORM_FIELDS = [
  { key: 'topic', label: 'Topic', type: 'text', required: true },
  { key: 'type', label: 'Type', type: 'select', options: TYPE_OPTIONS, required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'sentiment', label: 'Sentiment', type: 'select', options: SENTIMENT_OPTIONS, required: true },
  { key: 'confidence', label: 'Confidence (0-1)', type: 'number', step: 0.01, min: 0, max: 1 },
  { key: 'sourceUrl', label: 'Source URL', type: 'url' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'assembly', label: 'Assembly', type: 'text' },
  { key: 'party', label: 'Party', type: 'text' },
  { key: 'area', label: 'Impacted Area', type: 'text' },
  { key: 'region', label: 'Region/State', type: 'text' },
  { key: 'influenceScore', label: 'Influence Score (1-10)', type: 'number', min: 1, max: 10 },
  { key: 'keywords', label: 'Keywords (comma-separated)', type: 'text' },
]

// File Upload Configuration
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = ['.csv', '.txt', '.json', '.xlsx']
export const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

// Pagination
export const ITEMS_PER_PAGE = 20
export const MAX_PAGE_BUTTONS = 5

// Routes
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  OVERVIEW: '/dashboard',
  UPLOAD: '/upload',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  SETTINGS: '/settings',
}

// Navigation Items
export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', path: '/' },
  { id: 'upload', label: 'Upload Sentiment', path: '/upload' },
  { id: 'settings', label: 'Settings', path: '/settings' },
]

// Colors Configuration - Light Theme with Purple Accent
export const COLORS = {
  // Primary Purple Color (Your provided color)
  primary: {
      main: '#573361',
  },
  
  // Sentiment Colors
  sentiment: {
    positive: {
      main: '#16a34a',    // green-600
      bg: '#dcfce7',      // green-100
      border: '#86efac',  // green-300
      text: '#166534',    // green-800
    },
    negative: {
      main: '#dc2626',    // red-600
      bg: '#fee2e2',      // red-100
      border: '#fca5a5',  // red-300
      text: '#991b1b',    // red-800
    },
    neutral: {
      main: '#6b7280',    // gray-500
      bg: '#f3f4f6',      // gray-100
      border: '#d1d5db',  // gray-300
      text: '#374151',    // gray-700
    },
  },
  
  // Background Colors
  background: {
    main: '#f9fafb',      // gray-50 - Main background
    card: '#ffffff',      // white - Card background
    secondary: '#f3f4f6', // gray-100 - Secondary background
    hover: '#f9fafb',     // gray-50 - Hover state
  },
  
  // Text Colors
  text: {
    primary: '#111827',   // gray-900 - Primary text
    secondary: '#4b5563', // gray-600 - Secondary text
    muted: '#9ca3af',     // gray-400 - Muted text
    disabled: '#d1d5db',  // gray-300 - Disabled text
  },
  
  // Border Colors
  border: {
    main: '#e5e7eb',      // gray-200 - Main border
    light: '#f3f4f6',     // gray-100 - Light border
    dark: '#d1d5db',      // gray-300 - Dark border
    focus: '#573361',     // Purple - Focus border
  },
  
  // Status Colors
  status: {
    success: '#10b981',   // green-500
    error: '#ef4444',     // red-500
    warning: '#f59e0b',   // amber-500
    info: '#3b82f6',      // blue-500
  },
  
  // Chart Colors (for analytics)
  chart: {
    primary: '#573361',
    secondary: '#7C6BA8',
    tertiary: '#9D8EC4',
    quaternary: '#BDB4D6',
  },
}

// Statistics Card Gradient Colors
export const STAT_GRADIENTS = {
  total: 'from-blue-500 to-cyan-500',
  positive: 'from-emerald-500 to-teal-500',
  negative: 'from-rose-500 to-pink-500',
  neutral: 'from-amber-500 to-orange-500',
}

// Table Configuration
export const TABLE_CONFIG = {
  maxRowsPerPage: 10,
  sortableColumns: ['topic', 'date', 'sentiment', 'confidence', 'party'],
  defaultSortColumn: 'date',
  defaultSortOrder: 'desc',
}

// Date Formats
export const DATE_FORMATS = {
  display: 'MMM DD, YYYY',
  input: 'YYYY-MM-DD',
  full: 'MMMM DD, YYYY hh:mm A',
  short: 'MM/DD/YY',
}

// Validation Rules
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
}

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_DATE: 'Please enter a valid date',
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  RECORD_SAVED: 'Sentiment record saved successfully!',
  RECORD_UPDATED: 'Sentiment record updated successfully!',
  RECORD_DELETED: 'Sentiment record deleted successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  FILE_UPLOADED: 'File uploaded successfully!',
}

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Sentiments
  GET_SENTIMENTS: '/sentiments',
  CREATE_SENTIMENT: '/sentiments',
  UPDATE_SENTIMENT: '/sentiments/:id',
  DELETE_SENTIMENT: '/sentiments/:id',
  GET_SENTIMENT_BY_ID: '/sentiments/:id',
  
  // Analytics
  GET_STATISTICS: '/analytics/statistics',
  GET_TRENDS: '/analytics/trends',
  GET_SENTIMENT_BREAKDOWN: '/analytics/breakdown',
  
  // Upload
  UPLOAD_FILE: '/upload',
  UPLOAD_BULK: '/upload/bulk',
}

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
  ENABLE_BULK_UPLOAD: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false, // Light theme only
}

// Default Values
export const DEFAULTS = {
  CONFIDENCE_THRESHOLD: 0.7,
  DEFAULT_SENTIMENT: 'Neutral',
  DEFAULT_TYPE: 'News',
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
}