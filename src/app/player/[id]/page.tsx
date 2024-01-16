import NotFound from '@/app/not-found'
import LevelContextMenu from './contextmenu'
import ProfileContextMenu from './contextmenu'

export default async function Home(request: Record<any, any>) {
    let date = Date.now()
  let [prof_req, met_req] = await Promise.all([
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboard/${request.params.id}`, {cache: "no-cache"}),
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboard/${request.params.id}/metadata`, {cache: "no-cache"})
  ])
  if(!prof_req.ok || !met_req.ok) {
    return <NotFound></NotFound>
  }
  let req_time = Date.now() - date

  let [profile, metadata] = await Promise.all([
    await prof_req.json(),
    await met_req.json()
  ])
  
  return (
    <main>
        <br></br><br></br>
        <ProfileContextMenu
            profile={profile}
            metadata={metadata}
            time={req_time}
        ></ProfileContextMenu>
    </main>
  )
}
