import { notFound } from 'next/navigation'
import { getResortsWithWeather } from '../../../lib/resorts.js'
import Nav from '../../../components/Nav.js'
import Sidebar from '../../../components/Sidebar.js'
import ResortDetail from '../../../components/ResortDetail.js'

export default async function ResortPage({ params }) {
  const { id } = await params
  const resorts = await getResortsWithWeather()
  const featured = resorts.find(resort => String(resort.id) === id)

  if (!featured) notFound()

  return (
    <div className="flex flex-col h-screen bg-neutral-950 overflow-hidden">
      <Nav />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar resorts={resorts} activeId={featured.id} />
        <ResortDetail featured={featured} resorts={resorts} />
      </div>
    </div>
  )
}
