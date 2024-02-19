'use client';
import LeaderboardCard from '@/components/LeaderboardCard'
import { CaretDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Box, Button, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuRoot, DropdownMenuTrigger, Flex, Grid, SelectContent, SelectItem, SelectRoot, SelectTrigger, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from '@radix-ui/themes'
import { useState } from 'react';
import Image from "next/image"
import cache from "../../../cache.json"

interface info {
    profiles: Record<any, any>
}

export default function LeaderboardClient({profiles}: info) {
    let [nations, setNations] = useState([])
    let [type, setType] = useState<"users" | "nations">("users")
    let [loading, setLoading] = useState(false)
    let [filter, setFilter] = useState("")
    let [nationality, setNationality] = useState(["International", "International"])

  return (
    <Box style={{opacity: loading ? 0.5 : 1, overflowX: "hidden"}}>
      <Flex gap="4" style={{placeItems: "center", justifyContent: "center"}}>
      <img src="/favicon.ico" height="70px"></img>
        <Text size="9" className="header" style={{display: "contents"}}>Leaderboards</Text>
        <img src="/favicon.ico" height="70px"></img>
      </Flex>
      <br></br>
      <Text size="5" className="header">This part of the list shows the best {type == "users" ? "players" : "countries"} on the Insane Demon List!</Text>
        <br></br><br></br>
        <Grid style={{placeItems: "center"}}>
        <TextFieldRoot style={{width: "min(100%, 800px)"}}>
            <TextFieldSlot>
                <MagnifyingGlassIcon style={{scale: 1.8, padding: "5px"}}></MagnifyingGlassIcon>
            </TextFieldSlot>
            <TextFieldInput style={{fontSize: "20px", height: "40px"}} placeholder='Search...' onChange={(e) => setFilter(e.target.value)}></TextFieldInput>
        </TextFieldRoot>
        </Grid>
        <br></br>
        <Grid style={{placeItems: "center"}}>
            <SelectRoot defaultValue={JSON.stringify(nationality)} onValueChange={(e) => {
                 setNationality(JSON.parse(e))
            }}>
                <SelectTrigger style={{width: "min(100%, 400px)", fontSize: "20px"}} color="cyan"></SelectTrigger>
                <SelectContent>
                    {Object.entries(cache.nationalities).map(e => <SelectItem key={e[1]} value={JSON.stringify(e)}>
                    <Flex gap="3">
            <Image alt={e[1]} src={e[0] != "International" ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${e[1]}.svg` : "/international.png"} width={24} height={18}></Image>
            <Text size="3">{e[0]}</Text>
        </Flex>
                    </SelectItem>)}
                </SelectContent>
            </SelectRoot>
        </Grid>
        <br></br>
        <Grid style={{placeItems: "center"}}>
                    <Button color="cyan" style={{width: "min(100%, 350px)"}} onClick={async () => {
                                setLoading(true)
                                if(type == 'users' && !nations.length) {
                                    let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards/nations`, {cache: "no-cache"})
                                    let nations = await req.json()
                                    setNations(nations)
                                }
                                setType(type == "nations" ? "users" : 'nations')
                                setLoading(false)
                            }}>
                            <Text size="5" as="p" align='center'>Switch to {type == "users" ? "nationalities" : "players"} leaderboard</Text>
                    </Button>
        </Grid>
        <br></br>
        {(type == "users" ? profiles : nations).filter((e: Record<any, any>) => e.name.toLowerCase().includes(filter.toLowerCase()) && (nationality[1] == "International" ? true : e.abbr == nationality[1])).map((e: Record<any, any>) => <Grid style={{placeItems: "center"}} key={e.id}><LeaderboardCard profile={e} nationalities={type == "nations"}></LeaderboardCard><br></br></Grid>)}
    </Box>
  )
}
