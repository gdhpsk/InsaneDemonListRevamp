'use client';
import hexToRGB from '@/functions/hexToRGB'
import {calc_points_plat} from '@/functions/points'
import { ChevronLeftIcon, ChevronRightIcon, DotFilledIcon, DotsHorizontalIcon, DrawingPinFilledIcon, ExclamationTriangleIcon, ExternalLinkIcon, InfoCircledIcon, RadiobuttonIcon, SpeakerLoudIcon, StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
import { Badge, Box, Callout, Flex, Grid, HoverCard, IconButton, Table,Text } from '@radix-ui/themes'
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc"
import styles from "@/app/level.module.css"

interface info {
    level: Record<any, any>
    count: number
}

export default function Platformer({level, count}: info) {
    function secondsToTime(seconds: number) {
        let hours = (seconds - seconds % 3600) / 3600
        let minutes = (seconds - hours*3600 - seconds % 60) / 60
        let secs =parseFloat((seconds - hours*3600 - minutes*60).toFixed(3))
        return `${hours ? `${hours}:` : ""}${hours || minutes ? `${!minutes ? "00" : minutes < 10 ? `0${minutes}` : minutes}:` : ""}${!secs ? "00" : secs < 10 ? `0${secs}` : secs}`
    }
    dayjs.extend(utc)
  return (
    <div className={styles.content}>
      <Grid style={{placeItems: "center"}}>
      <Box style={{padding: "30px", width: "min(1000px, 100%)"}} className={styles.hover}>
      {level.removalReason ? <>
            <Callout.Root color="green">
                <Callout.Icon style={{height: "25px"}}><InfoCircledIcon style={{scale: 2}} /></Callout.Icon>
                <Callout.Text size="5" ml="1">This level has since been removed off the list. Scroll down below to see why.</Callout.Text>
            </Callout.Root>
            <br></br>
        </> : ""}
      {/* {level.position > 150 ? <>
            <Callout.Root color="yellow">
                <Callout.Icon style={{height: "25px"}}><ExclamationTriangleIcon style={{scale: 2}} /></Callout.Icon>
                <Callout.Text size="5" ml="1">Since this level is legacy, you CANNOT submit records for it.</Callout.Text>
            </Callout.Root>
            <br></br>
        </> : ""} */}
        {level.weekly?.date > Date.now() + 604_800 ? <>
            <Callout.Root>
                <Callout.Icon style={{height: "25px"}}><InfoCircledIcon style={{scale: "2"}} /></Callout.Icon>
                <Callout.Text size="5" ml="1">This level is the current weekly level!</Callout.Text>
            </Callout.Root>
            <br></br>
        </> : ""}
       <Flex justify={"center"} align="center" gap="9">
            {level.position != 1 ? <ChevronLeftIcon style={{scale: 6}} onClick={() => window.location.href = `/level/${level.position - 1}`}></ChevronLeftIcon> : ""}
            <Text as="p" align="center" size="9" weight="bold"><a href={`https://youtu.be/${level.ytcode}`} className="bright" target="_blank" style={{textDecoration: "none"}}>{level.position < 151 ? `${level.position}. ` : ""}{level.name}</a></Text>
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
          <HoverCard.Root>
            <HoverCard.Trigger>
            <IconButton radius="full" color="teal" disabled>
          <SpeakerLoudIcon></SpeakerLoudIcon>
          </IconButton>
            </HoverCard.Trigger>
            <HoverCard.Content>
                <Text size="3">This feature is still in the works!</Text>
            </HoverCard.Content>
        </HoverCard.Root>
        </Box>
      </Box>
      </Grid>
      <br></br><br></br>
      <Grid style={{placeItems: "center"}}>
        <Box style={{padding: "20px", width: "min(1000px, 100%)"}} className={styles.hover}>
        <Grid style={{placeItems: "center"}}>
        <Table.Root size="3" m="2" style={{width: "90%"}}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center">Points</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center">Weekly</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center">Records</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.RowHeaderCell style={{fontSize: "20px"}} align="center">{calc_points_plat(level.position)}</Table.RowHeaderCell>
                    <Table.RowHeaderCell style={{fontSize: "20px"}} align="center">
                        {level.weekly ? `${dayjs(level.weekly.date).utc(false).format("MMM D, YYYY")} - ${dayjs(level.weekly.date + 604_800_000).utc(false).format("MMM D, YYYY")}` : "never"}    
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell style={{fontSize: "20px"}} align="center">{level.list.length}</Table.RowHeaderCell>
                </Table.Row>
            </Table.Body>
        </Table.Root>
        {level.removalReason ? <><br></br><Table.Root size="3" m="2" style={{width: "90%"}}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center">Formerly</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center">Removal Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center">Reason</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.RowHeaderCell style={{fontSize: "20px"}} align="center">{level.formerRank}</Table.RowHeaderCell>
                    <Table.RowHeaderCell style={{fontSize: "20px"}} align="center">
                        {level.removalDate}
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell style={{fontSize: "20px", width: "33%"}} align="center">{level.removalReason}</Table.RowHeaderCell>
                </Table.Row>
            </Table.Body>
        </Table.Root></> : ""}
        </Grid>
        </Box>
      </Grid>
      <br></br><br></br>
      <Grid style={{placeItems: "center"}}>
        <Box style={{padding: "20px", width: "min(1000px, 100%)"}} className={styles.back}>
        <Grid style={{placeItems: "center"}}>
        <Table.Root size="3" m="2" style={{width: "90%"}}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center"><img src="https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true" width="32px"></img></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center">Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center">Link</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell style={{fontSize: "30px"}} align="center">Time</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {level.list.map((e:any) => <Table.Row key={e.id}>
                    <Table.RowHeaderCell style={{fontSize: "20px"}} align="center"><img src={e.player.nationality ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${e.player.abbr}.svg` : 'https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true'} width="32" onClick={() => {
                            window.location.href = e.player.nationality ? `/nationality/${e.player.abbr}` : "#"
                    }}></img></Table.RowHeaderCell>
                    <Table.RowHeaderCell style={{fontSize: "20px"}} align="center"><Flex align={"center"} gap='2' justify={'center'}>{e.beaten_when_weekly ? <StarFilledIcon></StarFilledIcon> : ""}{e.verification ? <DrawingPinFilledIcon></DrawingPinFilledIcon> : ""}<a href={`/player/${e.player.id}`} target="_self" style={{textDecoration: "none", lineBreak: "anywhere"}} className={styles.player}>{e.player.name}</a></Flex></Table.RowHeaderCell>
                    <Table.RowHeaderCell style={{fontSize: "20px"}} align="center">
                        <a href={e.link} target="_blank">
                        <IconButton color="violet">
                            <ExternalLinkIcon color="black" style={{scale: "1.5"}}></ExternalLinkIcon>
                        </IconButton>
                        </a>
                    </Table.RowHeaderCell>
                    <Table.RowHeaderCell style={{fontSize: "20px"}} align="center">{secondsToTime(parseFloat(e.time))}</Table.RowHeaderCell>
                </Table.Row>)}
            </Table.Body>
        </Table.Root>
        </Grid>
        </Box>
      </Grid>
      </div>
  )
}