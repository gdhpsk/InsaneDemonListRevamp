'use client'

import { Box, Button, Card, DialogClose, DialogContent, DialogDescription, DialogRoot, DialogTitle, DialogTrigger, Grid, ScrollArea, Text } from "@radix-ui/themes"
import { useEffect, useState } from "react"

interface info {
    data: Record<any, any>
}

export default function ProfileSubmissions({ data }: info) {

    let [allSubmissions, setAllSubmissions] = useState<Array<any> | null>(null)
    let [submission, setSubmission] = useState<Record<any, any> | null>(null)
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
        (async () => {
            let [req1, req2, req3] = await Promise.all([
                await fetch(`${process.env.NEXT_PUBLIC_URL}/api/levels?start=0&end=150`),
                await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards`),
                await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/submissions`, {
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
        <ScrollArea style={{ height: "1000px" }}>
            {allSubmissions?.length ? allSubmissions.map((e: any, i: number) => <DialogRoot>
                <DialogTrigger>
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
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle size="8" weight="bold" as="h1" align="center">{e.level} by {e.publisher}</DialogTitle>
                    <DialogDescription align={'center'} size="6">By {e.player}</DialogDescription>
                    <br></br>
                    <Grid style={{placeItems: "center"}}>
                    <iframe  src={`https://www.youtube.com/embed/${getYoutubeVideoId(e.link).videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </Grid>
                    <br></br>
                    <Grid style={{ placeItems: "center" }}>
                        <DialogClose>
                            <Button size="3" color='red'>Close</Button>
                        </DialogClose>
                    </Grid>
                </DialogContent>
            </DialogRoot>) : allSubmissions?.length == 0 ? <Text size="8" weight="bold" as="p" align={'center'}>You have not submitted any submissions yet!</Text> : <Text size="8" weight="bold" as="p" align={'center'}>Loading...</Text>}
        </ScrollArea>
    )
}