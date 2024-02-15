'use client';
import styles from "../../app/submit.module.css"
import { CaretDownIcon, CheckIcon, CrossCircledIcon, InfoCircledIcon, LetterCaseCapitalizeIcon, MagnifyingGlassIcon, PersonIcon } from '@radix-ui/react-icons';
import { Box, Button, CalloutIcon, CalloutRoot, CalloutText, Card, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuRoot, DropdownMenuTrigger, Flex, Grid, SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger, Separator, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from '@radix-ui/themes'
import { useEffect, useState } from 'react';
import Image from "next/image"
import cache from "../../../cache.json"

interface info {
    profiles: Record<any, any>,
    authData: Record<any, any>
}

export default function LeaderboardClient({profiles, authData}: info) {
  let [filteredLeaderboards, setFilteredLeaderboards] = useState(profiles)
    let [profile, setProfile] = useState<Record<any, any> | null>(null)
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState({color: "red", message: ""})
    let [openPlayers, setOpenPlayers] = useState(false)

    useEffect(() => {
      document.addEventListener("click", (e) => {
          if((e.target as any)?.classList?.contains?.("rt-TextFieldInput")) return;
          setOpenPlayers(false)
      })
  })


  return (
    <Box style={{opacity: loading ? 0.5 : 1}}>
      <Flex gap="4" style={{placeItems: "center", justifyContent: "center"}}>
      <img src="/favicon.ico" height="70px"></img>
        <Text size="9" className="header" style={{display: "contents"}}>Leaderboard Editor</Text>
        <img src="/favicon.ico" height="70px"></img>
      </Flex>
      <br></br>
      <Grid style={{placeItems: "center"}}>
            {error.message ? <><CalloutRoot color={error.color as any} style={{width: "min(600px, 100%)"}}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
            </Grid>
            <br></br>
    <Grid style={{placeItems: "center"}}>
    <Box style={{width: "min(600px, 100%)"}}>
    <TextFieldRoot mt="4">
                <TextFieldSlot style={{paddingRight: "8px"}}><PersonIcon></PersonIcon></TextFieldSlot>
                <TextFieldInput placeholder="Player Name..." id="player" onClick={(e) => {
                    setFilteredLeaderboards(profiles.filter((x:any) => x.name.toLowerCase().includes(profile?.name.toLowerCase() || "")))
                    setOpenPlayers(true)
                }} onChange={(e) => {
                    setFilteredLeaderboards(profiles.filter((x:any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                }}></TextFieldInput>
            </TextFieldRoot>
            <Card style={{display: openPlayers ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s"}}>
            <div style={{marginBottom: "10px"}}></div>
            {filteredLeaderboards.map((e:any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{margin: "-8px"}} onClick={() => {
                 setProfile(null)
                setTimeout(() =>  setProfile(e), 0);
                (document.getElementById("player") as any).value = e.name
                setOpenPlayers(false)
            }}><Text color="gray" mr="6">#{e.position}</Text> {e.name} ({e.records} points)</Text></Box>)}
            </Card>
    </Box>
    </Grid>
    <br></br>
    {profile ? <Grid style={{placeItems: "center"}}>
    <Card style={{width: "min(600px, 100%)"}}>
      <Text size="8" weight='bold' as='p' align='center'>Profile {profile.name}</Text>
      <Grid style={{placeItems: "center"}}>
      <SelectRoot size="3" defaultValue={profile.abbr || "International"} onValueChange={e => {
        if(e == "International") return setProfile({...profile, nationality: null, abbr: null})
        let prof = Object.entries(cache.nationalities).find(x => x[1] == e)
        setProfile({...profile, nationality: prof?.[0], abbr: prof?.[1]})
      }}>
        <SelectTrigger></SelectTrigger>
        <SelectContent>
          <SelectGroup>
          {Object.entries(cache.nationalities).map(e => <SelectItem value={e[1]} key={e[1]}>
        <Flex gap="3">
            <Image alt={e[1]} src={e[0] != "International" ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${e[1]}.svg` : "/international.png"} width={24} height={18}></Image>
            <Text size="3">{e[0]}</Text>
        </Flex>
    </SelectItem>)}
          </SelectGroup>
        </SelectContent>
      </SelectRoot>
      </Grid>
      <br></br>
     <TextFieldRoot>
        <TextFieldSlot><LetterCaseCapitalizeIcon></LetterCaseCapitalizeIcon></TextFieldSlot>
        <TextFieldInput defaultValue={profile.name} onChange={e => setProfile({...profile, name: e.target.value})}></TextFieldInput>
      </TextFieldRoot>
      <br></br>
     <TextFieldRoot>
        <TextFieldSlot>Account ID</TextFieldSlot>
        <TextFieldInput defaultValue={profile.accountId} onChange={e => setProfile({...profile, accountId: e.target.value || null})}></TextFieldInput>
      </TextFieldRoot>
      <br></br>
      <Flex gap="9" justify={'center'}>
        <Button size='4' onClick={async () => {
           setError({color: "blue", message: "Loading..."})
           let req = await fetch("/api/leaderboard/"+profile?.id, {
               method: "PATCH",
               headers: {
                   'content-type': 'application/json',
                   'authorization': authData.token
               },
               body: JSON.stringify(profile)
           })
           try {
               let data = await req.json()
               setError({color: "red", message: data.message})
           } catch(_) {
               setError({color: "green", message: `Successfully edited profile ${profile?.name}`})
               setTimeout(() =>{
                  setError({color: "red", message: ""})
               }, 3000)
           }
        }}>Save</Button>
        <Button disabled={authData.perms.idl < 2} color='red' size='4' onClick={async () => {
           setError({color: "blue", message: "Loading..."})
           let req = await fetch("/api/leaderboard/"+profile?.id, {
               method: "DELETE",
               headers: {
                   'content-type': 'application/json',
                   'authorization': authData.token
               }
           })
           try {
               let data = await req.json()
               setError({color: "red", message: data.message})
           } catch(_) {
            setError({color: "blue", message: "Fetching new information..."})
                                   let req = await fetch(`/api/leaderboards`, {
                                       headers: {
                                           authorization: authData.token
                                       }
                                   })
                                   let levels = await req.json()
                                    setFilteredLeaderboards(levels)
               setError({color: "green", message: `Successfully deleted profile ${profile?.name}`})
               setProfile(null)
               setTimeout(() =>{
                  setError({color: "red", message: ""})
               }, 3000)
           }
        }}>Delete</Button>
      </Flex>
    </Card>
    </Grid> : ""}
    </Box>
  )
}
