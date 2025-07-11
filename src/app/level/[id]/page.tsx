import NotFound from '@/app/not-found'
import LevelContextMenu from './contextmenu'
import AdComponent from '@/components/Ad'

export default async function Home(request: Record<any, any>) {
    let date = Date.now()
  let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/level/${request.params.id}`, {cache: "no-cache"})
    let req_time = Date.now() - date

  if(!req.ok) {
    return <NotFound></NotFound>
  }
  let c = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/levels/count`, {cache: "no-cache"})
  let {count} = await c.json()
  let level = await req.json()
  
  return (
    <main>
        <br></br>
        <LevelContextMenu
            level={level}
            count={count}
            time={req_time}
        ></LevelContextMenu>
    </main>
  )
}
