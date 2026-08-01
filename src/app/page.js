import { getResortsWithWeather } from '../lib/resorts.js'
import { getLiftStatus } from '../lib/liftie.js'
import { getRoadConditions } from '../lib/roads.js'
import { createClient } from '../lib/supabase-server.js'
import { getDistancesFromZip } from '../lib/distances.js'
import Nav from '../components/Nav.js'
import Sidebar from '../components/Sidebar.js'
import ResortDetail from '../components/ResortDetail.js'

export default async function Home() {
  const resorts = await getResortsWithWeather()
  const featured = resorts[0]

  const [liftStatus, roadConditions, distances] = await Promise.all([
    getLiftStatus(featured.liftie_slug),
    getRoadConditions(featured),
    getUserDistances(resorts),
  ])

  return (
    <div className="flex flex-col h-screen bg-page overflow-hidden">
      <Nav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar resorts={resorts} activeId={featured.id} distances={distances} />
        <ResortDetail
          featured={featured}
          resorts={resorts}
          liftStatus={liftStatus}
          roadConditions={roadConditions}
          distances={distances}
        />
      </div>
    </div>
  )
}

async function getUserDistances(resorts) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return {}

    const { data: profile } = await supabase
      .from('profiles')
      .select('zip_code')
      .eq('id', user.id)
      .single()

    if (!profile?.zip_code) return {}
    return getDistancesFromZip(profile.zip_code, resorts)
  } catch {
    return {}
  }
}
