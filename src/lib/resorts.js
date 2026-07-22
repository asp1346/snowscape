import { supabase } from './supabase.js'
import { getWeatherForResort } from './weather.js'

export async function getResortsWithWeather() {
  const { data: resorts, error } = await supabase
    .from('resorts')
    .select('*')
    .order('name')

  if (error) throw error

  return Promise.all(
    resorts.map(async (resort) => {
      const weather = await getWeatherForResort(resort.latitude, resort.longitude)
      return { ...resort, weather }
    })
  )
}
