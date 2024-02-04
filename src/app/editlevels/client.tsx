'use client';
import { CrossCircledIcon, CheckIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Box, Button, CalloutIcon, CalloutRoot, CalloutText, Card, DialogContent, DialogRoot, DialogTrigger, Flex, Grid, Text } from "@radix-ui/themes"
import Image from "next/image"
import { useState } from "react"

interface info {
    authData: Record<any, any>,
    levels: Array<Record<any, any>>,
    leaderboards: Array<Record<any, any>>
}

export default function EditLevels({ authData, levels, leaderboards }: info) {
    let [originalLevels, setOriginalLevels] = useState(levels)
    let [filteredLevels, setFilteredLevels] = useState(levels)
    let [edits, setEdits] = useState<Array<Record<any, any>>>([])
    let [error, setError] = useState({color: "red", message: ""})

    function allowDrop(ev: any) {
        ev.preventDefault();
      }
      
      function drag(ev: any) {
        ev.dataTransfer.setData("pos", ev.target.id);
      }
      
      function drop(ev: any) {
        ev.preventDefault();
        let levPos = parseInt(filteredLevels.find(e => e.id == ev.dataTransfer.getData("pos"))?.position);
        let newLevPos = parseInt(filteredLevels.find(e => e.id == ev.currentTarget.id)?.position)
        let levels = structuredClone(filteredLevels)
        setEdits([...edits, {
            id: ev.dataTransfer.getData("pos"),
            position: newLevPos
        }])
        levels.filter(e => e.difference).map(x => {
            if(x.position >= newLevPos && levPos > x.position) {
                x.difference--
            }
            if(x.position < newLevPos && levPos < x.position) {
                x.difference++
            }
            return x
        })
        for(let i = Math.min(levPos, newLevPos)-1; i < Math.max(levPos, newLevPos); i++) {
            if(i == levPos-1) {
                levels[i].difference = originalLevels.find(x => x.id == levels[i].id)?.position - newLevPos
                levels[i].position = newLevPos
                continue;
            }
            if(levPos > newLevPos) {
                levels[i].position += 1
                continue;
            }
            if(levPos < newLevPos) {
                levels[i].position -= 1
                continue;
            }
        }
        setFilteredLevels(levels.sort((a,b) => a.position - b.position))
      }

    return (
        <Box>
            <Flex gap="4" style={{ placeItems: "center", justifyContent: "center" }}>
                <Image src="/favicon.ico" height={70} width={70} alt={"idl"}></Image>
                <Text size="9" className="header" style={{ display: "contents" }}>Level Editor</Text>
                <Image src="/favicon.ico" height={70} width={70} alt={"idl"}></Image>
            </Flex>
            <br></br>
            <Flex justify="center" gap="9">
                <Button size="4" disabled={!!!filteredLevels.find(e => e.difference)} onClick={async () => {
                    setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/levels", {
                                         method: "PATCH",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': authData.token
                                         },
                                         body: JSON.stringify(edits)
                                     })
                                     try {
                                         let data = await req.json()
                                         setError({color: "red", message: data.message})
                                     } catch(_) {
                                        setError({color: "blue", message: "Fetching new information..."})
                                        let req = await fetch(`/api/levels?start=0`, {
                                            headers: {
                                                authorization: authData.token
                                            }
                                        })
                                        let levels = await req.json()
                                         setError({color: "green", message: `Successfully edited all level positions`})
                                         setFilteredLevels(levels)
                                         setOriginalLevels(levels)
                                         setEdits([])
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 3000)
                                     }
                }}>Save</Button>
                <Button size="4" disabled={!!!filteredLevels.find(e => e.difference)} color='red' onClick={() => {
                     setFilteredLevels(originalLevels)
                     setEdits([])
                }}>Cancel</Button>
            </Flex>
            <br></br>
            <Grid style={{placeItems: "center"}}>
            {error.message ? <><CalloutRoot color={error.color as any} style={{width: "min(600px, 100%)"}}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
            </Grid>
            <br></br>
            <Grid style={{placeItems: "center"}}>
            <Grid columns="6" gap="4" style={{width: "min(2500px, 100%)"}}>
                {filteredLevels.map((e: any) => <DialogRoot>
                    <DialogTrigger>
                        <Card draggable="true" onDragStart={drag} onDragOver={allowDrop} onDrop={drop} id={e.id} key={e.id}><Text size="4"><b>#{e.position}: </b>{e.name} by {e.publisher} {!e.difference ? "" : <Text size="4" color={e.difference < 0 ? "red" : "green"}>{e.difference < 0 ? "-" : "+"}{Math.abs(e.difference)}</Text>}</Text></Card>
                    </DialogTrigger>
                    <DialogContent>
                        <h1>YO</h1>
                    </DialogContent>
                </DialogRoot>)}
            </Grid>
            </Grid>
        </Box>
    )
}