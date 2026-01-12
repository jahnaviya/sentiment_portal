import apiClient from '../apiConfig'

const ENDPOINT = '/iConnect_get_analytics_records_analytics'

/**
 * Fetch analytics records for the logged-in user.
 * Input: { user_id, stage }
 * Returns response.data which contains RESULT array of analytics records
 */
export async function fetchAnalyticsRecords(payload) {
  const response = await apiClient.post(ENDPOINT, payload)
  return response.data
}

export default fetchAnalyticsRecords
