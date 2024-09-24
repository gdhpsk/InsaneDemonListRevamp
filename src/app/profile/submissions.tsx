'use client'

import { CheckIcon, Cross1Icon, CrossCircledIcon, FileIcon, InfoCircledIcon, Link1Icon, Pencil1Icon, PersonIcon, StopwatchIcon } from "@radix-ui/react-icons"
import { Box, Button, Callout, Card, Dialog, Flex, Grid, IconButton, ScrollArea, SegmentedControl, Separator, Table, Tabs, Text, TextArea, TextField } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import styles from "../account.module.css"
import cache from "../../../cache.json"

interface info {
    data: Record<any, any>
}

export default function ProfileSubmissions({ data }: info) {
    function timeToSeconds(time: string) {
        let multipliers = [1, 60, 3600]
        let times = time.split(":").reverse().map((e, i) => parseFloat(e) * multipliers[i])
        return times.reduce((acc, cur) => acc + cur).toFixed(3)
    }
    function secondsToTime(seconds: number) {
        let hours = (seconds - seconds % 3600) / 3600
        let minutes = (seconds - hours*3600 - seconds % 60) / 60
        let secs = (seconds - hours*3600 - minutes*60).toFixed(3)
        return [hours, minutes, secs]
    }
    let [error, setError] = useState({color: "red", message: ""})
    let [allSubmissions, setAllSubmissions] = useState<Array<any> | null>(null)
    let [submission, setSubmission] = useState<Record<any, any> | null>(null)
    let [editing, setEditing] = useState(false)
    let [levels, setLevels] = useState([])
    let [leaderboards, setLeaderboards] = useState([])
    let [filteredLevels, setFilteredLevels] = useState([])
    let [filteredPlayers, setFilteredPlayers] = useState([])
    let [openLevels, setOpenLevels] = useState(false)
    let [openPlayers, setOpenPlayers] = useState(false)
    let [gdType, setGDType] = useState<"classic" | "platformer">("classic")
    let [type, setType] = useState("all")
    let [edits, setEdits] = useState({
        video: {
            valid: true,
            text: "",
            ytcode: ""
        },
        player: "",
        level: "",
        publisher: "",
        type: "",
        time: 0,
        comments: ""
    })

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if((e.target as any)?.classList?.contains?.("rt-TextFieldInput")) return;
            setOpenLevels(false)
            setOpenPlayers(false)
        });
        (async () => {
            let [req1] = await Promise.all([
                await fetch(`/api/user/submissions`, {
                    headers: {
                        authorization: data.token
                    }
                })
            ])

            let [ submissions] = await Promise.all([
                await req1.json()
            ])
            setAllSubmissions(submissions)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${gdType == "classic" ? "level" : "platformer"}s?start=0`)
            let json = await req.json()
            setLevels(json)
            setFilteredLevels(json)
            let req1 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards${gdType == "classic" ? "" : "/platformer"}?all=true`)
            let json1 = await req1.json()
            setLeaderboards(json1)
            setFilteredPlayers(json1)
        })()
    }, [gdType])

    function getYoutubeVideoId(link: string) {
        const text = link.trim()
        let urlPattern = /https?:\/\/(?:www\.)?[\w\.-]+(?:\/[\w\.-]*)*(?:\?[\w\.\-]+=[\w\.\-]+(?:&[\w\.\-]+=[\w\.\-]+)*)?\/?/g
        let url = text.match(urlPattern)

        if (url && (url[0].includes('youtube') || url[0].includes('youtu.be'))) {
            const youtubeRegExp = /http(?:s?):\/\/(?:m\.|www\.)?(?:m\.)?youtu(?:be\.com\/(?:watch\?v=|embed\/|shorts\/)|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?\=]*)?/;
            const match = text.match(youtubeRegExp)
            const fullLink = url[0]
            let videoId = null
            if (match) {
                videoId = match[1]
            }
            return { fullLink, videoId, hasExtraText: text.replace(fullLink, '').trim().length > 0 }
        } else {
            return { fullLink: null, videoId: null, hasExtraText: true }
        }
    }

    return (
        <Grid style={{placeItems: "center"}}>
            <SegmentedControl.Root size="3" defaultValue="classic" onValueChange={e => setGDType(e as any)}>
                <SegmentedControl.Item value="classic">Classic</SegmentedControl.Item>
                <SegmentedControl.Item value="platformer">Platformer</SegmentedControl.Item>
            </SegmentedControl.Root>
            <br></br><br></br>
            <Tabs.Root defaultValue="all">
  <Tabs.List size="2">
    <Tabs.Trigger value="active" onClick={() => setType("active")}>Active</Tabs.Trigger>
    <Tabs.Trigger value="all" onClick={() => setType("all")}>All</Tabs.Trigger>
    <Tabs.Trigger value="archived" onClick={() => setType("archived")}>Archived</Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>
<br></br>
        <ScrollArea style={{ height: "1000px" }}>
            {allSubmissions?.filter((e:any) => gdType == e.type && (type == "all" ? true : type == "active" ? !e.status : e.status))?.length ? allSubmissions.filter((e:any) => gdType == e.type && (type == "all" ? true : type == "active" ? !e.status : e.status)).map((e: any, i: number) => <><Dialog.Root key={i}>
                <Dialog.Trigger className={styles.submission}>
                    <Card key={i} style={{ marginRight: "40px" }} onClick={() => {
                        e.time = parseFloat(e.time as any)
                        setSubmission(e)
                        setEdits({
                            video: {
                                valid: true,
                                text: e.link,
                                ytcode: getYoutubeVideoId(e.link).videoId || ""
                            },
                            player: e.player,
                            level: e.level,
                            publisher: e.publisher,
                            type: e.type,
                            time: e.time,
                            comments: e.comments
                        })
                    }}>
                        <Text size="8" weight="bold">Submission #{i + 1}</Text>
                        <br></br>
                        <Text size="5">{e.level} by {e.publisher}</Text>
                        <br></br>
                        {e.type == "classic" ? "" : <><Text size="2" as="p">Time: {secondsToTime(e.time).join(":")}</Text>
                        <br></br></>}
                        <Text size="3">By {e.player}</Text>
                        <br></br>
                        <Text size="1">Status: {cache.status[e.status]}</Text>
                        {e.status == 2 ? <><br></br>
                        <Text size="1">Rejection reason: {e.reason}</Text></> : ""}
                    </Card>
                </Dialog.Trigger>
                <Dialog.Content>
                    <Flex justify={'end'}> 
                    {!editing ? 
                                <IconButton disabled={e.status != 0} onClick={() => {
                                    setEditing(true)
                                    setEdits({
                                        video: {
                                            valid: true,
                                            text: e.link,
                                            ytcode: getYoutubeVideoId(e.link).videoId || ""
                                        },
                                        player: e.player,
                                        level: e.level,
                                        type: e.type,
                                        time: e.time,
                                        publisher: e.publisher,
                                        comments: e.comments
                                    })
                                }} style={{position: "absolute", marginTop: "40px"}}><Pencil1Icon></Pencil1Icon></IconButton>
                                :
                                <Box style={{position: "absolute", marginTop: "40px"}}>
                                <IconButton  disabled={!edits.video.valid || !edits.video.text || !edits.level || !edits.player || !edits.publisher} onClick={async () => {
                                     setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/user/submissions", {
                                         method: "PATCH",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': data.token
                                         },
                                         body: JSON.stringify({
                                            id: submission?.id,
                                            link: edits.video.text,
                                            player: edits.player,
                                            level: edits.level,
                                            publisher: edits.publisher,
                                            type: edits.type,
                                            time: edits.time,
                                            comments: edits.comments
                                         })
                                     })
                                     try {
                                         let data = await req.json()
                                         setError({color: "red", message: data.message})
                                     } catch(_) {
                                        setError({color: "blue", message: "Fetching new information..."})
                                        let req = await fetch(`/api/user/submissions`, {
                                            headers: {
                                                authorization: data.token
                                            }
                                        })
                                        let submissions = await req.json()
                                        setAllSubmissions(submissions)
                                        setSubmission(allSubmissions?.find(e => e.id == submission?.id))
                                         setError({color: "green", message: `Successfully edited submission`})
                                         setTimeout(() => {
                                            setError({color: "red", message: ""})
                                            setEditing(false)
                                         }, 3000)
                                     }
                                }}><CheckIcon></CheckIcon></IconButton>
                                <br></br>
                                <br></br>
                                <IconButton color="red" onClick={() => {
                                    setEditing(false)
                                    setEdits({
                                        video: {
                                            valid: true,
                                            text: e.link,
                                            ytcode: getYoutubeVideoId(e.link).videoId || ""
                                        },
                                        player: e.player,
                                        level: e.level,
                                        publisher: e.publisher,
                                        type: e.type,
                                        time: e.time,
                                        comments: e.comments
                                    })
                                }}><Cross1Icon></Cross1Icon></IconButton>
                            </Box>}
                    </Flex>
                    <Dialog.Title size="8" weight="bold" as="h1" align="center">{e.level} by {e.publisher}</Dialog.Title>
                    <Dialog.Description align={'center'} size="6">By {e.player}</Dialog.Description>
                    {e.type == "platformer" ? <Text size="5" align="center" as="p">Time: {secondsToTime(e.time).join(":")}</Text> :  ""}
                    <br></br>
                    {!editing ? <><Grid style={{placeItems: "center"}}>
                    <iframe  src={`https://www.youtube.com/embed/${getYoutubeVideoId(e.link).videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </Grid>
                    <br></br>
                    <Text size="4" align="center" as="p">{e.comments || "No comments were provided."}</Text>
                    <br></br>
                    <Text size="1">Submitted at: {e.createdAt}</Text>
                    <br></br>
                    <Text size="1">Edited at: {e.editedAt}</Text>
                    <br></br>
                    <Text size="1">Status: {cache.status[e.status]}</Text>
                    {e.status == 2 ? <><br></br>
                        <Text size="1">Rejection reason: {e.reason}</Text></> : ""}
                    <br></br>
                    <br></br>
                    <Grid style={{ placeItems: "center" }}>
                        <Dialog.Close>
                            <Button size="3" color='red'>Close</Button>
                        </Dialog.Close>
                    </Grid></> : <>
                    <Text size="7" weight="bold">Level Name</Text>
            <br></br>
            <Text size="2" style={{lineHeight: "20px"}}>Case sensitive</Text>
                    <Flex gap="4" align='center' mt="4">
            <TextField.Root style={{width: 225}} defaultValue={edits.level} placeholder="Level Name..." id="level" onClick={(e) => {
                    setFilteredLevels(levels.filter((x:any) => x.name.toLowerCase().includes(edits?.level.toLowerCase())))
                    setOpenLevels(true)
                }} onChange={(e) => {
                        setEdits({...edits, level: e.target.value});
                        setFilteredLevels(levels.filter((x:any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                }}>
                <TextField.Slot style={{paddingRight: "8px"}}><FileIcon></FileIcon></TextField.Slot>
            </TextField.Root>
            <Text>By</Text>
            <TextField.Root defaultValue={edits.publisher} placeholder="Publisher..." id="publisher" onClick={(e) => {
                    setFilteredLevels(levels.filter((x:any) => x.publisher.toLowerCase().includes(edits?.publisher.toLowerCase())))
                    setOpenLevels(true)
                }} onChange={(e) => {
                        setEdits({...edits, publisher: e.target.value});
                        setFilteredLevels(levels.filter((x:any) => x.publisher.toLowerCase().includes(e.target.value.toLowerCase())))
                }}>
            </TextField.Root>
            </Flex>
            <Card style={{display: openLevels ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s"}}>
            <div style={{marginBottom: "10px"}}></div>
            {filteredLevels.map((e:any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{margin: "-8px"}} onClick={() => {
                 setEdits({...edits, level: e.name, publisher: e.publisher});
                (document.getElementById("level") as any).value = e.name;
                (document.getElementById("publisher") as any).value = e.publisher
                setOpenLevels(false)
            }}><Text color="gray" mr="6">#{e.position}</Text> {e.name} by {e.publisher}</Text></Box>)}
            </Card>
            <br></br>
            <Text size="7" weight="bold">Player Name</Text>
            <br></br>
            <Text size="2" style={{lineHeight: "20px"}}>Case sensitive</Text>
            <TextField.Root mt="4" defaultValue={edits.player} placeholder="Player Name..." id="player" onClick={(e) => {
                    setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(edits?.player.toLowerCase())))
                    setOpenPlayers(true)
                }} onChange={(e) => {
                    setEdits({...edits, player: e.target.value});
                    setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                }}>
                <TextField.Slot style={{paddingRight: "8px"}}><PersonIcon></PersonIcon></TextField.Slot>
            </TextField.Root>
            <Card style={{display: openPlayers ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s"}}>
            <div style={{marginBottom: "10px"}}></div>
            {filteredPlayers.map((e:any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{margin: "-8px"}} onClick={() => {
                 setEdits({...edits, player: e.name});
                (document.getElementById("player") as any).value = e.name
                setOpenPlayers(false)
            }}><Text color="gray" mr="6">#{e.position}</Text> {e.name} ({e.records || 0} points)</Text></Box>)}
            </Card>
            <br></br>
            {e.type == "platformer" ? <><Card style={{ padding: "10px", width: "min(100%, 600px)" }}>
                <Text size="7" weight="bold">Time</Text>
                <TextField.Root mt="4" placeholder="hh:mm:ss.SSS / mm:ss.SSS / ss.SSS" defaultValue={secondsToTime(edits.time).join(":")} onChange={(e) => {
                    setEdits({ ...edits, time: parseFloat(timeToSeconds(e.target.value)) })
                }}>
                    <TextField.Slot style={{ paddingRight: "8px" }}><StopwatchIcon></StopwatchIcon></TextField.Slot>
                </TextField.Root>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>Hours</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Minutes</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>Seconds</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.RowHeaderCell>{secondsToTime(edits.time)[0]}</Table.RowHeaderCell>
                            <Table.Cell>{secondsToTime(edits.time)[1]}</Table.Cell>
                            <Table.Cell>{secondsToTime(edits.time)[2]}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Card>
            <br></br></> : ""}
            <Text size="7" weight="bold">YouTube Link</Text>
            <TextField.Root mt="4" defaultValue={edits.video.text} placeholder="YouTube Link..." onChange={(e) => {
                    let valid = getYoutubeVideoId(e.target.value)
                    setEdits({...edits,
                        video: {
                            valid: valid.videoId?.length == 11,
                            ytcode: valid.videoId || "",
                            text: e.target.value
                        }
                    })
                }}>
                <TextField.Slot style={{paddingRight: "8px"}}><Link1Icon></Link1Icon></TextField.Slot>
            </TextField.Root>
            {!edits.video.valid ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{scale: 1.4}}></CrossCircledIcon>
                    <Text size="3" color="red" style={{lineHeight: "20px"}}>Not a valid youtube video</Text>
               </Flex> : ""}
               <br></br>
               <Grid style={{placeItems: "center"}}>
                    <iframe src={`https://www.youtube.com/embed/${edits.video.ytcode}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
               </Grid>
               <br></br>
               <Text size="7" weight="bold">Comments?</Text>
            <br></br>
            <Text size="2" style={{lineHeight: "20px"}}>Input your nationality / account ID here if you want</Text>
            <br></br>
            <br></br>
                <TextArea defaultValue={edits.comments} placeholder="Comments..." style={{width: "100%"}} onChange={(e) =>  setEdits({...edits, comments: e.target.value})}></TextArea>
            <br></br>
            {error.message ? <><Callout.Root color={error.color as any}>
                <Callout.Icon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </Callout.Icon>
                <Callout.Text size="3" ml="-1">{error.message}</Callout.Text>
            </Callout.Root><br></br></> : ""}
            <Grid style={{ placeItems: "center" }}>
                            <Button size="3" color='red' onClick={async (e) => {
                                     setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/user/submissions", {
                                         method: "DELETE",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': data.token
                                         },
                                         body: JSON.stringify({
                                             id: submission?.id
                                         })
                                     })
                                     try {
                                         let data = await req.json()
                                         setError({color: "red", message: data.message})
                                     } catch(_) {
                                        setError({color: "blue", message: "Fetching new information..."})
                                        let req = await fetch(`/api/user/submissions`, {
                                            headers: {
                                                authorization: data.token
                                            }
                                        })
                                        let submissions = await req.json()
                                         setError({color: "green", message: `Successfully deleted submission`})
                                         setTimeout(() =>{
                                            document.getElementById("close")?.click()
                                            setError({color: "red", message: ""})
                                            setAllSubmissions(submissions)
                                         }, 3000)
                                     }
                                }}>Delete</Button>
                                <br></br>
                                <Dialog.Close>
                                    <Button id='close' color='red' onClick={() => {
                                        setEditing(false)
                                        setSubmission(null)
                                    }}>Close</Button>
                                </Dialog.Close>
                    </Grid>
                    </>}
                </Dialog.Content>
            </Dialog.Root><br></br></>) : allSubmissions?.filter((e:any) => gdType == e.type && (type == "all" ? true : type == "active" ? !e.status : e.status))?.length == 0 ? <Text size="8" weight="bold" as="p" align={'center'}>There are no submissions in this section yet!</Text> : <Text size="8" weight="bold" as="p" align={'center'}>Loading...</Text>}
        </ScrollArea>
        </Grid>
    )
}