'use client'

import styles from "../../app/submit.module.css"
import { CaretDownIcon, ChatBubbleIcon, CheckIcon, Cross1Icon, CrossCircledIcon, FileIcon, InfoCircledIcon, Link1Icon, Pencil1Icon, PersonIcon, StopwatchIcon } from "@radix-ui/react-icons"
import { Card, Grid, Box, Text, Flex, IconButton, TextField, Separator, TextArea, Callout, Button, DropdownMenu, Dialog, Tabs, Table, SegmentedControl} from "@radix-ui/themes"
import { useEffect, useState } from "react"
import cache from "../../../cache.json"
import AdComponent from "@/components/Ad"

interface info {
    submissions: Array<Record<any, any>>,
    authData: Record<any, any>,
    leaderboards: Array<Record<any, any>>
}

export default function Submissions({submissions, authData}: info) {
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
    let [levels, setLevels] = useState([])
    let [leaderboards, setLeaderboards] = useState([])
    let [error, setError] = useState({color: "red", message: ""})
    let [allSubmissions, setAllSubmissions] = useState(submissions)
    let [submission, setSubmission] = useState<Record<any, any> | null>(submissions[0])
    let [filteredLevels, setFilteredLevels] = useState(levels)
    let [filteredPlayers, setFilteredPlayers] = useState(leaderboards)
    let [openLevels, setOpenLevels] = useState(false)
    let [openPlayers, setOpenPlayers] = useState(false)
    let [type, setType] = useState("active")
    let [gdType, setGDType] = useState<"classic" | "platformer">("classic")
    let [edits, setEdits] = useState({
        video: {
            valid: true,
            text: "",
            ytcode: ""
        },
        player: "",
        level: "",
        publisher: "",
        comments: "",
        type: "",
        time: 0,
        id: ""
    })
    useEffect(() => {
        setSubmission(null)
        if(allSubmissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status)).length) {
            setSubmission(allSubmissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status))[0])
        }
    }, [type, gdType])

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

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if((e.target as any)?.classList?.contains?.("rt-TextFieldInput")) return;
            setOpenLevels(false)
            setOpenPlayers(false)
        })
    })

    useEffect(() => {
        if(submission) {
            setEdits({
                video: {
                    valid: true,
                    text: submission.link,
                    ytcode: getYoutubeVideoId(submission.link).videoId || ""
                },
                player: submission.player,
                level: submission.level,
                publisher: submission.publisher,
                comments: submission.comments,
                type: submission.type,
                time: parseFloat(submission.time),
                id: submission.id
            })
        }
    }, [submission])
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
        <Card style={{width: "min(900px, 100%)", padding: "10px"}}>
        <Grid style={{placeItems: "center"}}>
        <SegmentedControl.Root size="3" defaultValue="classic" onValueChange={e => setGDType(e as any)}>
                <SegmentedControl.Item value="classic">Classic</SegmentedControl.Item>
                <SegmentedControl.Item value="platformer">Platformer</SegmentedControl.Item>
            </SegmentedControl.Root>
            <br></br><br></br>
        <Tabs.Root defaultValue="active">
  <Tabs.List size="2">
    <Tabs.Trigger value="active" onClick={() =>{ 
        setType("active")
        setSubmission(null)
        }}>Active</Tabs.Trigger>
    <Tabs.Trigger value="all" onClick={() =>{ 
        setType("all")
        setSubmission(null)
        }}>All</Tabs.Trigger>
    <Tabs.Trigger value="archived" onClick={() =>{ 
        setType("archived")
        setSubmission(null)
        }}>Archived</Tabs.Trigger>
  </Tabs.List>
