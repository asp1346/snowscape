import { supabase } from '../lib/supabase.js'
import { getWeatherForResort } from '../lib/weather.js'

export default async function Home() {
  const { data: resorts, error } = await supabase
    .from('resorts')
    .select('*')

  if (error) {
    console.error(error)
    return <div>Error loading resorts</div>
  }

  const resortsWithWeather = await Promise.all(
  resorts.map(async (resort) => {
    console.log('Resort coords:', resort.name, resort.latitude, resort.longitude)
    const weather = await getWeatherForResort(
      resort.latitude,
      resort.longitude
    )
    return { ...resort, weather }
  })
)

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Snowscape</h1>
      {resortsWithWeather.map(resort => (
        <div key={resort.id} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>{resort.name}</h2>
          <p>{resort.state} · {resort.summit_elevation}ft summit</p>
          <p>Temperature: {resort.weather.temp}°F</p>
          <p>Snow depth: {resort.weather.snowDepth}"</p>
          <p>Wind: {resort.weather.windSpeed} mph</p>
          <p>7-day snow forecast: {resort.weather.dailySnow.join('" · ')}"</p>
        </div>
      ))}
    </main>
  )
}