import { getReplacedString } from '@/utils/string'

import * as api from '../../config'

export const getTvlDistribution = async (networkId) => {
  try {
    const url = getReplacedString(api.TVL_DISTRIBUTION, { networkId })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    const items = data.data

    if (!items || !Array.isArray(items)) {
      return null
    }

    return items
  } catch (error) {
    console.error('Could not get tvl distribution', error)
  }

  return null
}
