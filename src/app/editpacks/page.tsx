import { getServerSession } from 'next-auth';
import NotFound from '../not-found';
import Packs from './client';
import jwt from "jsonwebtoken"

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

  return (
    <>
    <br></br>
        <Packs
            authData={data.user}
        ></Packs>
    </>
  )
}

export const revalidate = 0