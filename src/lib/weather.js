export async function getWeatherForResort(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,snowfall,snow_depth,wind_speed_10m&daily=snowfall_sum&forecast_days=7&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  const data = await res.json()

  console.log('Open-Meteo response:', JSON.stringify(data))

  if (!data.current) {
    return {
      temp: null,
      snowfall: null,
      snowDepth: null,
      windSpeed: null,
      dailySnow: []
    }
  }

  return {
    temp: Math.round(data.current.temperature_2m),
    snowfall: Math.round(data.current.snowfall * 10) / 10,
    snowDepth: Math.round(data.current.snow_depth * 39.37),
    windSpeed: Math.round(data.current.wind_speed_10m),
    dailySnow: data.daily.snowfall_sum.map(v => Math.round(v * 10) / 10)
  }
}