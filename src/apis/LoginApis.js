import apiClient, { DEFAULT_STAGE } from '../apiConfig'

/**
 * Call the backend login analytics endpoint.
 * Expects payload: { username, password, stage }
 */
export async function loginApi({ username, password, stage = DEFAULT_STAGE }) {
  const payload = { username, password, stage }
  const response = await apiClient.post('/iConnect_login_analytics', payload)
  return response.data
}

export default loginApi
