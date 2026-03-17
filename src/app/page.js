import { supabase } from '../lib/supabase.js'

export default async function Home() {
  const { data: resorts, error } = await supabase
    .from('resorts')
    .select('*')

  if (error) {
    console.error(error)
    return <div>Error loading resorts</div>
  }

  return (
    <main>
      <h1>Snowscape</h1>
      {resorts.map(resort => (
        <div key={resort.id}>
          <h2>{resort.name}</h2>
          <p>{resort.state} · {resort.summit_elevation}ft</p>
        </div>
      ))}
    </main>
  )
}