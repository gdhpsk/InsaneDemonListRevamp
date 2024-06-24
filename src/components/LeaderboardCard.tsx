'use client'
import styles from "../app/levelcard.module.css"
import { Card, Flex, Avatar, Box, Text, ContextMenuRoot, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, Inset, Table, TableRoot, TableHeader, TableRow, TableColumnHeaderCell, TableBody, TableCell, TableRowHeaderCell, Badge, AspectRatio, IconButton, HoverCardRoot, HoverCardTrigger, HoverCardContent, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent, ContextMenuSeparator } from "@radix-ui/themes";
import points from "../functions/points"
import hexToRGB from "../functions/hexToRGB"
import { DotFilledIcon, DotsHorizontalIcon, SpeakerLoudIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface info {
    profile: Record<any, any>,
    nationalities?: boolean
}

export default function LeaderboardCard({profile,nationalities}: info) {

  let [icons, setIcons] = useState<any>(undefined)

  useEffect(() => {
   (async () => {
    if(!nationalities && icons === undefined && profile.accountId) {
      let data = await fetch(`/api/leaderboard/${profile.id}/icons`)
      if(!data.ok) return setIcons(null)
      let json = await data.json()
      setIcons(json)
    }
   })()
  })

    return  <ContextMenuRoot>
    <ContextMenuTrigger  className={styles.levelCard}>
    <Card style={{ marginTop: "15px", width: "min(100%, 800px)" }} onClick={() => {
        window.location.href = `/${nationalities ? "nationality" : "player"}/${nationalities ? profile.abbr : profile.id}`
    }}>
      <Box p={"3"}>
        <Flex align='center' gap='2'>
            <img src={profile.nationality ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${profile.abbr}.svg` : 'https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true'} width="40" onClick={() => {
                            window.location.href = profile.nationality ? `/nationality/${profile.abbr}` : "#"
                    }}></img>
                <Text as="p" align="center" size="8" weight="bold" style={{lineBreak: "anywhere"}}>{profile.position}. {profile.name}</Text>
            </Flex>
        <Text as="p" size="5">
            {profile.records} points
        </Text>
        {profile.nationality ? <><br></br><Flex align='center' gap='2'>
                <Text as="p" align="center" size="5" weight="bold">Nationality: <a href={`/nationality/${profile.abbr}`} style={{textDecoration: "none"}}>{profile.nationality.replaceAll("_", " ")}</a></Text>
            <img src={profile.nationality ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${profile.abbr}.svg` : 'https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true'} width="24" onClick={() => {
                            window.location.href = profile.nationality ? `/nationality/${profile.abbr}` : "#"
                    }}></img>
            </Flex></> : ""}
            {!nationalities && icons ? <><br></br>
            <HoverCardRoot>
              <HoverCardTrigger onClick={(e) => {
                e.stopPropagation()
                e.target.dispatchEvent(new MouseEvent("onmouseover"))
              }}>
                <img src={icons[0]} width={"32"} style={{position: "absolute", right: "10px", bottom: "10px"}}></img>
              </HoverCardTrigger>
              <HoverCardContent>
              <Flex gap={"5"} justify={'center'} align={'center'}>
            {icons.map((e: string) => <img key={e} src={e} width={"40"}></img>)}
            </Flex>
              </HoverCardContent>
            </HoverCardRoot>
            </> : ""}
      </Box>
    <IconButton style={{position: "absolute", right: "10px", top: "10px"}} radius="full" color="teal" onClick={(e) => {
      e.stopPropagation()
    }}>
          <DotsHorizontalIcon></DotsHorizontalIcon>
          </IconButton>
            </Card>
    </ContextMenuTrigger>
    <ContextMenuContent>
    <ContextMenuItem onClick={() => {
        navigator.clipboard.writeText(Object.entries(profile).filter(e => e[1] && !["id", "position", "abbr"].includes(e[0])).map(e => {
            if(e[0] == "nationality") {e[1] = e[1].replaceAll("_", " ")}
            return `${e[0]}: ${e[1]}`
        }).join("\n"))
      }}><Flex align={"center"} gap="2"><img src="/text.png" height="20px"></img>Copy Text Format</Flex></ContextMenuItem>
      <ContextMenuSeparator></ContextMenuSeparator>
      <ContextMenuItem onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/${nationalities ? "nationality" : "player"}/${nationalities ? profile.abbr : profile.id}`)}><Flex align={"center"} gap="2"><img src="/mongo.png" height="20px"></img>Copy Profile URL</Flex></ContextMenuItem>
    {!nationalities ? <ContextMenuItem onClick={() => navigator.clipboard.writeText(profile.id)}><Flex align={"center"} gap="2"><img src="/mongo.png" height="20px"></img>Copy Object ID</Flex></ContextMenuItem> : ""}
    <ContextMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(profile))}><Flex align={"center"} gap="2"><img src="/json.png" height="20px"></img>Copy Profile JSON</Flex></ContextMenuItem>
    </ContextMenuContent>
  </ContextMenuRoot>
}