import Submit from '@/components/Submit'
import { Box, Button, Flex, Grid, Text } from '@radix-ui/themes'
import { getServerSession } from 'next-auth'
import Image from "next/image"
import jwt from "jsonwebtoken"
import NotFound from '../not-found'

interface info {
    profiles: Record<any, any>
}

export default async function LeaderboardClient() {
    const session = await getServerSession()
    if(!session?.user) {
        return <Box>
          <br></br>
          <Text size="8" weight='bold' align='center' as='p'>You must login in order to submit!</Text>
        </Box>
    }
    let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/me`, {
        headers: {
          authorization: session?.user?.email ?  jwt.sign({id: session?.user?.email as string}, process.env.NEXTAUTH_SECRET as string) : ""
        }
      })
      let data = await req.json()
  return (
    <Box>
      <Flex gap="4" style={{placeItems: "center", justifyContent: "center"}}>
      <img src="/favicon.ico" height="70px"></img>
        <Text size="9" className="header" style={{display: "contents"}}>Submission Form</Text>
        <img src="/favicon.ico" height="70px"></img>
      </Flex>
      <br></br>
      <Text size="5" className="header">You can submit your records here!</Text>
        <br></br><br></br>
       <Submit
            authData={data}
       ></Submit>
    </Box>
  )
}

export const revalidate = 0