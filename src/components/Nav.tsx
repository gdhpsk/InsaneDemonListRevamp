'use client'
import { Flex, Grid, Text } from '@radix-ui/themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Login from './Login'
import Settings from './Settings'

interface info {
  authData: Record<any, any>
}

export default function Nav({authData}: info) {
  let search = usePathname()
  return (
    <>
    <Link href="/" style={{textDecoration: "none", color: "lightblue", display: "contents"}}><Text size="6" className="header" style={{display: "flex", padding: "10px", width: "fit-content", gap: "10px"}}><img src="/favicon.ico" height="30px"></img> Insane Demon List</Text></Link>
   <Grid style={{placeItems: "end", marginTop: "-15px"}}>
   <Flex className="nav-content" gap="1">
            <Link href="/main" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/main" ? "active" : ""}>Main List</Text></Link>
            <Link href="/extended" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/extended" ? "active" : ""}>Extended List</Text></Link>
            <Link href="/legacy" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/legacy" ? "active" : ""}>Legacy List</Text></Link>
            <Link href="/leaderboards" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/leaderboards" ? "active" : ""}>Leaderboards</Text></Link>
            {!authData.user ? <Login></Login> : <Settings authData={authData}></Settings>}
        </Flex>
   </Grid>
   <br></br>
   {authData.user ? <Text as="p" align="center" weight="bold" size="3">Signed in as: {authData.user.name || authData.user.email}</Text> : ""}
    </>
  )
}