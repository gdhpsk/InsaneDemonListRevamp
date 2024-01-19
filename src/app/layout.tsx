import './globals.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import Nav from '@/components/Nav';
import {authOptions} from "../app/api/auth/[...nextauth]/route"
import { getServerSession } from 'next-auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const data = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <Theme accentColor="blue" appearance="dark">
          <Nav
            authData={data || {}}
          ></Nav>
          {children}
        </Theme>
      </body>
    </html>
  )
}
