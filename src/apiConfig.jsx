import axios from "axios";

const API_BASE_URL =
  "https://api.tekchant.com/v2/production";

const API_HEADERS = {
  "x-api-key": "sa9F4GyTT45OImNkKjaHu6bsJbk8UWmZfKdzmeoc",
  "Content-Type": "application/json",
};

export const DEFAULT_STAGE = "dev";

// WhatsApp API Configuration
// Set to true for local development (calls vendor API directly)
// Set to false for production (uses Lambda endpoint)

// Shared axios client for all API modules
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: API_HEADERS,
});

export default apiClient;