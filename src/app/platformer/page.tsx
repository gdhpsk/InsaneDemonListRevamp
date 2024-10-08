import Level from '@/components/LevelCard'
import { Flex, Grid, Text } from '@radix-ui/themes'

export default async function Home() {

  let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/platformers`, {cache: "no-cache"})
  let levels = await req.json()
  
  return (
    <main>
      <br></br>
      <Flex gap="4" style={{placeItems: "center", justifyContent: "center"}}>
        <img src="/favicon.ico" height="70px"></img>
        <Text size="9" className="header" style={{display: "contents"}}>Platformer List</Text>
        <img src="/favicon.ico" height="70px"></img>
      </Flex>
      <br></br>
      <Text size="5" className="header">This part of the list shows the hardest insane demon platformers on the list!</Text>
        <br></br><br></br>
        {levels.filter((e: any) => !e.removalDate).map((e: Record<any, any>) => <Grid style={{placeItems: "center"}} key={e.id}><Level level={e} platformer={true}></Level><br></br></Grid>)}
        <br></br>
        <Flex gap="4" style={{placeItems: "center", justifyContent: "center"}}>
        <img src="/favicon.ico" height="70px"></img>
        <Text size="9" className="header" style={{display: "contents"}}>Removed Platformers</Text>
        <img src="/favicon.ico" height="70px"></img>
      </Flex>
      <br></br>
        <Text size="5" className="header">These levels are in the legacy list because they have been removed for a specific reason. Click on one to learn more.</Text>
        <br></br><br></br>
        {levels.filter((e: any) => e.removalDate).map((e: Record<any, any>) => <Grid style={{placeItems: "center"}} key={e.id}><Level level={e} platformer={true}></Level><br></br></Grid>)}
    </main>
  )
}

export const revalidate = 0