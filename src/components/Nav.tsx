import { Flex, Grid, Text } from '@radix-ui/themes'
import Link from 'next/link'

export default function Nav() {
  return (
    <>
    <Link href="/" style={{textDecoration: "none", color: "lightblue"}}><Text size="6" className="header" style={{display: "flex", padding: "10px", width: "fit-content", gap: "10px"}}><img src="https://insanedemonlist.com/favicon.ico" height="30px"></img> Insane Demon List</Text></Link>
   <Grid style={{placeItems: "end"}}>
   <Flex className="nav-content">
            <Text size="3"><Link href="/main" style={{textDecoration: "none", color: "white"}}>Main List</Link></Text>
            <Text size="3"><Link href="/extended" style={{textDecoration: "none", color: "white"}}>Extended List</Link></Text>
            <Text size="3"><Link href="/legacy" style={{textDecoration: "none", color: "white"}}>Legacy List</Link></Text>
            <Text size="3"><Link href="/leaderboards" style={{textDecoration: "none", color: "white"}}>Leaderboards</Link></Text>
        </Flex>
   </Grid>
    </>
  )
}