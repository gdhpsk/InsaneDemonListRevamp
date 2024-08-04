'use client';
import LeaderboardCard from '@/components/LeaderboardCard'
import { CaretDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Box, Button, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuRoot, DropdownMenuTrigger, Flex, Grid, SelectContent, SelectItem, SelectRoot, SelectTrigger, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from '@radix-ui/themes'
import { useEffect, useState } from 'react';
import Image from "next/image"
import cache from "../../../cache.json"
import Pagination from '@/components/Pagination';

interface info {
    profs: Record<any, any>
    p: number
}

export default function LeaderboardClient({profs, p}: info) {
    let [pages, setPages] = useState(p)
    let [profiles, setProfiles] = useState(profs)
    let [nations, setNations] = useState([])
    let [page, setPage] = useState(1)
    let [type, setType] = useState<"users" | "nations">("users")
    let [loading, setLoading] = useState(false)
    let [filter, setFilter] = useState("")
    let [nationality, setNationality] = useState(["International", "International"])
    let queue = ""

    async function changePage(e: number, f: string = filter, reset: boolean = false, n: string = nationality[1], getNations: typeof type = type) {
        setLoading(true)
                    let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards${getNations == "nations" ? '/nations' : ""}?page=${e}${f ? `&name=${encodeURIComponent(f)}` : ""}${n != "International" ?  `&nationality=${n}` : ""}`, {cache: "no-cache"})
                    let profs = await req.json()
                    if(getNations == "nations") {
                        setNations(profs.profiles)
                    } else {
                        setProfiles(profs.profiles)
                    }
                    setPage(e)
                    if(reset) setPages(profs.pages)
                    setLoading(false)
    }

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
            <br></br>
        <TextFieldRoot style={{width: "min(100%, 800px)"}}>
            <TextFieldSlot>
                <MagnifyingGlassIcon style={{scale: 1.8, padding: "5px"}}></MagnifyingGlassIcon>
            </TextFieldSlot>
            <TextFieldInput style={{fontSize: "20px", height: "40px"}} placeholder='Search...' onChange={async (e) => {
                let key = crypto.randomUUID()
                queue = key
                setTimeout(() => {
                    if(queue != key) return;
                    setFilter(e.target.value)
                    changePage(1, e.target.value, true)
                }, 1000)
            }}></TextFieldInput>
        </TextFieldRoot>
        </Grid>
        <br></br>
        <Grid style={{placeItems: "center"}}>
            <SelectRoot defaultValue={JSON.stringify(nationality)} onValueChange={(e) => {
                let value = JSON.parse(e)
                 setNationality(value)
                 changePage(1, undefined, true, value[1])
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
                                let t: typeof type = type == "nations" ? "users" : 'nations'
                                setType(t)
                                changePage(1, undefined, true, undefined, t)
                            }}>
                            <Text size="5" as="p" align='center'>Switch to {type == "users" ? "nationalities" : "players"} leaderboard</Text>
                    </Button>
                    <br></br>
                    <Pagination
                page={page}
                count={pages}
                onChange={changePage}
            ></Pagination>
            <Text size={"1"} style={{marginTop: "5px", opacity: 0.5}} color={"gray"}>Click the &quot;...&quot; to specify a page!</Text>
        </Grid>
        <br></br>
        {(type == "users" ? profiles : nations).map((e: Record<any, any>, i: number) => <Grid style={{placeItems: "center"}} key={e.id}><LeaderboardCard profile={e} nationalities={type == "nations"}></LeaderboardCard><br></br></Grid>)}
    </Box>
  )
}
