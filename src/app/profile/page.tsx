import { getServerSession } from 'next-auth';
import jwt from "jsonwebtoken"
import NotFound from '../not-found';
import ProfileClient from './client';

export default async function RootLayout() {

  const session = await getServerSession()
  if(!session?.user) {
    return <NotFound></NotFound>
  }

  let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/me`, {
    headers: {
      authorization: session?.user?.email ?  jwt.sign({id: session?.user?.email as string}, process.env.NEXTAUTH_SECRET as string) : ""
    }
  })
  let data = await req.json()

  return (
    <>
    <br></br>
        <ProfileClient
            account={data.user}
        ></ProfileClient>
    </>
  )
}

export const revalidate = 0