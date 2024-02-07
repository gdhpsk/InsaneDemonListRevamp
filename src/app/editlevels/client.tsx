'use client';
import hexToRGB from "@/functions/hexToRGB";
import { CrossCircledIcon, CheckIcon, InfoCircledIcon, Link1Icon, PersonIcon, VideoIcon, LetterCaseCapitalizeIcon, DotFilledIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Badge, Box, Button, CalloutIcon, CalloutRoot, CalloutText, Card, DialogClose, DialogContent, DialogDescription, DialogRoot, DialogTitle, DialogTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuRoot, DropdownMenuTrigger, Flex, Grid, IconButton, SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger, Separator, TableBody, TableCell, TableColumnHeaderCell, TableHeader, TableRoot, TableRow, TableRowHeaderCell, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from "@radix-ui/themes"
import Image from "next/image"
import { useState } from "react"
import styles from "../../app/submit.module.css"
import dayjs from "dayjs";

interface info {
    authData: Record<any, any>,
    levels: Array<Record<any, any>>,
    leaderboards: Array<Record<any, any>>,
    packs: Array<Record<any, any>>
}

export default function EditLevels({ authData, levels, leaderboards, packs }: info) {
    let [originalLevels, setOriginalLevels] = useState(levels)
    let [filteredLevels, setFilteredLevels] = useState(levels)
    let [level, setLevel] = useState<Record<any, any>>({})
    let [edits, setEdits] = useState<Array<Record<any, any>>>([])
    let [error, setError] = useState({color: "red", message: ""})
    let [packHover, setPackHover] = useState<string | null>(null)
    let [editedRecords, setEditedRecords] = useState<Array<Record<any, any>>>([])
    let [deletedRecords, setDeletedRecords] = useState<Array<Record<any, any>>>([])
    let [record, setRecord] = useState<number | null>(null)
    let [filteredPlayers, setFilteredPlayers] = useState<Array<Record<any, any>>>([])
    let [levelAddition, setLevelAddition] = useState<Record<any, any>>({})
    let [openPlayers, setOpenPlayers] = useState(false)

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
                <Button size="4" disabled={!filteredLevels.find(e => e.difference)} onClick={async () => {
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
                <DialogRoot onOpenChange={_ => {
                    let obj = {
                        id: "level_addition",
                        position: filteredLevels.length+1,
                        name: "",
                        publisher: "",
                        ytcode: "",
                        packs: [],
                        list: []
                    }
                    if(_) {
                        setLevel(obj)
                        setFilteredLevels([...filteredLevels, obj])
                    } else {
                        setLevel({})
                        setFilteredLevels(originalLevels)
                    }
                }}>
                    <DialogTrigger>
                        <IconButton size="4" disabled={!!filteredLevels.find(e => e.difference)}>+</IconButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle as="h1" align='center' style={{fontSize: "30px"}}>Level Addition</DialogTitle>
                        <br></br>
                        <TableRoot variant="surface">
                            <TableHeader>
                                <TableRow>
                                    <TableColumnHeaderCell>#</TableColumnHeaderCell>
                                    <TableColumnHeaderCell>Name</TableColumnHeaderCell>
                                    <TableColumnHeaderCell>Publisher</TableColumnHeaderCell>
                                </TableRow>
                            </TableHeader>
                            {!level.hide ? <TableBody>
                                <TableRow>
                                    <TableRowHeaderCell style={{fontWeight: level.position == 1 ? "bold" : "initial"}}>{level.position == 1 ? 1 : filteredLevels.find((e:any) => level.position == filteredLevels.length ? e.position == level.position-2 : e.position == level.position-1)?.position}</TableRowHeaderCell>
                                    <TableCell style={{fontWeight: level.position == 1 ? "bold" : "initial"}}>{filteredLevels.find((e:any) => level.position == 1 ? e.id == level.id : level.position == filteredLevels.length ? e.position == level.position-2 : e.position == level.position-1)?.name}</TableCell>
                                    <TableCell style={{fontWeight: level.position == 1 ? "bold" : "initial"}}>{filteredLevels.find((e:any) => level.position == 1 ? e.id == level.id : level.position == filteredLevels.length ? e.position == level.position-2 : e.position == level.position-1)?.publisher}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableRowHeaderCell style={{fontWeight: level.position != 1 && level.position != filteredLevels.length ? "bold" : "initial"}}>{level.position != 1 && level.position != filteredLevels.length ? level.position : filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 2 : e.position == level.position-1)?.position}</TableRowHeaderCell>
                                    <TableCell style={{fontWeight: level.position != 1 && level.position != filteredLevels.length ? "bold" : "initial"}}>{filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 2 : level.position == filteredLevels.length ? e.position == level.position-1 : e.id == level.id)?.name}</TableCell>
                                    <TableCell style={{fontWeight: level.position != 1 && level.position != filteredLevels.length ? "bold" : "initial"}}>{filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 2 : level.position == filteredLevels.length ? e.position == level.position-1 : e.id == level.id)?.publisher}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableRowHeaderCell style={{fontWeight: level.position == filteredLevels.length ? "bold" : "initial"}}>{level.position == filteredLevels.length ? level.position : filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 3 : e.position == level.position+1)?.position}</TableRowHeaderCell>
                                    <TableCell style={{fontWeight: level.position == filteredLevels.length ? "bold" : "initial"}}>{filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 3 : level.position == filteredLevels.length ? e.id == level.id : e.position == level.position+1)?.name}</TableCell>
                                    <TableCell style={{fontWeight: level.position == filteredLevels.length ? "bold" : "initial"}}>{filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 3 : level.position == filteredLevels.length ? e.id == level.id : e.position == level.position+1)?.publisher}</TableCell>
                                </TableRow>
                            </TableBody> : ""}
                        </TableRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot>Position</TextFieldSlot>
                            <TextFieldInput onChange={e => {
                                let levPos = level.position
                                let newLevPos = parseInt(e.target.value)
                                if(!newLevPos || newLevPos < 1 || newLevPos > filteredLevels.length) {
                                    setLevel({...level, hide: true})
                                    return;
                                }
                                let levels = structuredClone(filteredLevels)
                                for(let i = Math.min(levPos, newLevPos)-1; i < Math.max(levPos, newLevPos); i++) {
                                    if(i == levPos-1) {
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
                                setLevel({...level, position: parseInt(e.target.value), hide: false})
                            }} type="number"></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><LetterCaseCapitalizeIcon></LetterCaseCapitalizeIcon></TextFieldSlot>
                            <TextFieldInput onChange={e => {
                                setLevel({...level, name: e.target.value})
                                setFilteredLevels([
                                    ...filteredLevels.filter(x => x.id != "level_addition"),
                                    {...level, name: e.target.value}
                                ].sort((a,b) => a.position - b.position))
                            }} placeholder="Name..."></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><PersonIcon></PersonIcon></TextFieldSlot>
                            <TextFieldInput onChange={e => {
                                setLevel({...level, publisher: e.target.value})
                                setFilteredLevels([
                                    ...filteredLevels.filter(x => x.id != "level_addition"),
                                    {...level, publisher: e.target.value}
                                ].sort((a,b) => a.position - b.position))
                            }} placeholder="Publisher..."></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><VideoIcon></VideoIcon></TextFieldSlot>
                            <TextFieldInput onChange={e => {
                                setLevel({...level, ytcode: e.target.value})
                                setFilteredLevels([
                                    ...filteredLevels.filter(x => x.id != "level_addition"),
                                    {...level, ytcode: e.target.value}
                                ].sort((a,b) => a.position - b.position))
                            }} placeholder="Ytcode..."></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <Grid style={{placeItems: "center"}}>
                    <iframe src={`https://www.youtube.com/embed/${level.ytcode}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
               </Grid>
               <br></br>
               <DialogClose>
                <Flex gap="9" justify={'center'}>
                    <Button size='4' disabled={!level.name || !level.position || !level.publisher || level.ytcode.length < 11} onClick={async () => {
                        setError({color: "blue", message: "Loading..."})
                        let req = await fetch("/api/levels", {
                            method: "POST",
                            headers: {
                                'content-type': 'application/json',
                                'authorization': authData.token
                            },
                            body: JSON.stringify(level)
                        })
                        try {
                            if(req.status == 201) throw new Error()
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
                            setError({color: "green", message: `Successfully added level ${level.name} by ${level.publisher} at #${level.position}`})
                            setFilteredLevels(levels)
                            setOriginalLevels(levels)
                            setLevel([])
                            setTimeout(() =>{
                               setError({color: "red", message: ""})
                            }, 3000)
                        }
                    }}>Add</Button>
                    <Button size='4' color='red'>Cancel</Button>
                </Flex>
               </DialogClose>
                    </DialogContent>
                </DialogRoot>
                <Button size="4" disabled={!filteredLevels.find(e => e.difference)} color='red' onClick={() => {
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
                {filteredLevels.map((e: any) => <DialogRoot key={e.id} onOpenChange={async open => {
                    if(open) {
                        let req = await fetch(`/api/level/${e.id}`)
                        let level = await req.json()
                        setLevel(level)
                    } else {
                        setFilteredLevels(originalLevels)
                        setLevel({})
                        setRecord(null)
                        setEditedRecords([])
                        setDeletedRecords([])
                        setOpenPlayers(false)
                    }
                }}>
                    <DialogTrigger>
                        <Card draggable="true" onDragStart={drag} onDragOver={allowDrop} onDrop={drop} id={e.id} key={e.id} onClick={e => {
                            if(!!filteredLevels.find(e => e.difference)) e.preventDefault()
                        }}><Text size="4"><b>#{e.position}: </b>{e.name} by {e.publisher} {!e.difference ? "" : <Text size="4" color={e.difference < 0 ? "red" : "green"}>{e.difference < 0 ? "-" : "+"}{Math.abs(e.difference)}</Text>}</Text></Card>
                    </DialogTrigger>
                    <DialogContent>
                        {level.id ? <>
                            <DialogTitle as="h1" style={{fontSize: "30px"}} align={'center'}>
                            #{level.position}: {level.name} by {level.publisher}
                        </DialogTitle>
                        {level.formerRank ? <DialogDescription align='center'>Formerly #{level.formerRank}, Removed on {new Date(level.removalDate).toDateString()}</DialogDescription> : ""}
                        <br></br>
                        <Text size="5" weight={'bold'} as='p' align='center'>Weekly</Text>
                        <Flex gap="2" align='center' justify={'center'}>
                            <TextFieldRoot><TextFieldInput defaultValue={level.weekly ? dayjs(level.weekly.date).format("YYYY-MM-DDTHH:mm:ss") : ""} type="datetime-local" onChange={e => {
                                setLevel({...level, weekly: level.weekly ? {...level.weekly, date: new Date(e.target.value).toISOString()} : { color: "#000000", date: new Date(e.target.value).toISOString()}})
                            }}></TextFieldInput></TextFieldRoot>
                            <TextFieldRoot><TextFieldInput defaultValue={level.weekly?.color} type="color" style={{width: "revert"}} onChange={e => {
                                setLevel({...level, weekly: level.weekly ? {...level.weekly, color: e.target.value} : { color: e.target.value, date: new Date(Date.now()).toISOString()}})
                            }}></TextFieldInput></TextFieldRoot>
                        </Flex>
                        <br></br>
                        <Flex gap="2" align='center' justify={'center'}>
                        <Text size="5" weight={'bold'}>Packs</Text>
                        <DropdownMenuRoot>
                                <DropdownMenuTrigger>
                                    <IconButton size="1"><PlusIcon></PlusIcon></IconButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {packs.filter(x => !level.packs.find((y:any) => y.id == x.id)).map((x:any) => <DropdownMenuItem key={x.id} onClick={_ => {
                                        setLevel({...level, packs: [...level.packs, x].sort((a,b) => a.position - b.position)})
                                    }}>{x.name}</DropdownMenuItem>)}
                                </DropdownMenuContent>
                            </DropdownMenuRoot>
                        </Flex>
                        <br></br>
                        <Flex gap="2" style={{maxWidth: "100%"}} wrap="wrap" justify="center">
                            {level.packs.length ? level.packs.sort((a: any,b: any) => a.position - b.positon).map((e: any) => {
                                let rgb = hexToRGB(e.color)
                                return <Badge style={{backgroundColor: packHover != e.id ? `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, 0.5)` : "rgba(191, 15, 27)", color: "white", fontSize: "20px", padding: "10px", paddingRight: "17px", borderRadius: "20px"}} key={e.name} onMouseOver={_ => setPackHover(e.id)} onMouseLeave={_ => setPackHover(null)} onClick={_ => {
                                    if(packHover == e.id) {
                                        setLevel({...level, packs: level.packs.filter((x:any) => x.id != e.id)})
                                        setPackHover(null)
                                    }
                                }}>{packHover == e.id ? <MinusIcon></MinusIcon> : <DotFilledIcon></DotFilledIcon>}{e.name}</Badge>
                            }) : ""}
            </Flex>
                        <br></br>
                        <TableRoot variant="surface">
                            <TableHeader>
                                <TableRow>
                                    <TableColumnHeaderCell>#</TableColumnHeaderCell>
                                    <TableColumnHeaderCell>Name</TableColumnHeaderCell>
                                    <TableColumnHeaderCell>Publisher</TableColumnHeaderCell>
                                </TableRow>
                            </TableHeader>
                            {!level.hide ? <TableBody>
                                <TableRow>
                                    <TableRowHeaderCell style={{fontWeight: level.position == 1 ? "bold" : "initial"}}>{level.position == 1 ? 1 : filteredLevels.find((e:any) => level.position == filteredLevels.length ? e.position == level.position-2 : e.position == level.position-1)?.position}</TableRowHeaderCell>
                                    <TableCell style={{fontWeight: level.position == 1 ? "bold" : "initial"}}>{filteredLevels.find((e:any) => level.position == 1 ? e.id == level.id : level.position == filteredLevels.length ? e.position == level.position-2 : e.position == level.position-1)?.name}</TableCell>
                                    <TableCell style={{fontWeight: level.position == 1 ? "bold" : "initial"}}>{filteredLevels.find((e:any) => level.position == 1 ? e.id == level.id : level.position == filteredLevels.length ? e.position == level.position-2 : e.position == level.position-1)?.publisher}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableRowHeaderCell style={{fontWeight: level.position != 1 && level.position != filteredLevels.length ? "bold" : "initial"}}>{level.position != 1 && level.position != filteredLevels.length ? level.position : filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 2 : e.position == level.position-1)?.position}</TableRowHeaderCell>
                                    <TableCell style={{fontWeight: level.position != 1 && level.position != filteredLevels.length ? "bold" : "initial"}}>{filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 2 : level.position == filteredLevels.length ? e.position == level.position-1 : e.id == level.id)?.name}</TableCell>
                                    <TableCell style={{fontWeight: level.position != 1 && level.position != filteredLevels.length ? "bold" : "initial"}}>{filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 2 : level.position == filteredLevels.length ? e.position == level.position-1 : e.id == level.id)?.publisher}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableRowHeaderCell style={{fontWeight: level.position == filteredLevels.length ? "bold" : "initial"}}>{level.position == filteredLevels.length ? level.position : filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 3 : e.position == level.position+1)?.position}</TableRowHeaderCell>
                                    <TableCell style={{fontWeight: level.position == filteredLevels.length ? "bold" : "initial"}}>{filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 3 : level.position == filteredLevels.length ? e.id == level.id : e.position == level.position+1)?.name}</TableCell>
                                    <TableCell style={{fontWeight: level.position == filteredLevels.length ? "bold" : "initial"}}>{filteredLevels.find((e:any) =>  level.position == 1 ? e.position == 3 : level.position == filteredLevels.length ? e.id == level.id : e.position == level.position+1)?.publisher}</TableCell>
                                </TableRow>
                            </TableBody> : ""}
                        </TableRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot>#</TextFieldSlot>
                            <TextFieldInput defaultValue={level.position} type="number" onChange={e => {
                                let levPos = level.position
                                let newLevPos = parseInt(e.target.value)
                                if(!newLevPos || newLevPos < 1 || newLevPos > filteredLevels.length) {
                                    setLevel({...level, hide: true})
                                    return;
                                }
                                let levels = structuredClone(filteredLevels)
                                for(let i = Math.min(levPos, newLevPos)-1; i < Math.max(levPos, newLevPos); i++) {
                                    if(i == levPos-1) {
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
                                setLevel({...level, position: parseInt(e.target.value), hide: false})
                            }}></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><LetterCaseCapitalizeIcon></LetterCaseCapitalizeIcon></TextFieldSlot>
                            <TextFieldInput defaultValue={level.name} onChange={e => setLevel({...level, name: e.target.value})}></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><PersonIcon></PersonIcon></TextFieldSlot>
                            <TextFieldInput defaultValue={level.publisher} onChange={e => setLevel({...level, publisher: e.target.value})}></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><VideoIcon></VideoIcon></TextFieldSlot>
                            <TextFieldInput defaultValue={level.ytcode} onChange={e => setLevel({...level, ytcode: e.target.value})}></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <Grid style={{placeItems: "center"}}>
                    <iframe src={`https://www.youtube.com/embed/${level.ytcode}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
               </Grid>
               <br></br>
              {level.formerRank ? <>
                <TextFieldRoot>
                            <TextFieldSlot>Removal Reason</TextFieldSlot>
                            <TextFieldInput defaultValue={level.removalReason} onChange={e => setLevel({...level, removalReason: e.target.value})}></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
              </> : ""}
               <Flex gap="2" align='center' justify={'center'}>
                    <Text size="6" as="p" weight='bold' align='center'>Records</Text>
                    <SelectRoot defaultValue="lol" onValueChange={e => {
                        if(e == "lol") return setRecord(null)
                        setRecord(null)
                        setOpenPlayers(false)
                        setTimeout(() => {
                            setRecord(parseInt(e))
                        }, 0)
                    }}>
                        <SelectTrigger></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={"lol"}>Select Record</SelectItem>
                                {level.list.map((x:any, i: number) => <SelectItem key={i} value={i.toString()}>{x.player.name}</SelectItem>)}
                            </SelectGroup>
                        </SelectContent>
                    </SelectRoot>
                    </Flex>
               <br></br>
               {record !== null ? <Box>
                <TextFieldRoot mt="4">
                <TextFieldSlot style={{paddingRight: "8px"}}><PersonIcon></PersonIcon></TextFieldSlot>
                <TextFieldInput defaultValue={level.list[record].player.name} placeholder="Player Name..." id="player" onClick={(e) => {
                    setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(level.list[record as any].player.name.toLowerCase())))
                    setOpenPlayers(true)
                }} onChange={(e) => {
                        setEditedRecords([...editedRecords.filter(x => x.id != level.list[record as any].id), {
                            id: level.list[record as any].id,
                            name: e.target.value,
                            link: level.list[record as any].link,
                            verification: level.list[record as any].verification,
                            beaten_when_weekly: level.list[record as any].beaten_when_weekly
                        }])
                        setLevel({...level, list: level.list.map((x:any, i: number) => {
                            if(record != i) return x;
                            x.player.name = e.target.value
                            return x
                        })})
                        setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
                }}></TextFieldInput>
            </TextFieldRoot>
            <Card style={{display: openPlayers ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s"}}>
            <div style={{marginBottom: "10px"}}></div>
            {filteredPlayers.filter(x => !level.list.find((y:any, i: number) => y.player.id == x.id && record != i)).map((e:any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{margin: "-8px"}} onClick={() => {
                 setEditedRecords([...editedRecords.filter(x => x.id != level.list[record as any].id), {
                    id: level.list[record as any].id,
                    name: e.name,
                    link: level.list[record as any].link,
                    verification: level.list[record as any].verification,
                    beaten_when_weekly: level.list[record as any].beaten_when_weekly
                }])
                setLevel({...level, list: level.list.map((x:any, i: number) => {
                    if(record != i) return x;
                    x.player.name = e.name
                    return x
                })});
                (document.getElementById("player") as any).value = e.name
                setOpenPlayers(false)
            }}><Text color="gray" mr="6">#{e.position}</Text> {e.name} ({e.records} points)</Text></Box>)}
            </Card>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><Link1Icon></Link1Icon></TextFieldSlot>
                            <TextFieldInput defaultValue={level.list[record].link} onChange={(e) => {
                                setEditedRecords([...editedRecords.filter(x => x.id != level.list[record as any].id), {
                                    id: level.list[record as any].id,
                                    name: level.list[record as any].name,
                                    link: e.target.value,
                                    verification: level.list[record as any].verification,
                                    beaten_when_weekly: level.list[record as any].beaten_when_weekly
                                }])
                                setLevel({...level, list: level.list.map((x:any, i: number) => {
                                    if(record != i) return x;
                                    x.link = e.target.value
                                    return x
                                })})
                            }}></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <Grid style={{placeItems: "center"}}>
                    <iframe src={`https://www.youtube.com/embed/${getYoutubeVideoId(level.list[record as any].link).videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
               </Grid>
               <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot>Verification</TextFieldSlot>
                            <SelectRoot defaultValue={JSON.stringify(!!level.list[record].verification)} onValueChange={(e) => {
                                setEditedRecords([...editedRecords.filter(x => x.id != level.list[record as any].id), {
                                    id: level.list[record as any].id,
                                    name: level.list[record as any].name,
                                    link: level.list[record as any].link,
                                    verification: JSON.parse(e),
                                    beaten_when_weekly: level.list[record as any].beaten_when_weekly
                                }])
                                setLevel({...level, list: level.list.map((x:any, i: number) => {
                                    if(record != i) return x;
                                    x.verification = JSON.parse(e)
                                    return x
                                })})
                            }}>
                                <SelectTrigger></SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value={"true"}>true</SelectItem>
                                        <SelectItem value={"false"}>false</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </SelectRoot>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot>Beaten When Weekly</TextFieldSlot>
                            <SelectRoot defaultValue={JSON.stringify(!!level.list[record].beaten_when_weekly)} onValueChange={(e) => {
                                setEditedRecords([...editedRecords.filter(x => x.id != level.list[record as any].id), {
                                    id: level.list[record as any].id,
                                    name: level.list[record as any].name,
                                    link: level.list[record as any].link,
                                    verification: level.list[record as any].verification,
                                    beaten_when_weekly:JSON.parse(e)
                                }])
                                setLevel({...level, list: level.list.map((x:any, i: number) => {
                                    if(record != i) return x;
                                    x.beaten_when_weekly = JSON.parse(e)
                                    return x
                                })})
                            }}>
                                <SelectTrigger></SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value={"true"}>true</SelectItem>
                                        <SelectItem value={"false"}>false</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </SelectRoot>
                        </TextFieldRoot>
                        <br></br>
                        <Grid style={{placeItems: "center"}}>
                            <Button color='red' onClick={() => {
                                setRecord(null)
                                setDeletedRecords([...deletedRecords, level.list[record as any].id])
                                setEditedRecords(editedRecords.filter(x => x.id != level.list[record as any].id))
                                setLevel({...level, list: level.list.filter((x: any) => x.id != level.list[record as any].id)})
                            }}>Delete</Button>
                        </Grid>
               </Box> : ""}
                        <br></br>
               <Flex justify={'center'} gap='9'>
                        <Button size='4' onClick={async () => {
                            document.getElementById('close')?.click()
                            let obj: any = {
                                ...level,
                                editedRecords,
                                deletedRecords
                            }
                            delete obj.hide
                            delete obj.list
                            setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/level/"+level.id, {
                                         method: "PATCH",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': authData.token
                                         },
                                         body: JSON.stringify(obj)
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
                                         setError({color: "green", message: `Successfully edited level ${obj.name} by ${obj.publisher}`})
                                         setFilteredLevels(levels)
                                         setOriginalLevels(levels)
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 3000)
                                     }
                            console.log(obj)
                        }} id="submit">Submit</Button>
                        <DialogRoot>
                            <DialogTrigger>
                            <Button size='4' color='red'>Delete</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle style={{fontSize: "30px"}} weight='bold' as='h1' align='center'>Reason?</DialogTitle>
                                <DialogDescription align='center'>Do <b>NOT</b> specify if you don&apos;t want this level to move to legacy</DialogDescription>
                                <br></br>
                                <TextFieldRoot>
                                    <TextFieldSlot>Reason</TextFieldSlot>
                                    <TextFieldInput id='reason'></TextFieldInput>
                                </TextFieldRoot>
                                <br></br>
                                <DialogClose>
                                    <Flex gap="9" justify='center'>
                                        <Button color='red' size='3' onClick={async _ => {
                                            document.getElementById("close")?.click()
                                            let obj = {
                                                id: level.id,
                                                removalReason: (document.getElementById('reason') as any).value
                                            }
                                            setError({color: "blue", message: "Loading..."})
                                     let req = await fetch("/api/level/"+level.id, {
                                         method: "DELETE",
                                         headers: {
                                             'content-type': 'application/json',
                                             'authorization': authData.token
                                         },
                                         body: JSON.stringify(obj)
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
                                         setError({color: "green", message: `Successfully deleted level ${level.name} by ${level.publisher}`})
                                         setFilteredLevels(levels)
                                         setOriginalLevels(levels)
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 3000)
                                     }
                                            console.log(obj)
                                        }}>Continue</Button>
                                        <Button color='red' onClick={_ => setLevel({...level, removalReason: null})} size='3'>Close</Button>
                                    </Flex>
                                </DialogClose>
                            </DialogContent>
                        </DialogRoot>
                    </Flex>
                    <br></br>
                    <br></br>
                    
               <DialogClose>
                    <Flex justify={'center'} gap='9'>
                        <Button color='red' size='3' id='close'>Close</Button>
                    </Flex>
                    </DialogClose>
                        </> : <DialogTitle as="h1" style={{fontSize: "30px"}}>
                            Loading level...
                        </DialogTitle>}
                    </DialogContent>
                </DialogRoot>)}
            </Grid>
            </Grid>
        </Box>
    )
}