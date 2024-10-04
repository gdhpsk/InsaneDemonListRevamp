'use client';
import { CheckIcon, CrossCircledIcon, FileIcon, InfoCircledIcon, Link1Icon, PersonIcon, StopwatchIcon } from "@radix-ui/react-icons";
import { Box, Button, Callout, Card, DropdownMenu, Flex, Grid, SegmentedControl, Separator, Table, Text, TextArea, TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import styles from "../app/submit.module.css"

interface info {
    authData: Record<any, any>
}

export default function Submit({ authData }: info) {
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
    let [error, setError] = useState({ color: "red", message: "" })
    let [levels, setLevels] = useState([])
    let [leaderboards, setLeaderboards] = useState([])
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
        publisher: "",
        comments: "",
        type: "classic",
        time: 0
    })
    useEffect(() => {
        document.addEventListener("click", (e) => {
            if ((e.target as any)?.classList?.contains?.("rt-TextFieldInput")) return;
            setOpenLevels(false)
            setOpenPlayers(false)
        })
    })
    useEffect(() => {
        (async () => {
            let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${submission.type == "classic" ? "level" : "platformer"}s?start=0`)
            let json = await req.json()
            setLevels(json)
            setFilteredLevels(json)
            let req1 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards${submission.type == "classic" ? "" : "/platformer"}?all=true`)
            let json1 = await req1.json()
            setLeaderboards(json1)
            setFilteredPlayers(json1)
        })()
    }, [submission.type])

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
        <Grid style={{ placeItems: "center" }}>
            <SegmentedControl.Root size="3" defaultValue="classic" onValueChange={e => setSubmission({ ...submission, type: e })}>
                <SegmentedControl.Item value="classic">Classic</SegmentedControl.Item>
                <SegmentedControl.Item value="platformer">Platformer</SegmentedControl.Item>
            </SegmentedControl.Root>
            <br></br>
            <Card style={{ padding: "10px", width: "min(100%, 600px)" }}>
                <Text size="7" weight="bold">Level Name</Text>
                <br></br>
                <Text size="2" style={{ lineHeight: "20px" }}>Case sensitive</Text>
                <Flex gap="4" align='center' mt="4">
                    <TextField.Root style={{ width: 225 }} placeholder="Level Name..." id="level" onClick={(e) => {
                        setFilteredLevels(levels.filter((x: any) => x.name.toLowerCase().includes(submission.level.toLowerCase())))
                        setOpenLevels(true)
                    }} onChange={(e) => {
                        setSubmission({ ...submission, level: e.target.value });
                        setFilteredLevels(levels.filter((x: any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                    }}>
                        <TextField.Slot style={{ paddingRight: "8px" }}><FileIcon></FileIcon></TextField.Slot>
                    </TextField.Root>
                    <Text>By</Text>
                    <TextField.Root placeholder="Publisher..." id="publisher" onClick={(e) => {
                        setFilteredLevels(levels.filter((x: any) => x.publisher.toLowerCase().includes(submission.publisher.toLowerCase())))
                        setOpenLevels(true)
                    }} onChange={(e) => {
                        setSubmission({ ...submission, publisher: e.target.value });
                        setFilteredLevels(levels.filter((x: any) => x.publisher.toLowerCase().includes(e.target.value.toLowerCase())))
                    }}>
                    </TextField.Root>
                </Flex>
                <Card style={{ display: openLevels ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s" }}>
                    <div style={{ marginBottom: "10px" }}></div>
                    {filteredLevels.map((e: any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{ margin: "-8px" }} onClick={() => {
                        setSubmission({ ...submission, level: e.name, publisher: e.publisher });
                        (document.getElementById("level") as any).value = e.name;
                        (document.getElementById("publisher") as any).value = e.publisher
                        setOpenLevels(false)
                    }}><Text color="gray" mr="6">#{e.position}</Text> {e.name} by {e.publisher}</Text></Box>)}
                </Card>
            </Card>
            <br></br>
            <Card style={{ padding: "10px", width: "min(100%, 600px)" }}>
                <Text size="7" weight="bold">Player Name</Text>
                <br></br>
                <Text size="2" style={{ lineHeight: "20px" }}>Case sensitive</Text>
                <TextField.Root mt="4" placeholder="Player Name..." id="player" onClick={(e) => {
                    setFilteredPlayers(leaderboards.filter((x: any) => x.name.toLowerCase().includes(submission.player.toLowerCase())))
                    setOpenPlayers(true)
                }} onChange={(e) => {
                    setSubmission({ ...submission, player: e.target.value });
                    setFilteredPlayers(leaderboards.filter((x: any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                }}>
                    <TextField.Slot style={{ paddingRight: "8px" }}><PersonIcon></PersonIcon></TextField.Slot>
                </TextField.Root>
                <Card style={{ display: openPlayers ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s" }}>
                    <div style={{ marginBottom: "10px" }}></div>
                    {filteredPlayers.map((e: any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{ margin: "-8px" }} onClick={() => {
                        setSubmission({ ...submission, player: e.name });
                        (document.getElementById("player") as any).value = e.name
                        setOpenPlayers(false)
                    }}><Text color="gray" mr="6">#{e.position}</Text> {e.name} ({e.records || 0} points)</Text></Box>)}
                </Card>
            </Card>
            <br></br>
            {submission.type == "platformer" ? <><Card style={{ padding: "10px", width: "min(100%, 600px)" }}>
                <Text size="7" weight="bold">Time</Text>
                <TextField.Root mt="4" placeholder="hh:mm:ss.SSS / mm:ss.SSS / ss.SSS" onChange={(e) => {
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
            <Card style={{ padding: "10px", width: "min(100%, 600px)" }}>
                <Text size="7" weight="bold">YouTube Link</Text>
                <TextField.Root mt="4" placeholder="YouTube Link..." onChange={(e) => {
                    let valid = getYoutubeVideoId(e.target.value)
                    setSubmission({
                        ...submission,
                        video: {
                            valid: valid.videoId?.length == 11,
                            ytcode: valid.videoId || "",
                            text: e.target.value
                        }
                    })
                }}>
                    <TextField.Slot style={{ paddingRight: "8px" }}><Link1Icon></Link1Icon></TextField.Slot>
                </TextField.Root>
                {!submission.video.valid ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{ scale: 1.4 }}></CrossCircledIcon>
                    <Text size="3" color="red" style={{ lineHeight: "20px" }}>Not a valid youtube video</Text>
                </Flex> : ""}
                <br></br>
                <Grid style={{ placeItems: "center" }}>
                    <iframe src={`https://www.youtube.com/embed/${submission.video.ytcode}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Grid>
            </Card>
            <br></br>
            <Card style={{ padding: "10px", width: "min(100%, 600px)" }}>
                <Text size="7" weight="bold">Comments?</Text>
                <br></br>
                <Text size="2" style={{ lineHeight: "20px" }}>Input your nationality / account ID (or GD username) here if you want</Text>
                <TextArea mt="4" placeholder="Comments..." style={{ width: "100%" }} onChange={(e) => setSubmission({ ...submission, comments: e.target.value })}></TextArea>
            </Card>
            <br></br>
            {error.message ? <><Callout.Root color={error.color as any}>
                <Callout.Icon>
                    {error.color == "red" ? <CrossCircledIcon style={{ scale: 1.5 }}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{ scale: 1.5 }}></CheckIcon> : <InfoCircledIcon style={{ scale: 1.5 }}></InfoCircledIcon>}
                </Callout.Icon>
                <Callout.Text size="3" ml="-1">{error.message}</Callout.Text>
            </Callout.Root><br></br></> : ""}
            <Button disabled={!submission.level || !submission.publisher || !submission.player || !submission.video.text || !submission.video.valid} onClick={async () => {
                setError({ color: "blue", message: "Loading..." })
                let req = await fetch("/api/user/submissions", {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json',
                        'authorization': authData.user.token
                    },
                    body: JSON.stringify({
                        link: submission.video.text,
                        level: submission.level,
                        publisher: submission.publisher,
                        player: submission.player,
                        type: submission.type,
                        time: submission.time,
                        comments: submission.comments
                    })
                })
                try {
                    let data = await req.json()
                    setError({ color: "red", message: data.message })
                } catch (_) {
                    setError({ color: "green", message: `Successfully submitted record for level ${submission.level}!` })
                    setTimeout(() => window.location.href = '/profile', 3000)
                }
            }}>Submit</Button>
        </Grid>
    )
}