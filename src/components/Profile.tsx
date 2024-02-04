
import hexToRGB from '@/functions/hexToRGB'
import calc_points from '@/functions/points'
import { ChevronLeftIcon, ChevronRightIcon, DotFilledIcon, DotsHorizontalIcon, ExclamationTriangleIcon, ExternalLinkIcon, InfoCircledIcon, SpeakerLoudIcon } from '@radix-ui/react-icons'
import { Badge, Box, CalloutIcon, CalloutRoot, CalloutText, Flex, Grid, HoverCardContent, HoverCardRoot, HoverCardTrigger, IconButton, PopoverContent, PopoverRoot, PopoverTrigger, Table, TableBody, TableColumnHeaderCell, TableHeader, TableRoot, TableRow, TableRowHeaderCell, Text } from '@radix-ui/themes'
import dayjs from 'dayjs'
import styles from "@/app/profile.module.css"

interface info {
    profile: Record<any, any>
    metadata: Record<any, any>
    nationality?: boolean,
    icons?: Array<string>
}

export default function Profile({profile, metadata, nationality, icons}: info) {
  return (
    <div className={styles.content}>
      <Grid style={{placeItems: "center"}}>
      <Box style={{padding: "30px", backgroundColor: "rgba(50, 49, 102, 0.5)", width: "min(1000px, 100%)"}} className={styles.hover}>
       <Flex justify={"center"} align="center" gap="9">
            {metadata.last ? <ChevronLeftIcon style={{scale: 6}} onClick={() => window.location.href = `/${nationality ? "nationality" : "player"}/${metadata.last}`}></ChevronLeftIcon> : ""}
            <Flex align='center' gap='3'>
            <img src={profile.nationality ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${profile.abbr}.svg` : 'https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true'} width="80" onClick={() => {
                            window.location.href = profile.nationality ? `/nationality/${profile.abbr}` : "#"
                    }}></img>
                <Text as="p" align="center" size="9" weight="bold">{metadata.position}. {profile.name}</Text>
            </Flex>
            {metadata.next ? <ChevronRightIcon style={{scale: 6}} onClick={() => window.location.href = `/${nationality ? "nationality" : "player"}/${metadata.next}`}></ChevronRightIcon> : ""}
        </Flex>
        {profile.nationality ? <><br></br><Flex align='center' gap='2' justify={'center'}>
                <Text as="p" align="center" size="6" weight="bold">Nationality: <a href={`/nationality/${profile.abbr}`} style={{textDecoration: "none"}}>{profile.nationality.replaceAll("_", " ")}</a></Text>
            <img src={profile.nationality ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${profile.abbr}.svg` : 'https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true'} width="32" onClick={() => {
                            window.location.href = profile.nationality ? `/nationality/${profile.abbr}` : "#"
                    }}></img>
            </Flex></> : ""}
        <br></br>
        {icons ? <>
        <Flex gap={"7"} justify={'center'} align={'center'}>
            {icons.map(e => <img key={e} src={e} width={"50"}></img>)}
        </Flex>
        <br></br></> : ""}
        <Flex gap="2" style={{maxWidth: "100%"}} wrap="wrap" justify="center">
                            {profile.packs.length ? profile.packs.sort((a: any,b: any) => a.position - b.positon).map((e: any) => {
                                let rgb = hexToRGB(e.color)
                                return <PopoverRoot key={e.id}>
                                    <PopoverTrigger className={styles.pack}>
                                        <Badge style={{backgroundColor: `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, 0.5)`, color: "white", fontSize: "20px", padding: "10px", paddingRight: "17px", borderRadius: "20px"}} key={e.name}><DotFilledIcon></DotFilledIcon>{e.name}</Badge>
                                    </PopoverTrigger>
                                    <PopoverContent style={{maxWidth: 200}}>
                                        <Text size="5" weight='bold' style={{textDecoration: "underline"}}>{e.name}</Text>
                                        <br></br>
                                        <br></br>
                                        {e.levels.map((x:any) => <div key={x.id}><Text size="5">
                                            <a href={`/level/${x.id}`} style={{textDecoration: "none"}}>{x.position > 150 ? "" : `#${x.position} - `}{x.name} by {x.publisher}</a>
                                        </Text><br></br><br></br></div>)}
                                    </PopoverContent>
                                </PopoverRoot>
                            }) : ""}
            </Flex>
        <br></br>
        <IconButton style={{position: "absolute", right: "10px", top: "10px"}} radius="full" color="teal" onClick={(e) => {
        e.target.dispatchEvent(new MouseEvent('contextmenu', {
            bubbles: true,
            clientX: e.currentTarget.getBoundingClientRect().x - 80,
            clientY: e.currentTarget.getBoundingClientRect().y + 50
        }))
    }}>
          <DotsHorizontalIcon></DotsHorizontalIcon>
          </IconButton>
      </Box>
      </Grid>
      <br></br><br></br>
      <Grid style={{placeItems: "center"}}>
        <Box style={{padding: "20px", backgroundColor: "rgba(50, 49, 102, 0.5)", width: "min(1000px, 100%)"}}>
        <Text size='9' as="p" align='center' weight='bold' style={{textDecoration: "underline"}}>Verifications</Text>
        <br></br>
        <Grid style={{placeItems: "center"}}>
        <TableRoot size="3" m="2" style={{width: "90%"}}>
            <TableHeader>
                <TableRow>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">#</TableColumnHeaderCell>
                    {nationality ? <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Player</TableColumnHeaderCell> : ""}
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Name</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Link</TableColumnHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {profile.records.filter((e:any) => e.verification).map((e:any) => <TableRow key={e.id}>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{e.level.position}</TableRowHeaderCell>
                    {nationality ? <TableRowHeaderCell style={{fontSize: "20px"}} align="center"><a href={`/player/${e.player.id}`} target="_self" style={{textDecoration: "none", color: "skyblue"}}>{e.player.name}</a></TableRowHeaderCell> : ""}
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center"><a href={`/level/${e.level.position}`} target="_self" style={{textDecoration: "none", color: "skyblue"}}>{e.level.name}</a></TableRowHeaderCell>
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
      <br></br><br></br>
      <Grid style={{placeItems: "center"}}>
        <Box style={{padding: "20px", backgroundColor: "rgba(50, 49, 102, 0.5)", width: "min(1000px, 100%)"}}>
        <Text size='9' as="p" align='center' weight='bold' style={{textDecoration: "underline"}}>List Completions</Text>
        <br></br>
        <Grid style={{placeItems: "center"}}>
        <TableRoot size="3" m="2" style={{width: "90%"}}>
            <TableHeader>
                <TableRow>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">#</TableColumnHeaderCell>
                    {nationality ? <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Player</TableColumnHeaderCell> : ""}
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Name</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Link</TableColumnHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {profile.records.filter((e:any) => e.level.position <= 150  && !e.verification).map((e:any, i: number, a: any) => {
                    let lastPos = e.level.position == a.at(-1).level.position
                    let between = !lastPos ? [a.findIndex((x: any) => x.level.position == e.level.position), a.findLastIndex((x: any) => x.level.position == e.level.position)] : a.findIndex((x: any, ind: number) => x.level.position == a.at(-1).level.position)
                    if((!lastPos && between[0] != i) || (lastPos && between != i)) return null;
                    return <TableRow key={e.id}>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{e.level.position}</TableRowHeaderCell>
                    {nationality ? <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{(lastPos ? a.slice(between) : a.slice(i, between[1]+1)).map((x:any) => <div key={x.player.id}><a href={`/player/${x.player.id}`} target="_self" style={{textDecoration: "none", color: "skyblue"}}>{x.player.name}</a><br></br><br></br></div>)}</TableRowHeaderCell> : ""}
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center"><a href={`/level/${e.level.position}`} target="_self" style={{textDecoration: "none", color: "skyblue"}}>{e.level.name}</a></TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{(lastPos ? a.slice(between) : a.slice(i, between[1]+1)).map((x:any) => <div key={x.link}><a href={x.link} target="_blank"  style={{paddingBottom: "16px", display: "inline-block"}}>
                        <IconButton color="violet">
                            <ExternalLinkIcon color="black" style={{scale: "1.5"}}></ExternalLinkIcon>
                        </IconButton>
                        </a><br></br></div>)}</TableRowHeaderCell>
                </TableRow>
                }).filter((e: any) => e)}
            </TableBody>
        </TableRoot>
        </Grid>
        </Box>
      </Grid>
      <br></br><br></br>
      <Grid style={{placeItems: "center"}}>
        <Box style={{padding: "20px", backgroundColor: "rgba(50, 49, 102, 0.5)", width: "min(1000px, 100%)"}}>
        <Text size='9' as="p" align='center' weight='bold' style={{textDecoration: "underline"}}>Legacy Completions</Text>
        <br></br>
        <Grid style={{placeItems: "center"}}>
        <TableRoot size="3" m="2" style={{width: "90%"}}>
            <TableHeader>
                <TableRow>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">#</TableColumnHeaderCell>
                    {nationality ? <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Player</TableColumnHeaderCell> : ""}
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Name</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Link</TableColumnHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {profile.records.filter((e:any) => e.level.position > 150  && !e.verification).map((e:any, i: number, a: any) => {
                    let lastPos = e.level.position == a.at(-1).level.position
                    let between = !lastPos ? [a.findIndex((x: any) => x.level.position == e.level.position), a.findLastIndex((x: any) => x.level.position == e.level.position)] : a.findIndex((x: any, ind: number) => x.level.position == a.at(-1).level.position)
                    if((!lastPos && between[0] != i) || (lastPos && between != i)) return null;
                    return <TableRow key={e.id}>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{e.level.position}</TableRowHeaderCell>
                    {nationality ? <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{(lastPos ? a.slice(between) : a.slice(i, between[1]+1)).map((x:any) => <div key={x.player.id}><a href={`/player/${x.player.id}`} target="_self" style={{textDecoration: "none", color: "skyblue"}}>{x.player.name}</a><br></br><br></br></div>)}</TableRowHeaderCell> : ""}
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center"><a href={`/level/${e.level.position}`} target="_self" style={{textDecoration: "none", color: "skyblue"}}>{e.level.name}</a></TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{(lastPos ? a.slice(between) : a.slice(i, between[1]+1)).map((x:any) => <div key={x.link}><a href={x.link} target="_blank"  style={{paddingBottom: "16px", display: "inline-block"}}>
                        <IconButton color="violet">
                            <ExternalLinkIcon color="black" style={{scale: "1.5"}}></ExternalLinkIcon>
                        </IconButton>
                        </a><br></br></div>)}</TableRowHeaderCell>
                </TableRow>
                }).filter((e: any) => e)}
            </TableBody>
        </TableRoot>
        </Grid>
        </Box>
      </Grid>
      {nationality ? <>
        <br></br><br></br>
      <Grid style={{placeItems: "center"}}>
        <Box style={{padding: "20px", backgroundColor: "rgba(50, 49, 102, 0.5)", width: "min(1000px, 100%)"}}>
        <Text size='9' as="p" align='center' weight='bold' style={{textDecoration: "underline"}}>Missing Levels</Text>
        <br></br>
        <Grid style={{placeItems: "center"}}>
        <TableRoot size="3" m="2" style={{width: "90%"}}>
            <TableHeader>
                <TableRow>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">#</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Name</TableColumnHeaderCell>
                    <TableColumnHeaderCell style={{fontSize: "30px"}} align="center">Link</TableColumnHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {profile.missing.map((e:any) => <TableRow key={e.id}>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center">{e.position > 150 ? "" : e.position}</TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center"><a href={`/level/${e.position}`} target="_self" style={{textDecoration: "none", color: "skyblue"}}>{e.name}</a></TableRowHeaderCell>
                    <TableRowHeaderCell style={{fontSize: "20px"}} align="center"><a href={`https://youtu.be/${e.ytcode}`} target="_blank"  style={{paddingBottom: "16px", display: "inline-block"}}>
                        <IconButton color="violet">
                            <ExternalLinkIcon color="black" style={{scale: "1.5"}}></ExternalLinkIcon>
                        </IconButton>
                        </a></TableRowHeaderCell>
                </TableRow>)}
            </TableBody>
        </TableRoot>
        </Grid>
        </Box>
      </Grid>
      </> : ""}
      </div>
  )
}
