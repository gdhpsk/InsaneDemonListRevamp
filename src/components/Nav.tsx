'use client'
import { CalloutIcon, CalloutRoot, CalloutText, Flex, Grid, PopoverContent, PopoverRoot, PopoverTrigger, Text } from '@radix-ui/themes'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import Login from './Login'
import { ReactElement, useEffect, useState } from 'react'
import { CheckIcon, GearIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'

interface info {
  authData: Record<any, any>,
  routes: Array<{route: string, name: string | ReactElement, auth?: boolean}>
}

export default function Nav({authData, routes}: info) {
  let [data, setData] = useState(authData)
  let search = usePathname()
  let query = useSearchParams()
  let [reset, setReset] = useState(query.get("reset"))
  let [verified, setVerified] = useState(!!query.get("verified"))
  let [width, setWidth] = useState(0)

  let getWidth = () => typeof window === 'undefined' ? 0 : window.innerWidth

  useEffect(() => {
    setWidth(getWidth())
  })

  useEffect(() => {
    if(reset) {
      history.replaceState(null, "", "/")
      setTimeout(() => setReset(""), 3000)
    }
    if(verified) {
      history.replaceState(null, "", "/")
      setTimeout(() => setVerified(!verified), 3000)
    }
  })

  return (
    <>
    <Link href="/" style={{textDecoration: "none", color: "lightblue", display: "contents"}}><Text size="6" className="header" style={{display: "flex", padding: "10px", width: "fit-content", gap: "10px"}}><img src="/favicon.ico" height="30px"></img> Insane Demon List</Text></Link>
   <Grid style={{placeItems: "end", marginTop: "-15px"}}>
    {width > 1100 ? <Flex className="nav-content" gap="1">
            {routes.filter(x => !x.auth).map(e => <Link key={e.route} href={e.route} style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == e.route ? "active" : ""}>{e.name}</Text></Link>)}
            {data.user ? routes.filter(x => x.auth).map(e => <Link key={e.route} href={e.route} style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == e.route ? "active" : ""}>{e.name}</Text></Link>) : ""}
            {/* <Link href="/main" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/main" ? "active" : ""}>Main List</Text></Link>
            <Link href="/extended" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/extended" ? "active" : ""}>Extended List</Text></Link>
            <Link href="/legacy" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/legacy" ? "active" : ""}>Legacy List</Text></Link>
            <Link href="/leaderboards" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/leaderboards" ? "active" : ""}>Leaderboards</Text></Link>
            <Link href="/packs" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/packs" ? "active" : ""}>Packs</Text></Link>
            {data.user ? <Link href="/submit" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/submit" ? "active" : ""}>Submit</Text></Link> : ""} */}
            {!data.user ? <Login></Login> : <Link href="/profile" style={{textDecoration: "none", color: "white"}}><Text size="3" className={search == "/profile" ? "active" : ""}><GearIcon></GearIcon></Text></Link>}
        </Flex> : width == 0 ? "" : <Flex className="nav-content" gap="1"><PopoverRoot>
            <PopoverTrigger><Text size="3" style={{padding: "20px", marginTop: "15px"}}><HamburgerMenuIcon></HamburgerMenuIcon></Text></PopoverTrigger>
            <PopoverContent>
            {routes.filter(x => !x.auth).map(e => <><Link href={e.route} style={{textDecoration: "none", color: "white"}} className={search == e.route ? "active entry" : "entry"}><Text size="3">{e.name}</Text></Link><br></br><br></br><br></br></>)}
            {data.user ? routes.filter(x => x.auth).map(e => <><Link href={e.route} style={{textDecoration: "none", color: "white"}} className={search == e.route ? "active entry" : "entry"}><Text size="3">{e.name}</Text></Link><br></br><br></br><br></br></>) : ""}
            {!data.user ? <Login></Login> : <Link href="/profile" style={{textDecoration: "none", color: "white"}} className={search == "/profile" ? "active entry" : "entry"}><Text size="3">Settings</Text></Link>}
            </PopoverContent>
          </PopoverRoot></Flex>}
   </Grid>
   <br></br>
   {reset ? <Grid style={{placeItems: "center"}}><CalloutRoot color="green">
    <CalloutIcon><CheckIcon></CheckIcon></CalloutIcon>
    <CalloutText>Successfully reset password for {reset}!</CalloutText>
   </CalloutRoot><br></br></Grid> : verified ? <Grid style={{placeItems: "center"}}><CalloutRoot color="green">
    <CalloutIcon><CheckIcon></CheckIcon></CalloutIcon>
    <CalloutText>Successfully verified email {data.user?.email || ""}!</CalloutText>
   </CalloutRoot><br></br></Grid> : ""}
          {search != "/" || !data.user ?  "" : data.user.emailVerified ? <Text as="p" align="center" weight="bold" size="3">Signed in as: {data.user.name}</Text> : <Text as="p" align="center" weight="bold" size="3">Verify your email ({data.user.email}) for your account {data.user.name}!</Text>}
    </>
  )
}