</Tabs.Root>
<br></br>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                <Button style={{width: "min(100%, 600px)", height: "max-content"}} color="indigo">
                            <Text size="5" align="left" as="p" style={{width: "100%"}}>{submission ? <span>Submission #{allSubmissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status)).findIndex(e => e.id == submission?.id)+1} by {submission.player}: {submission.level} by {submission.publisher}</span> : "No Submissions Available"}</Text>
                            {allSubmissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status)).length ? <Text style={{textAlign: "end", width: "100%"}} as="p"><CaretDownIcon style={{scale: 2.5}}></CaretDownIcon></Text> : ""}
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    {allSubmissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status)).map((e:any, i: number) => <DropdownMenu.Item key={i} className={styles.option} onClick={() => setSubmission(e)}>Submission #{i+1} by {e.player}: {e.level} by {e.publisher}</DropdownMenu.Item>)}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
            </Grid>
            <br></br>
            {error.message ? <><Callout.Root color={error.color as any}>
                <Callout.Icon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </Callout.Icon>
                <Callout.Text size="3" ml="-1">{error.message}</Callout.Text>
            </Callout.Root><br></br></> : ""}
        </Card>
        <br></br>
        <Card style={{width: "min(900px, 100%)", padding: "10px"}}>
            <Grid style={{placeItems: "center"}}>
                {submission ? <Box>
                    <Flex gap="9" align={'center'} justify={'center'}>
                {submission.status != 1 ? <Dialog.Root>
                    <Dialog.Trigger>
                        <Button size="4">Accept</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
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
            {submission.type == "platformer" ? <><Card style={{ padding: "10px", width: "min(100%, 600px)" }}>
                <Text size="7" weight="bold">Time</Text>
                <TextField.Root mt="4" placeholder="hh:mm:ss.SSS / mm:ss.SSS / ss.SSS" defaultValue={secondsToTime(edits.time).join(":")} onChange={(e) => {
                    setSubmission({ ...submission, time: parseFloat(timeToSeconds(e.target.value)) })
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
                            <Table.RowHeaderCell>{secondsToTime(submission.time)[0]}</Table.RowHeaderCell>
                            <Table.Cell>{secondsToTime(submission.time)[1]}</Table.Cell>
                            <Table.Cell>{secondsToTime(submission.time)[2]}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Card>
            <br></br></> : ""}
            <br></br>
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
            <Grid style={{ placeItems: "center" }}>
                        <Dialog.Close>
                            <Flex gap="9">
                            <Button size="3" onClick={async () => {
                                     setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/admins/submissions", {
                                         method: "PATCH",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': authData.token
                                         },
                                         body: JSON.stringify({
                                             ...edits,
                                             status: 1
                                         })
                                     })
                                     try {
                                         let data = await req.json()
                                         setError({color: "red", message: data.message})
                                     } catch(_) {
                                        setError({color: "blue", message: "Fetching new information..."})
                                        let req = await fetch(`/api/admins/submissions`, {
                                            headers: {
                                                authorization: authData.token
                                            }
                                        })
                                        let submissions = await req.json()
                                         setError({color: "green", message: `Successfully added submission ${submission?.level} by ${submission?.publisher} from ${submission?.player}`})
                                         setSubmission(null)
                                         setAllSubmissions(submissions)
                                         if(submissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status)).length) {
                                            setSubmission(submissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status))[0])
                                        }
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 1000)
                                     }
                                }}>Add</Button>
                                <Button size="3" color="red">Close</Button>
                            </Flex>
                        </Dialog.Close>
                    </Grid>
                    </Dialog.Content>
                </Dialog.Root> : ""}
                {submission.status != 0 ? <Button size="4" onClick={async () => {
                                     setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/admins/submissions", {
                                         method: "PATCH",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': authData.token
                                         },
                                         body: JSON.stringify({
                                             ...edits,
                                             status: 0
                                         })
                                     })
                                     try {
                                         let data = await req.json()
                                         setError({color: "red", message: data.message})
                                     } catch(_) {
                                        setError({color: "blue", message: "Fetching new information..."})
                                        let req = await fetch(`/api/admins/submissions`, {
                                            headers: {
                                                authorization: authData.token
                                            }
                                        })
                                        let submissions = await req.json()
                                         setError({color: "green", message: `Successfully pended submission ${submission?.level} by ${submission?.publisher} from ${submission?.player}`})
                                         setSubmission(null)
                                         setAllSubmissions(submissions)
                                         if(submissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status)).length) {
                                            setSubmission(submissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status))[0])
                                        }
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 1000)
                                     }
                                }}>Pend</Button> : ""}
                {submission.status != 2 ? <Dialog.Root>
                    <Dialog.Trigger>
                        <Button color='red' size="4">Reject</Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Title style={{fontSize: "40px"}} align='center'>Reason?</Dialog.Title>
                        <br></br>
                        <Flex gap="3">
                            <TextField.Slot><ChatBubbleIcon></ChatBubbleIcon></TextField.Slot>
                            <TextArea style={{width: "100%"}} id="reason"></TextArea>
                        </Flex>
                        <br></br><br></br>
                        <Grid style={{placeItems: "center"}}>
                        <Dialog.Close>
                       <Flex gap="6">
                       <Button color='red' size="4" onClick={async () => {
                                     setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/admins/submissions", {
                                         method: "PATCH",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': authData.token
                                         },
                                         body: JSON.stringify({
                                             ...edits,
                                             status: 2,
                                             reason: (document.getElementById("reason") as any).value
                                         })
                                     })
                                     try {
                                         let data = await req.json()
                                         setError({color: "red", message: data.message})
                                     } catch(_) {
                                        setError({color: "blue", message: "Fetching new information..."})
                                        let req = await fetch(`/api/admins/submissions`, {
                                            headers: {
                                                authorization: authData.token
                                            }
                                        })
                                        let submissions = await req.json()
                                         setError({color: "green", message: `Successfully rejected submission ${submission?.level} by ${submission?.publisher} from ${submission?.player}`})
                                         setSubmission(null)
                                         setAllSubmissions(submissions)
                                         if(submissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status)).length) {
                                            setSubmission(submissions.filter((e:any) => gdType == e.type &&  (type == "all" ? true : type == "active" ? !e.status : e.status))[0])
                                        }
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 1000)
                                     }
                                }}>Reject</Button>
                                <Button color='blue' size='4'>Cancel</Button>
                       </Flex>
                        </Dialog.Close>
                        </Grid>
                    </Dialog.Content>
                </Dialog.Root> : ""}

            </Flex>
            <br></br>
                    <Text size="9" weight="bold" as="p" align="center">{submission.level} by {submission.publisher}</Text>
                    <Text align={'center'} size="6" as='p'>By {submission.player}</Text>
                    {submission.type == "platformer" ? <Text size="5" align="center" as="p">Time: {secondsToTime(submission.time).join(":")}</Text> : ""}
                    <br></br>
                    <br></br>
                    <Grid style={{placeItems: "center"}}>
                    <iframe  src={`https://www.youtube.com/embed/${getYoutubeVideoId(submission.link).videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </Grid>
                    <br></br>
                    <br></br>
                    <Text size="8" align="center" as="p" style={{maxWidth: "800px"}}>{submission.comments || "No comments were provided."}</Text>
                    <br></br>
                    <Text size="4">Submitted at: {submission.createdAt}</Text>
                    <br></br>
                    <Text size="4">Edited at: {submission.editedAt}</Text>
                    <br></br>
                    <Text size="3">Status: {cache.status[submission.status]}</Text>
                    <br></br>
                    {submission.status == 2 ? <><Text size="3">Rejection reason: {submission.reason}</Text>
                    <br></br></> : ""}
                </Box> : <Text size="5" weight={'bold'} as='p' align={'center'}>No submission selected</Text>}
            </Grid>
        </Card>
    </Grid>
  )
}
