import apiClient from '../apiConfig'

// Endpoint mapped to the stored procedure iConnect_upload_analytics_records_analytics
const ENDPOINT = '/iConnect_upload_analytics_records_analytics'
const MASTER_ENDPOINT = '/iConnect_get_party_state_assembly_analytics'

/**
 * Upload a single analytics record.
 * Payload should match the stored procedure expected JSON (see spec in the repo).
 * Returns the parsed response data.
 */
export async function uploadAnalyticsRecord(payload) {
  const response = await apiClient.post(ENDPOINT, payload)
  return response.data
}

/**
 * Fetch master data for PARTY / STATE / ASSEMBLY
 * input: { user_id, stage }
 * returns response.data
 */
export async function fetchMasterData(payload) {
  const response = await apiClient.post(MASTER_ENDPOINT, payload)
  return response.data
}

export default uploadAnalyticsRecord
