import apiClient from '../apiConfig'

const ENDPOINT = '/iConnect_update_analytics_record_analytics'

/**
 * Update an analytics record using the backend stored procedure.
 * Expected payload shape (examples):
 * {
 *   user_id: 123,
 *   analytics_id: 456,
 *   topic: '...',             // optional - only include fields to update
 *   description: '...'
 *   sentiment: 'Positive',
 *   confidence: 0.87,
 *   source_url: 'https://...',
 *   sentiment_date: '2026-01-12',
 *   state_name: 'Maharashtra',
 *   assembly_name: 'Mumbai North',
 *   party_name: 'ABC',
 *   impacted_area: 'Economy',
 *   region_state: 'Maharashtra',
 *   influence_score: 7,
 *   keywords: 'policy, reform'
 * }
 *
 * Returns response.data from the API (the procedure returns message + status flags)
 */
export async function updateAnalyticsRecord(payload) {
  const response = await apiClient.post(ENDPOINT, payload)
  return response.data
}

export default updateAnalyticsRecord
