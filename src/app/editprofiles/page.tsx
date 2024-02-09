import jwt from "jsonwebtoken"
import LeaderboardClient from './client'
import NotFound from '../not-found'
import { getServerSession } from 'next-auth'

export default async function Home() {

    const session = await getServerSession()

    let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/me`, {
      headers: {
        authorization: session?.user?.email ?  jwt.sign({id: session?.user?.email as string}, process.env.NEXTAUTH_SECRET as string) : ""
      }
    })
    let data = await req.json()
    if((data.user?.perms?.idl || 0) < 1) {
      return <NotFound></NotFound>
    }

  let req1 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards`, {cache: "no-cache"})
  let profiles = await req1.json()
  
  return (
    <main>
      <br></br>
      <LeaderboardClient
        profiles={profiles}
        authData={data.user}
      ></LeaderboardClient>
    </main>
  )
}

export const revalidate = 0