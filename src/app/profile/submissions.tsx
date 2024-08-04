'use client'

import { CheckIcon, Cross1Icon, CrossCircledIcon, FileIcon, InfoCircledIcon, Link1Icon, Pencil1Icon, PersonIcon } from "@radix-ui/react-icons"
import { Box, Button, CalloutIcon, CalloutRoot, CalloutText, Card, DialogClose, DialogContent, DialogDescription, DialogRoot, DialogTitle, DialogTrigger, Flex, Grid, IconButton, ScrollArea, Separator, Tabs, TabsList, TabsRoot, TabsTrigger, Text, TextArea, TextFieldInput, TextFieldRoot, TextFieldSlot } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import styles from "../account.module.css"
import cache from "../../../cache.json"

interface info {
    data: Record<any, any>
}

export default function ProfileSubmissions({ data }: info) {

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
        comments: ""
    })

    useEffect(() => {
        document.addEventListener("click", (e) => {
            if((e.target as any)?.classList?.contains?.("rt-TextFieldInput")) return;
            setOpenLevels(false)
            setOpenPlayers(false)
        });
        (async () => {
            let [req1, req2, req3] = await Promise.all([
                await fetch(`/api/levels?start=0&end=150`),
                await fetch(`/api/leaderboards?all=true`),
                await fetch(`/api/user/submissions`, {
                    headers: {
                        authorization: data.token
                    }
                })
            ])

            let [levels, leaderboards, submissions] = await Promise.all([
                await req1.json(),
                await req2.json(),
                await req3.json()
            ])
            setAllSubmissions(submissions)
            setFilteredLevels(levels)
            setLevels(levels)
            setLeaderboards(leaderboards)
            setFilteredPlayers(leaderboards)
        })()
    }, [])

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
            <TabsRoot defaultValue="all">
  <TabsList size="2">
    <TabsTrigger value="active" onClick={() => setType("active")}>Active</TabsTrigger>
    <TabsTrigger value="all" onClick={() => setType("all")}>All</TabsTrigger>
    <TabsTrigger value="archived" onClick={() => setType("archived")}>Archived</TabsTrigger>
  </TabsList>
</TabsRoot>
<br></br>
        <ScrollArea style={{ height: "1000px" }}>
            {allSubmissions?.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status)?.length ? allSubmissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status).map((e: any, i: number) => <><DialogRoot key={i}>
                <DialogTrigger className={styles.submission}>
                    <Card key={i} style={{ marginRight: "40px" }} onClick={() => {
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
                            comments: e.comments
                        })
                    }}>
                        <Text size="8" weight="bold">Submission #{i + 1}</Text>
                        <br></br>
                        <Text size="5" as="p">{e.level} by {e.publisher}</Text>
                        <br></br>
                        <Text size="3">By {e.player}</Text>
                        <br></br>
                        <Text size="1">Status: {cache.status[e.status]}</Text>
                        {e.status == 2 ? <><br></br>
                        <Text size="1">Rejection reason: {e.reason}</Text></> : ""}
                    </Card>
                </DialogTrigger>
                <DialogContent>
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
                                        comments: e.comments
                                    })
                                }}><Cross1Icon></Cross1Icon></IconButton>
                            </Box>}
                    </Flex>
                    <DialogTitle size="8" weight="bold" as="h1" align="center">{e.level} by {e.publisher}</DialogTitle>
                    <DialogDescription align={'center'} size="6">By {e.player}</DialogDescription>
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
                        <DialogClose>
                            <Button size="3" color='red'>Close</Button>
                        </DialogClose>
                    </Grid></> : <>
                    <Text size="7" weight="bold">Level Name</Text>
            <br></br>
            <Text size="2" style={{lineHeight: "20px"}}>Case sensitive</Text>
                    <Flex gap="4" align='center' mt="4">
            <TextFieldRoot>
                <TextFieldSlot style={{paddingRight: "8px"}}><FileIcon></FileIcon></TextFieldSlot>
                <TextFieldInput style={{width: 225}} defaultValue={edits.level} placeholder="Level Name..." id="level" onClick={(e) => {
                    setFilteredLevels(levels.filter((x:any) => x.name.toLowerCase().includes(edits?.level.toLowerCase())))
                    setOpenLevels(true)
                }} onChange={(e) => {
                        setEdits({...edits, level: e.target.value});
                        setFilteredLevels(levels.filter((x:any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                }}></TextFieldInput>
            </TextFieldRoot>
            <Text>By</Text>
            <TextFieldRoot>
            <TextFieldInput defaultValue={edits.publisher} placeholder="Publisher..." id="publisher" onClick={(e) => {
                    setFilteredLevels(levels.filter((x:any) => x.publisher.toLowerCase().includes(edits?.publisher.toLowerCase())))
                    setOpenLevels(true)
                }} onChange={(e) => {
                        setEdits({...edits, publisher: e.target.value});
                        setFilteredLevels(levels.filter((x:any) => x.publisher.toLowerCase().includes(e.target.value.toLowerCase())))
                }}></TextFieldInput>
            </TextFieldRoot>
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
            <TextFieldRoot mt="4">
                <TextFieldSlot style={{paddingRight: "8px"}}><PersonIcon></PersonIcon></TextFieldSlot>
                <TextFieldInput defaultValue={edits.player} placeholder="Player Name..." id="player" onClick={(e) => {
                    setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(edits?.player.toLowerCase())))
                    setOpenPlayers(true)
                }} onChange={(e) => {
                    setEdits({...edits, player: e.target.value});
                    setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                }}></TextFieldInput>
            </TextFieldRoot>
            <Card style={{display: openPlayers ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s"}}>
            <div style={{marginBottom: "10px"}}></div>
            {filteredPlayers.map((e:any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{margin: "-8px"}} onClick={() => {
                 setEdits({...edits, player: e.name});
                (document.getElementById("player") as any).value = e.name
                setOpenPlayers(false)
            }}><Text color="gray" mr="6">#{e.position}</Text> {e.name} ({e.records} points)</Text></Box>)}
            </Card>
            <br></br>
            <Text size="7" weight="bold">YouTube Link</Text>
            <TextFieldRoot mt="4">
                <TextFieldSlot style={{paddingRight: "8px"}}><Link1Icon></Link1Icon></TextFieldSlot>
                <TextFieldInput defaultValue={edits.video.text} placeholder="YouTube Link..." onChange={(e) => {
                    let valid = getYoutubeVideoId(e.target.value)
                    setEdits({...edits,
                        video: {
                            valid: valid.videoId?.length == 11,
                            ytcode: valid.videoId || "",
                            text: e.target.value
                        }
                    })
                }}></TextFieldInput>
            </TextFieldRoot>
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
            <TextFieldRoot mt="4">
                <TextArea defaultValue={edits.comments} placeholder="Comments..." style={{width: "100%"}} onChange={(e) =>  setEdits({...edits, comments: e.target.value})}></TextArea>
            </TextFieldRoot>
            <br></br>
            {error.message ? <><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
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
                                <DialogClose>
                                    <Button id='close' color='red' onClick={() => {
                                        setEditing(false)
                                        setSubmission(null)
                                    }}>Close</Button>
                                </DialogClose>
                    </Grid>
                    </>}
                </DialogContent>
            </DialogRoot><br></br></>) : allSubmissions?.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status)?.length == 0 ? <Text size="8" weight="bold" as="p" align={'center'}>There are no submissions in this section yet!</Text> : <Text size="8" weight="bold" as="p" align={'center'}>Loading...</Text>}
        </ScrollArea>
        </Grid>
    )
}