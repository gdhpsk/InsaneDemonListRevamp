'use client';
import { CheckIcon, CrossCircledIcon, FileIcon, InfoCircledIcon, Link1Icon, PersonIcon } from "@radix-ui/react-icons";
import { Box, Button, CalloutIcon, CalloutRoot, CalloutText, Card, DropdownMenuContent, DropdownMenuItem, DropdownMenuRoot, DropdownMenuTrigger, Flex, Grid, Separator, Text, TextArea, TextFieldInput, TextFieldRoot, TextFieldSlot } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import styles from "../app/submit.module.css"

interface info {
    levels: Array<Record<any, any>>,
    leaderboards: Array<Record<any, any>>,
    authData: Record<any, any>
}

export default function Submit({levels, leaderboards, authData}: info) {
    let [error, setError] = useState({color: "red", message: ""})
    let [filteredLevels, setFilteredLevels] = useState(levels)
    let [filteredPlayers, setFilteredPlayers] = useState(leaderboards)
    let [openLevels, setOpenLevels] = useState(false)
    let [openPlayers, setOpenPlayers] = useState(false)
    let [submission, setSubmission] = useState({
        video: {
            valid: true,
            text: "",
            ytcode: ""
        },
        player: "",
        level: "",
        comments: ""
    })
    useEffect(() => {
        document.addEventListener("click", (e) => {
            if((e.target as any)?.classList?.contains?.("rt-TextFieldInput")) return;
            setOpenLevels(false)
            setOpenPlayers(false)
        })
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
        <Card style={{padding: "10px", width: "min(100%, 600px)"}}>
            <Text size="7" weight="bold">Level Name</Text>
            <br></br>
            <Text size="2" style={{lineHeight: "20px"}}>Case sensitive</Text>
            <TextFieldRoot mt="4">
                <TextFieldSlot style={{paddingRight: "8px"}}><FileIcon></FileIcon></TextFieldSlot>
                <TextFieldInput placeholder="Level Name..." id="level" onClick={(e) => {
                    setFilteredLevels(levels.filter((x:any) => x.name.toLowerCase().includes(submission.level.toLowerCase())))
                    setOpenLevels(true)
                }} onChange={(e) => {
                        setSubmission({...submission, level: e.target.value});
                        setFilteredLevels(levels.filter((x:any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                }}></TextFieldInput>
            </TextFieldRoot>
            <Card style={{display: openLevels ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s"}}>
            <div style={{marginBottom: "10px"}}></div>
            {filteredLevels.map((e:any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{margin: "-8px"}} onClick={() => {
                setSubmission({...submission, level: e.name});
                (document.getElementById("level") as any).value = e.name
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
                <TextFieldInput placeholder="Player Name..." id="player" onClick={(e) => {
                    setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(submission.player.toLowerCase())))
                    setOpenPlayers(true)
                }} onChange={(e) => {
                        setSubmission({...submission, player: e.target.value});
                    setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                }}></TextFieldInput>
            </TextFieldRoot>
            <Card style={{display: openPlayers ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s"}}>
            <div style={{marginBottom: "10px"}}></div>
            {filteredPlayers.map((e:any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{margin: "-8px"}} onClick={() => {
                setSubmission({...submission, player: e.name});
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
                <TextFieldInput placeholder="YouTube Link..." onChange={(e) => {
                    let valid = getYoutubeVideoId(e.target.value)
                    console.log(valid)
                    setSubmission({
                        ...submission,
                        video: {
                            valid: valid.videoId?.length == 11,
                            ytcode: valid.videoId || "",
                            text: e.target.value
                        }
                    })
                }}></TextFieldInput>
            </TextFieldRoot>
            {!submission.video.valid ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{scale: 1.4}}></CrossCircledIcon>
                    <Text size="3" color="red" style={{lineHeight: "20px"}}>Not a valid youtube video</Text>
               </Flex> : ""}
               <br></br>
               <Grid style={{placeItems: "center"}}>
                    <iframe width="560" height="315" src={`https://www.youtube.com/embed/${submission.video.ytcode}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
               </Grid>
        </Card>
        <br></br>
        <Card style={{padding: "10px", width: "min(100%, 600px)"}}>
            <Text size="7" weight="bold">Comments?</Text>
            <br></br>
            <Text size="2" style={{lineHeight: "20px"}}>Input your nationality / account ID here if you want</Text>
            <TextFieldRoot mt="4">
                <TextArea placeholder="Comments..." style={{width: "100%"}} onChange={(e) => setSubmission({...submission, comments: e.target.value})}></TextArea>
            </TextFieldRoot>
        </Card>
        <br></br>
        {error.message ? <><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
        <Button disabled={!submission.level || !submission.player || !submission.comments || !submission.video.text || !submission.video.valid} onClick={async () => {
            setError({color: "blue", message: "Loading..."})
            let req = await fetch("/api/user/submissions", {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'authorization': authData.user.token
                },
                body: JSON.stringify({
                    link: submission.video.text,
                    level: submission.level,
                    player: submission.player,
                    comments: submission.comments
                })
            })
            try {
                let data = await req.json()
                setError({color: "red", message: data.message})
            } catch(_) {
                setError({color: "green", message: `Successfully submitted record for level ${submission.level}!`})
                setTimeout(() => window.location.href = '/submissions', 3000)
            }
        }}>Submit</Button>
    </Grid>
  )
}