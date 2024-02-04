import { getServerSession } from 'next-auth';
import jwt from "jsonwebtoken"
import NotFound from '../not-found';
import { Flex, Text, Box, Grid } from '@radix-ui/themes';
import Image from "next/image"
import Admin from '@/components/Admin';
import EditLevels from './client';

export default async function RootLayout() {

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
  let [req1, req2] = await Promise.all([
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/levels?start=0`),
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards`)
])

let [levels, leaderboards] = await Promise.all([
    await req1.json(),
    await req2.json()
])

  return (
   <EditLevels
        authData={data.user}
        levels={levels}
        leaderboards={leaderboards}
   ></EditLevels>
  )
}
