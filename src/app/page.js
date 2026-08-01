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

  const [liftStatus, roadConditions, userData] = await Promise.all([
    getLiftStatus(featured.liftie_slug),
    getRoadConditions(featured),
    getUserData(resorts),
  ])
  const { distances, savedIds, isLoggedIn } = userData

  return (
    <div className="flex flex-col h-screen bg-page overflow-hidden">
      <Nav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar resorts={resorts} activeId={featured.id} distances={distances} savedIds={savedIds} isLoggedIn={isLoggedIn} />
        <ResortDetail
          featured={featured}
          resorts={resorts}
          liftStatus={liftStatus}
          roadConditions={roadConditions}
          distances={distances}
          savedIds={savedIds}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  )
}

async function getUserData(resorts) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { distances: {}, savedIds: [], isLoggedIn: false }

    const [profileResult, savedResult] = await Promise.all([
      supabase.from('profiles').select('zip_code').eq('id', user.id).single(),
      supabase.from('saved_resorts').select('resort_id').eq('user_id', user.id),
    ])

    const distances = profileResult.data?.zip_code
      ? await getDistancesFromZip(profileResult.data.zip_code, resorts)
      : {}
    const savedIds = (savedResult.data || []).map(r => r.resort_id)

    return { distances, savedIds, isLoggedIn: true }
  } catch {
    return { distances: {}, savedIds: [], isLoggedIn: false }
  }
}
