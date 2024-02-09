import './globals.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import Nav from '@/components/Nav';
import { getServerSession } from 'next-auth';
import jwt from "jsonwebtoken"
import { GearIcon } from '@radix-ui/react-icons';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession()

  let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/me`, {
    headers: {
      authorization: session?.user?.email ?  jwt.sign({id: session?.user?.email as string}, process.env.NEXTAUTH_SECRET as string) : ""
    }
  })
  let data = await req.json()

  return (
    <html lang="en">
      <body>
        <Theme accentColor="blue" appearance="dark">
          <Nav
            authData={data || {}}
            routes={[
              {route: "/main", name: "Main List"},
              {route: "/extended", name: "Extended List"},
              {route: "/legacy", name: "Legacy List"},
              {route: "/leaderboards", name: "Leaderboards"},
              {route: "/packs", name: "Packs"},
              {route: "/submit", name: "Submit", auth: true}
            ]}
          ></Nav>
          {children}
        </Theme>
      </body>
    </html>
  )
}
