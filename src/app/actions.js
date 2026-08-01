'use server'

import { getResortsWithWeather } from '../lib/resorts.js'
import { scoreResorts } from '../lib/bestForMe.js'
import { createClient } from '../lib/supabase-server.js'
import { geocodeZip } from '../lib/geocode.js'

export async function findBestResorts(weights) {
  const [resorts, userLocation] = await Promise.all([
    getResortsWithWeather(),
    getUserLocation(),
  ])
  return scoreResorts(resorts, weights, userLocation)
}

async function getUserLocation() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile } = await supabase
      .from('profiles')
      .select('zip_code')
      .eq('id', user.id)
      .single()
    if (!profile?.zip_code) return null
    return geocodeZip(profile.zip_code)
  } catch {
    return null
  }
}
