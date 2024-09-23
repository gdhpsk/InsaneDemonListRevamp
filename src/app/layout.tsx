import './globals.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';
import Nav from '@/components/Nav';
import { getServerSession } from 'next-auth';
import jwt from "jsonwebtoken"
import { headers } from 'next/headers';
import Script from 'next/script';

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
      <head>
      <meta charSet="utf-8" />
    <meta name="viewport" content="width=900" />
    <title>Insane Demon List</title>
    <meta property="og:title" content="Geometry Dash Insane Demonlist" />
    <meta property="og:description" content="A demon list with insane demons instead of extreme demons." />
    <meta name="author" content="hpsk" />
    <meta name="keywords" content="hpsk,gdhpsk,insane,demon,list,demonlist,hardest,levels,geometry dash, gd" />
    <meta name="description" content="A demon list with insane demons instead of extreme demons."></meta>
    <meta name="google-adsense-account" content="ca-pub-4543250064393866"></meta>
      </head>
      <body>
        <ThemeProvider attribute="class">
          <Theme accentColor="sky" appearance="inherit">
            <Nav
              authData={data || {}}
              routes={[
                {route: "/main", name: "Main List"},
                {route: "/extended", name: "Extended List"},
                {route: "/legacy", name: "Legacy List"},
                {route: "/platformer", name: "Platformer List"},
                {route: "/leaderboards", name: "Leaderboards"},
                {route: "/packs", name: "Packs"},
                {route: "/submit", name: "Submit"}
              ]}
            ></Nav>
            {children}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  )
}
