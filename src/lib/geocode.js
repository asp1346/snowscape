export async function geocodeZip(zipCode) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token || !zipCode) return null

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zipCode)}.json?country=US&types=postcode&limit=1&access_token=${token}`

  const res = await fetch(url, { next: { revalidate: 86400 } }) // cache zip lookups for 24h
  if (!res.ok) return null

  const data = await res.json()
  const feature = data.features?.[0]
  if (!feature) return null

  const [lng, lat] = feature.center
  return { lat, lng }
}
