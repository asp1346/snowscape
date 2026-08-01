export async function getWeatherForResort(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,snowfall,snow_depth,wind_speed_10m,weather_code&daily=snowfall_sum,temperature_2m_max,weather_code&forecast_days=7&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  const data = await res.json()

  if (!data.current) {
    return {
      temp: null,
      snowfall: null,
      snowDepth: null,
      windSpeed: null,
      weatherCode: null,
      dailySnow: [],
      dailyHigh: [],
      dailyCodes: [],
      dailyDates: [],
    }
  }

  return {
    temp: Math.round(data.current.temperature_2m),
    snowfall: Math.round(data.current.snowfall * 10) / 10,
    snowDepth: Math.round(data.current.snow_depth * 39.37),
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
    modelElevation: data.elevation != null ? Math.round(data.elevation * 3.281) : null,
    dailySnow: data.daily.snowfall_sum.map(v => Math.round(v * 10) / 10),
    dailyHigh: data.daily.temperature_2m_max.map(v => Math.round(v)),
    dailyCodes: data.daily.weather_code,
    dailyDates: data.daily.time,
  }
}