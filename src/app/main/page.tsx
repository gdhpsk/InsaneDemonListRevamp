import Level from '@/components/LevelCard'
import { Flex, Grid, Text } from '@radix-ui/themes'

export default async function Home() {

  let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/levels?start=0&end=75`, {cache: "no-cache"})
  let levels = await req.json()
  
  return (
    <main>
      <br></br>
      <Flex gap="4" style={{placeItems: "center", justifyContent: "center"}}>
        <img src="/favicon.ico" height="70px"></img>
        <Text size="9" className="header" style={{display: "contents"}}>Main List</Text>
        <img src="/favicon.ico" height="70px"></img>
      </Flex>
      <br></br>
      <Text size="5" className="header">This part of the list shows the top 75 hardest insane demons on the list!</Text>
        <br></br><br></br>
        {levels.map((e: Record<any, any>) => <Grid style={{placeItems: "center"}} key={e.id}><Level level={e}></Level><br></br></Grid>)}
    </main>
  )
}

export const revalidate = 0