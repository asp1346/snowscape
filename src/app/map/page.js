import { getResortsWithWeather } from '../../lib/resorts.js'
import Nav from '../../components/Nav.js'
import MapView from '../../components/MapView.js'

export default async function MapPage() {
  const resorts = await getResortsWithWeather()

  return (
    <div className="flex flex-col h-screen bg-neutral-950 overflow-hidden">
      <Nav />
      <MapView resorts={resorts} />
    </div>
  )
}
