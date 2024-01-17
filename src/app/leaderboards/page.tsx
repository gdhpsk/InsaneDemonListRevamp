import LeaderboardCard from '@/components/LeaderboardCard'
import Level from '@/components/LevelCard'
import { Flex, Grid, Text } from '@radix-ui/themes'
import LeaderboardClient from './client'

export default async function Home() {

  let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards`, {cache: "no-cache"})
  let profiles = await req.json()
  
  return (
    <main>
      <br></br>
      <LeaderboardClient
        profiles={profiles}
      ></LeaderboardClient>
    </main>
  )
}
