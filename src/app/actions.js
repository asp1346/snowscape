'use server'

import { getResortsWithWeather } from '../lib/resorts.js'
import { scoreResorts } from '../lib/bestForMe.js'

export async function findBestResorts(weights) {
  const resorts = await getResortsWithWeather()
  return scoreResorts(resorts, weights)
}
