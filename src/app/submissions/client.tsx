'use client'

import styles from "../../app/submit.module.css"
import { CaretDownIcon, CheckIcon, Cross1Icon, CrossCircledIcon, FileIcon, InfoCircledIcon, Link1Icon, Pencil1Icon, PersonIcon } from "@radix-ui/react-icons"
import { Card, Grid, Box, Text, Flex, IconButton, TextFieldRoot, TextFieldSlot, TextFieldInput, Separator, TextArea, CalloutRoot, CalloutText, CalloutIcon, Button, DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DialogClose, TabsRoot, TabsTrigger, TabsList, DialogTrigger, DialogContent, DialogRoot } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import cache from "../../../cache.json"

interface info {
    submissions: Array<Record<any, any>>,
    authData: Record<any, any>,
    levels: Array<Record<any, any>>,
    leaderboards: Array<Record<any, any>>
}

export default function Submissions({submissions, authData, levels, leaderboards}: info) {
    let [error, setError] = useState({color: "red", message: ""})
    let [allSubmissions, setAllSubmissions] = useState(submissions)
    let [submission, setSubmission] = useState<Record<any, any> | null>(submissions[0])
    let [filteredLevels, setFilteredLevels] = useState(levels)
    let [filteredPlayers, setFilteredPlayers] = useState(leaderboards)
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
        comments: "",
        id: ""
    })
    useEffect(() => {
        if(allSubmissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status).length) {
            setSubmission(allSubmissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status)[0])
        }
    }, [type])

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
        <TabsRoot defaultValue="all">
  <TabsList size="2">
    <TabsTrigger value="active" onClick={() =>{ 
        setType("active")
        setSubmission(null)
        }}>Active</TabsTrigger>
    <TabsTrigger value="all" onClick={() =>{ 
        setType("all")
        setSubmission(null)
        }}>All</TabsTrigger>
    <TabsTrigger value="archived" onClick={() =>{ 
        setType("archived")
        setSubmission(null)
        }}>Archived</TabsTrigger>
  </TabsList>
</TabsRoot>
<br></br>
            <DropdownMenuRoot>
                <DropdownMenuTrigger>
                <Button style={{width: "min(100%, 600px)", height: "max-content"}} color="indigo">
                            <Text size="5" align="left" as="p" style={{width: "100%"}}>{submission ? <span>Submission #{allSubmissions.findIndex(e => e.id == submission?.id)+1} by {submission.player}: {submission.level} by {submission.publisher}</span> : "No Submissions Available"}</Text>
                            {allSubmissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status).length ? <Text style={{textAlign: "end", width: "100%"}} as="p"><CaretDownIcon style={{scale: 2.5}}></CaretDownIcon></Text> : ""}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {allSubmissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status).map((e:any, i: number) => <DropdownMenuItem className={styles.option} onClick={() => setSubmission(e)}>Submission #{i+1} by {e.player}: {e.level} by {e.publisher}</DropdownMenuItem>)}
                </DropdownMenuContent>
            </DropdownMenuRoot>
            </Grid>
            <br></br>
            {error.message ? <><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
        </Card>
        <br></br>
        <Card style={{width: "min(900px, 100%)", padding: "10px"}}>
            <Grid style={{placeItems: "center"}}>
                {submission ? <Box>
                    <Flex gap="9" align={'center'} justify={'center'}>
                {submission.status != 1 ? <DialogRoot>
                    <DialogTrigger>
                        <Button size="4">Accept</Button>
                    </DialogTrigger>
                    <DialogContent>
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
            <Grid style={{ placeItems: "center" }}>
                        <DialogClose>
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
                                         if(submissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status).length) {
                                            setSubmission(submissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status)[0])
                                        }
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 1000)
                                     }
                                }}>Add</Button>
                                <Button size="3" color="red">Close</Button>
                            </Flex>
                        </DialogClose>
                    </Grid>
                    </DialogContent>
                </DialogRoot> : ""}
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
                                         if(submissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status).length) {
                                            setSubmission(submissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status)[0])
                                        }
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 1000)
                                     }
                                }}>Pend</Button> : ""}
                {submission.status != 2 ? <Button color='red' size="4" onClick={async () => {
                                     setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/admins/submissions", {
                                         method: "PATCH",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': authData.token
                                         },
                                         body: JSON.stringify({
                                             ...edits,
                                             status: 2
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
                                         if(submissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status).length) {
                                            setSubmission(submissions.filter((e:any) => type == "all" ? true : type == "active" ? !e.status : e.status)[0])
                                        }
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 1000)
                                     }
                                }}>Reject</Button> : ""}

            </Flex>
            <br></br>
                    <Text size="9" weight="bold" as="p" align="center">{submission.level} by {submission.publisher}</Text>
                    <Text align={'center'} size="6" as='p'>By {submission.player}</Text>
                    <br></br>
                    <br></br>
                    <Grid style={{placeItems: "center"}}>
                    <iframe  src={`https://www.youtube.com/embed/${getYoutubeVideoId(submission.link).videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </Grid>
                    <br></br>
                    <br></br>
                    <Text size="8" align="center" as="p">{submission.comments || "No comments were provided."}</Text>
                    <br></br>
                    <Text size="4">Submitted at: {submission.createdAt}</Text>
                    <br></br>
                    <Text size="4">Edited at: {submission.editedAt}</Text>
                    <br></br>
                    <Text size="3">Status: {cache.status[submission.status]}</Text>
                    <br></br>
                </Box> : <Text size="5" weight={'bold'} as='p' align={'center'}>No submission selected</Text>}
            </Grid>
        </Card>
    </Grid>
  )
}
