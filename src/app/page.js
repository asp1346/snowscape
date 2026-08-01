import { getResortsWithWeather } from '../lib/resorts.js'
import { getLiftStatus } from '../lib/liftie.js'
import { getRoadConditions } from '../lib/roads.js'
import Nav from '../components/Nav.js'
import Sidebar from '../components/Sidebar.js'
import ResortDetail from '../components/ResortDetail.js'

export default async function Home() {
  const resorts = await getResortsWithWeather()
  const featured = resorts[0]
  const liftStatus = await getLiftStatus(featured.liftie_slug)
  const roadConditions = await getRoadConditions(featured)

  return (
    <div className="flex flex-col h-screen bg-page overflow-hidden">
      <Nav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar resorts={resorts} activeId={featured.id} />
        <ResortDetail featured={featured} resorts={resorts} liftStatus={liftStatus} roadConditions={roadConditions} />
      </div>
    </div>
  )
}
