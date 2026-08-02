export async function GET(request, { params }) {
  const { webcamId } = await params

  if (!process.env.WINDY_API_KEY) {
    return Response.json({ error: 'WINDY_API_KEY not configured' }, { status: 500 })
  }

  const res = await fetch(
    `https://api.windy.com/webcams/api/v3/webcams/${webcamId}?include=player,location`,
    {
      headers: { 'x-windy-api-key': process.env.WINDY_API_KEY },
      // Player embed URLs don't expire — safe to cache for a few minutes
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) {
    return Response.json(
      { error: `Windy API returned ${res.status}` },
      { status: res.status }
    )
  }

  const data = await res.json()
  // v3 single-webcam endpoint returns { webcam: { ... } }
  const cam = data.webcam ?? data.webcams?.[0]

  if (!cam) {
    return Response.json({ error: 'Webcam not found' }, { status: 404 })
  }

  return Response.json({
    webcamId: cam.webcamId,
    title: cam.title,
    playerUrl: cam.player?.day,
    location: cam.location,
  })
}
