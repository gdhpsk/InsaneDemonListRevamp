'use client';
import hexToRGB from '@/functions/hexToRGB'
import calc_points from '@/functions/points'
import { ChevronLeftIcon, ChevronRightIcon, DotFilledIcon, DotsHorizontalIcon, DrawingPinFilledIcon, ExclamationTriangleIcon, ExternalLinkIcon, InfoCircledIcon, RadiobuttonIcon, SpeakerLoudIcon, StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
import { Badge, Box, CalloutIcon, CalloutRoot, CalloutText, Flex, Grid, HoverCardContent, HoverCardRoot, HoverCardTrigger, IconButton, Table, TableBody, TableColumnHeaderCell, TableHeader, TableRoot, TableRow, TableRowHeaderCell, Text } from '@radix-ui/themes'
import dayjs from 'dayjs'
import styles from "@/app/level.module.css"

interface info {
    level: Record<any, any>
    count: number
}

export default function Level({level, count}: info) {
  return (
    <div className={styles.content}>
      <Grid style={{placeItems: "center"}}>
      <Box style={{padding: "30px", backgroundColor: "rgba(50, 49, 102, 0.5)", width: "min(1000px, 100%)"}} className={styles.hover}>
      {level.removalReason ? <>
            <CalloutRoot color="green">
                <CalloutIcon style={{height: "25px"}}><InfoCircledIcon style={{scale: 2}} /></CalloutIcon>
                <CalloutText size="5" ml="1">This level has since been removed off the list. Scroll down below to see why.</CalloutText>
            </CalloutRoot>
            <br></br>
        </> : ""}
      {level.position > 150 ? <>
            <CalloutRoot color="yellow">
                <CalloutIcon style={{height: "25px"}}><ExclamationTriangleIcon style={{scale: 2}} /></CalloutIcon>
                <CalloutText size="5" ml="1">Since this level is legacy, you CANNOT submit records for it.</CalloutText>
            </CalloutRoot>
            <br></br>
        </> : ""}
        {level.weekly?.date > Date.now() + 604_800 ? <>
            <CalloutRoot>
                <CalloutIcon style={{height: "25px"}}><InfoCircledIcon style={{scale: "2"}} /></CalloutIcon>
                <CalloutText size="5" ml="1">This level is the current weekly level!</CalloutText>
            </CalloutRoot>
            <br></br>
        </> : ""}
       <Flex justify={"center"} align="center" gap="9">
            {level.position != 1 ? <ChevronLeftIcon style={{scale: 6}} onClick={() => window.location.href = `/level/${level.position - 1}`}></ChevronLeftIcon> : ""}
            <Text as="p" align="center" size="9" weight="bold"><a href={`https://youtu.be/${level.ytcode}`} target="_blank" style={{textDecoration: "none", color: "skyblue"}}>{level.position < 151 ? `${level.position}. ` : ""}{level.name}</a></Text>
            {level.position != count ? <ChevronRightIcon style={{scale: 6}} onClick={() => window.location.href = `/level/${level.position + 1}`}></ChevronRightIcon> : ""}
        </Flex>
        <Text as="p" align="center" size="6" weight="bold" color="gray">by {level.publisher}</Text>
        <br></br>
        <Flex gap="2" style={{maxWidth: "100%"}} wrap="wrap" justify="center">
                            {level.packs.length ? level.packs.sort((a: any,b: any) => a.position - b.positon).map((e: any) => {
                                let rgb = hexToRGB(e.color)
                                return <Badge style={{backgroundColor: `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, 0.5)`, color: "white", fontSize: "20px", padding: "10px", paddingRight: "17px", borderRadius: "20px", lineBreak: "anywhere"}} key={e.name}><DotFilledIcon></DotFilledIcon>{e.name}</Badge>
                            }) : ""}
            </Flex>
            <br></br>
        <hr></hr>
        <br></br>
        <Grid style={{placeItems: "center"}}>
            <iframe src={`https://www.youtube.com/embed/${level.ytcode}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </Grid>
        <br></br>
        <hr></hr>
        <br></br>
        <IconButton style={{position: "absolute", right: "10px", top: "10px"}} radius="full" color="teal" onClick={(e) => {
        e.target.dispatchEvent(new MouseEvent('contextmenu', {
            bubbles: true,
            clientX: e.currentTarget.getBoundingClientRect().x - 180,
            clientY: e.currentTarget.getBoundingClientRect().y + 50
        }))
    }}>
          <DotsHorizontalIcon></DotsHorizontalIcon>
          </IconButton>
          <Box style={{position: "absolute", right: "10px", top: "50px"}}>
          <HoverCardRoot>
            <HoverCardTrigger>
            <IconButton radius="full" color="teal" disabled>
          <SpeakerLoudIcon></SpeakerLoudIcon>
          </IconButton>
            </HoverCardTrigger>
            <HoverCardContent>
                <Text size="3">This feature is still in the works!</Text>
            </HoverCardContent>
        </HoverCardRoot>
        </Box>
      </Box>
      </Grid>
      <br></br><br></br>
      <Grid style={{placeItems: "center"}}>
        <Box style={{padding: "20px", backgroundColor: "rgba(50, 49, 102, 0.5)", width: "min(1000px, 100%)"}} className={styles.hover}>
        <Grid style={{placeItems: "center"}}>
        <TableRoot size="3" m="2" style={{width: "90%"}}>
            <TableHeader>
                <TableRow>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Points</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Weekly</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Records</TableColumnHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{calc_points(level.position)}</TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">
                        {level.weekly ? `${dayjs(level.weekly.date).format("MMM D, YYYY")} - ${dayjs(level.weekly.date + 604_800_000).format("MMM D, YYYY")}` : "never"}    
                    </TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{level.list.length}</TableRowHeaderCell>
                </TableRow>
            </TableBody>
        </TableRoot>
        {level.removalReason ? <><br></br><TableRoot size="3" m="2" style={{width: "90%"}}>
            <TableHeader>
                <TableRow>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Formerly</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Removal Date</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Reason</TableColumnHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{level.formerRank}</TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">
                        {level.removalDate}
                    </TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px", width: "33%"}} align="center">{level.removalReason}</TableRowHeaderCell>
                </TableRow>
            </TableBody>
        </TableRoot></> : ""}
        </Grid>
        </Box>
      </Grid>
      <br></br><br></br>
      <Grid style={{placeItems: "center"}}>
        <Box style={{padding: "20px", backgroundColor: "rgba(50, 49, 102, 0.5)", width: "min(1000px, 100%)"}}>
        <Grid style={{placeItems: "center"}}>
        <TableRoot size="3" m="2" style={{width: "90%"}}>
            <TableHeader>
                <TableRow>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center"><img src="https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true" width="32px"></img></TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Name</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Link</TableColumnHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {level.list.map((e:any) => <TableRow key={e.id}>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center"><img src={e.player.nationality ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${e.player.abbr}.svg` : 'https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true'} width="32" onClick={() => {
                            window.location.href = e.player.nationality ? `/nationality/${e.player.abbr}` : "#"
                    }}></img></TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center"><Flex align={"center"} gap='2' justify={'center'}>{e.beaten_when_weekly ? <StarFilledIcon></StarFilledIcon> : ""}{e.verification ? <DrawingPinFilledIcon></DrawingPinFilledIcon> : ""}<a href={`/player/${e.player.id}`} target="_self" style={{textDecoration: "none", color: "skyblue", lineBreak: "anywhere"}}>{e.player.name}</a></Flex></TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">
                        <a href={e.link} target="_blank">
                        <IconButton color="violet">
                            <ExternalLinkIcon color="black" style={{scale: "1.5"}}></ExternalLinkIcon>
                        </IconButton>
                        </a>
                    </TableRowHeaderCell>
                </TableRow>)}
            </TableBody>
        </TableRoot>
        </Grid>
        </Box>
      </Grid>
      </div>
  )
}
