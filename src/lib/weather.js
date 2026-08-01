export async function getWeatherForResort(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,snowfall,snow_depth,wind_speed_10m&daily=snowfall_sum,temperature_2m_max,temperature_2m_min&forecast_days=7&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  const data = await res.json()

  if (!data.current) {
    return {
      temp: null,
      snowfall: null,
      snowDepth: null,
      windSpeed: null,
      dailySnow: [],
      dailyHigh: [],
      dailyLow: [],
      dailyDates: [],
    }
  }

  return {
    temp: Math.round(data.current.temperature_2m),
    snowfall: Math.round(data.current.snowfall * 10) / 10,
    snowDepth: Math.round(data.current.snow_depth * 39.37),
    windSpeed: Math.round(data.current.wind_speed_10m),
    dailySnow: data.daily.snowfall_sum.map(v => Math.round(v * 10) / 10),
    dailyHigh: data.daily.temperature_2m_max.map(v => Math.round(v)),
    dailyLow: data.daily.temperature_2m_min.map(v => Math.round(v)),
    dailyDates: data.daily.time,
  }
}