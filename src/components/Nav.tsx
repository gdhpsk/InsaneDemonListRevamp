'use client'
import { Flex, Grid, Text } from '@radix-ui/themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
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
        </Flex>
   </Grid>
    </>
  )
}