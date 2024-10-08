import { getServerSession } from 'next-auth';
import jwt from "jsonwebtoken"
import NotFound from '../not-found';
import Submissions from './client';

export default async function RootLayout() {

  const session = await getServerSession()

  let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/me`, {
    headers: {
      authorization: session?.user?.email ?  jwt.sign({id: session?.user?.email as string}, process.env.NEXTAUTH_SECRET as string) : ""
    }
  })
  let data = await req.json()

  if(!data?.user?.perms?.idl) {
    return <NotFound></NotFound>
  }

  let [req1, req2] = await Promise.all([
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards?all=true`),
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admins/submissions`, {
        headers: {
            authorization: data.user.token
        }
      })
])

let [leaderboards, submissions] = await Promise.all([
    await req1.json(),
    await req2.json()
])

  return (
    <>
    <br></br>
        <Submissions
        submissions={submissions}
        authData={data.user}
        leaderboards={leaderboards}
    ></Submissions>
    </>
  )
}

export const revalidate = 0