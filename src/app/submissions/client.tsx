'use client'

import styles from "../../app/submit.module.css"
import { CheckIcon, Cross1Icon, CrossCircledIcon, FileIcon, InfoCircledIcon, Link1Icon, Pencil1Icon, PersonIcon } from "@radix-ui/react-icons"
import { Card, Grid, Box, Text, Flex, IconButton, TextFieldRoot, TextFieldSlot, TextFieldInput, Separator, TextArea, CalloutRoot, CalloutText, CalloutIcon, Button } from "@radix-ui/themes"
import { useState } from "react"
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
    let [submission, setSubmission] = useState<Record<any, any> | null>(null)
    let [filteredLevels, setFilteredLevels] = useState(levels)
    let [filteredPlayers, setFilteredPlayers] = useState(leaderboards)
    let [openLevels, setOpenLevels] = useState(false)
    let [openPlayers, setOpenPlayers] = useState(false)
    let [editing, setEditing] = useState(false)
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
        <Card style={{width: "min(1200px, 100%)", padding: "10px"}}>
            <Flex gap="9">
                <Box style={{maxHeight: "800px", width: "400px"}}>
                    {allSubmissions.map((e:any, i: number) => <Card key={i} style={{width: "400px"}} onClick={() =>{
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
                        <Text size="8" weight="bold">Submission #{i+1}</Text>
                        <br></br>
                        <Text size="5" as="p">{e.level} by {e.publisher}</Text>
                        <br></br>
                        <Text size="3">By {e.player}</Text>
                    </Card>)}
                </Box>
                {!editing ? <Box style={{width: "100%"}}>
                    {submission ? <>
                        <Flex justify="end">
                            {!editing ? <Box style={{position: "absolute"}}>
                                <IconButton onClick={() => setEditing(true)}><Pencil1Icon></Pencil1Icon></IconButton>
                                <br></br><br></br>
                                <IconButton onClick={async () => {
                                     setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/user/submissions", {
                                         method: "DELETE",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': authData.token
                                         },
                                         body: JSON.stringify({
                                             id: submission?.id
                                         })
                                     })
                                     try {
                                         let data = await req.json()
                                         setError({color: "red", message: data.message})
                                     } catch(_) {
                                         setError({color: "green", message: `Successfully deleted submission`})
                                         setTimeout(() => window.location.reload(), 3000)
                                     }
                                }} color="red"><Cross1Icon></Cross1Icon></IconButton>
                            </Box> : ""}
                        </Flex>
                        <Text as="p" size="8" weight="bold" align='center'>{submission.level} by {submission.publisher}</Text>
                        <Text as="p" size="5" align='center'>From {submission.player}</Text>
                        <br></br>
                        <Grid style={{placeItems: "center"}}>
                            <iframe  src={`https://www.youtube.com/embed/${getYoutubeVideoId(submission.link).videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                        </Grid>
                        <br></br>
                        <Text size="4" as="p" align="center">{submission.comments || "No comments were provided"}</Text>
                        <br></br>
                        <br></br>
                        <Text size="2">Submitted: {submission.createdAt}</Text>
                        <br></br>
                        <Text size="2">Edited: {submission.editedAt}</Text>
                        {error.message ? <><br></br><br></br><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot></> : ""}
                    </> : <Text as="p" size="8" weight="bold" align='center'>No submission selected</Text>}
                </Box> : <Grid style={{placeItems: "center"}}>
        <Card style={{padding: "10px", width: "min(100%, 600px)"}}>
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
        </Card>
        <br></br>
        <Card style={{padding: "10px", width: "min(100%, 600px)"}}>
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
        </Card>
        <br></br>
        <Card style={{padding: "10px", width: "min(100%, 600px)"}}>
            <Text size="7" weight="bold">YouTube Link</Text>
            <TextFieldRoot mt="4">
                <TextFieldSlot style={{paddingRight: "8px"}}><Link1Icon></Link1Icon></TextFieldSlot>
                <TextFieldInput defaultValue={edits.video.text} placeholder="YouTube Link..." onChange={(e) => {
                    let valid = getYoutubeVideoId(e.target.value)
                    console.log(valid)
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
        </Card>
        <br></br>
        <Card style={{padding: "10px", width: "min(100%, 600px)"}}>
            <Text size="7" weight="bold" defaultValue={edits.comments}>Comments?</Text>
            <br></br>
            <Text size="2" style={{lineHeight: "20px"}}>Input your nationality / account ID here if you want</Text>
            <TextFieldRoot mt="4">
                <TextArea placeholder="Comments..." style={{width: "100%"}} onChange={(e) =>  setEdits({...edits, comments: e.target.value})}></TextArea>
            </TextFieldRoot>
        </Card>
        <br></br>
        {error.message ? <><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
            <Flex gap="6">
        <Button disabled={!edits.level || !edits.publisher || !edits.player || !edits.video.text || !edits.video.valid} onClick={async () => {
            setError({color: "blue", message: "Loading..."})
            let req = await fetch("/api/user/submissions", {
                method: "PATCH",
                headers: {
                    'content-type': 'application/json',
                    'authorization': authData.token
                },
                body: JSON.stringify({
                    id: submission?.id,
                    link: edits.video.text,
                    level: edits.level,
                    publisher: edits.publisher,
                    player: edits.player,
                    comments: edits.comments
                })
            })
            try {
                let data = await req.json()
                setError({color: "red", message: data.message})
            } catch(_) {
                setError({color: "green", message: `Successfully edited submission`})
                setTimeout(() => window.location.reload(), 3000)
            }
        }}>Submit</Button>
        <Button color="red" onClick={() => {
            setEditing(false)
            setEdits({
                video: {
                    valid: true,
                    text: submission?.link || "",
                    ytcode: getYoutubeVideoId(submission?.link || "").videoId || ""
                },
                player: submission?.player || "",
                level: submission?.level || "",
                publisher: submission?.publisher || "",
                comments: submission?.comments ||""
             })
        }}>Cancel</Button>
        </Flex>
    </Grid>}
            </Flex>
        </Card>
    </Grid>
  )
}
