'use client';
import hexToRGB from "@/functions/hexToRGB";
import { CrossCircledIcon, CheckIcon, InfoCircledIcon, Link1Icon, PersonIcon, VideoIcon, LetterCaseCapitalizeIcon, DotFilledIcon, MinusIcon, PlusIcon, ColorWheelIcon, FileIcon } from "@radix-ui/react-icons";
import { Badge, Box, Button, Callout, Card, Dialog, DropdownMenu, Flex, Grid, IconButton, SegmentedControl, Separator, Table, Text, TextField } from "@radix-ui/themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import styles from "../../app/submit.module.css"
import dayjs from "dayjs";

interface info {
    authData: Record<any, any>
}

export default function Packs({ authData }: info) {
    let [levels, setLevels] = useState<Array<Record<any, any>>>([])
    let [type, setType] = useState<"classic" | "platformer">("classic")
    let [originalLevels, setOriginalLevels] = useState<Array<Record<any, any>>>([])
    let [filteredPacks, setFilteredPacks] = useState<Array<Record<any, any>>>([])
    let [pack, setPack] = useState<Record<any, any> | null>(null)
    let [edits, setEdits] = useState<Array<Record<any, any>>>([])
    let [error, setError] = useState({color: "red", message: ""})
    let [addedLevels, setAddedLevels] = useState<Array<Record<any, any>>>([])
    let [removedLevels, setRemovedLevels] = useState<Array<Record<any, any>>>([])

    let [width, setWidth] = useState(0)

    let getWidth = () => typeof window === 'undefined' ? 0 : window.innerWidth
  
    useEffect(() => {
      setWidth(getWidth())
    })

    useEffect(() => {
        (async () => {
            let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/packs${type == "classic" ? "" : "/platformer"}`)
            let json = await req.json()
            let req1 = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/${type == "classic" ? "levels" : "platformers"}`)
            let json1 = await req1.json()
            setLevels(json1)
            setOriginalLevels(json)
            setFilteredPacks(json)
        })()
    }, [type])

    function allowDrop(ev: any) {
        ev.preventDefault();
      }
      
      function drag(ev: any) {
        ev.dataTransfer.setData("pos", ev.target.id);
      }
      
      function drop(ev: any) {
        ev.preventDefault();
        let levPos = parseInt(filteredPacks.find(e => e.id == ev.dataTransfer.getData("pos"))?.position);
        let newLevPos = parseInt(filteredPacks.find(e => e.id == ev.currentTarget.id)?.position)
        let levels = structuredClone(filteredPacks)
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
        setFilteredPacks(levels.sort((a,b) => a.position - b.position))
      }
    return (
        <Box>
            <Flex gap="4" style={{ placeItems: "center", justifyContent: "center" }}>
            <img src="/favicon.ico" height="70px"></img>
                <Text size="9" className="header" style={{ display: "contents" }}>Pack Editor</Text>
                <img src="/favicon.ico" height="70px"></img>
            </Flex>
            <br></br>
            <Flex justify="center" gap="9">
                <Button size="4" disabled={!filteredPacks.find(e => e.difference)} onClick={async () => {
                    setError({color: "blue", message: "Loading..."})
                                     let req = await fetch(`/api/packs${type == "classic" ? "" : "/platformer"}`, {
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
                                        let req = await fetch(`/api/packs${type == "classic" ? "" : "/platformer"}?start=0`, {
                                            headers: {
                                                authorization: authData.token
                                            }
                                        })
                                        let levels = await req.json()
                                         setError({color: "green", message: `Successfully edited all pack positions`})
                                         setFilteredPacks(levels)
                                         setOriginalLevels(levels)
                                         setEdits([])
                                         setTimeout(() =>{
                                            setError({color: "red", message: ""})
                                         }, 3000)
                                     }
                }}>Save</Button>
                <DialogRoot onOpenChange={_ => {
                   if(_) {
                    setPack({
                        position: 1,
                        name: "",
                        color: "",
                        levels: []
                    })
                   }
                }}>
                    <DialogTrigger>
                        <IconButton size="4" disabled={!!filteredPacks.find(e => e.difference)}>+</IconButton>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle as="h1" align='center' style={{fontSize: "30px"}}>Pack Addition</DialogTitle>
                        <br></br>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot>#</TextFieldSlot>
                            <TextFieldInput onChange={e => {
                                setPack({...pack, position: parseInt(e.target.value)})
                            }} type="number"></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><LetterCaseCapitalizeIcon></LetterCaseCapitalizeIcon></TextFieldSlot>
                            <TextFieldInput onChange={e => {
                                setPack({...pack, name: e.target.value})
                            }} placeholder="Name..."></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><ColorWheelIcon></ColorWheelIcon></TextFieldSlot>
                            <TextFieldInput onChange={e => {
                                setPack({...pack, color: e.target.value})
                            }} placeholder="Color..."></TextFieldInput>
                        </TextFieldRoot>
            <br></br>
            <TableRoot variant="surface" style={{backgroundColor: `rgba(${hexToRGB(pack?.color) as any ? Object.values(hexToRGB(pack?.color) as any).join(", ") : "0, 0, 0"}, 0.3)`}}>
                            <TableHeader>
                                <TableRow>
                                    <TableColumnHeaderCell><Text size="3">#</Text></TableColumnHeaderCell>
                                    <TableColumnHeaderCell><Text size="3">Name</Text></TableColumnHeaderCell>
                                    <TableColumnHeaderCell><Text size="3">Publisher</Text></TableColumnHeaderCell>
                                    <TableColumnHeaderCell><DropdownMenuRoot>
                                            <DropdownMenuTrigger>
                                            <IconButton><PlusIcon></PlusIcon></IconButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {levels.filter((x:any) => !pack?.levels.find((y:any) => y.id == x.id)).map(e => <DropdownMenuItem key={e.id} onClick={() => {
                                                    setPack({...pack, levels: [...pack?.levels, e].sort((a,b) => a.position - b.position)})
                                                    setAddedLevels([...addedLevels, e])
                                                    setRemovedLevels(removedLevels.filter((x:any) => x.id != e.id))
                                                }}>{e.name} by {e.publisher}</DropdownMenu.Item>)}
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Root></Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {pack?.levels.map((x:any) => <Table.Row key={x.id}>
                                    <Table.RowHeaderCell><Text size="3">{x.position}</Text></Table.RowHeaderCell>
                                    <Table.Cell><Text size="3"><a href={`/${type == "platformer" ? "platformer" : "level"}/${x.id}`} style={{textDecoration: "none"}}>{x.name}</a></Text></Table.Cell>
                                    <Table.Cell><Text size="3">{x.publisher}</Text></Table.Cell>
                                    <Table.Cell><IconButton color='red' onClick={() => {
                                        setPack({...pack, levels: pack?.levels.filter((y:any) => y.id != x.id)})
                                        setAddedLevels(addedLevels.filter((y:any) => y != x.id))
                                        setRemovedLevels([...removedLevels, x.id])
                                    }}><MinusIcon></MinusIcon></IconButton></TableCell>
                                </TableRow>)}
                            </TableBody>
                        </TableRoot>
               <br></br>
               <DialogClose>
                <Flex gap="9" justify={'center'}>
                    <Button size='4' disabled={!pack?.name || !pack.position || !pack.color || !pack.levels.length} onClick={async () => {
                        let obj = structuredClone(pack)
                       setError({color: "blue", message: "Loading..."})
                       let req = await fetch(`/api/packs${type == "classic" ? "" : "/platformer"}`, {
                           method: "POST",
                           headers: {
                               'content-type': 'application/json',
                               'authorization': authData.token
                           },
                           body: JSON.stringify(obj)
                       })
                       try {
                        if(req.ok) throw new Error()
                           let data = await req.json()
                           setError({color: "red", message: data.message})
                       } catch(_) {
                          setError({color: "blue", message: "Fetching new information..."})
                          let req = await fetch(`/api/packs${type == "classic" ? "" : "/platformer"}?start=0`, {
                              headers: {
                                  authorization: authData.token
                              }
                          })
                          let levels = await req.json()
                           setError({color: "green", message: `Successfully added pack ${obj?.name}`})
                           setFilteredPacks(levels)
                           setOriginalLevels(levels)
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
                <Button size="4" disabled={!filteredPacks.find(e => e.difference)} color='red' onClick={() => {
                     setFilteredPacks(originalLevels)
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
            <SegmentedControl.Root size="3" defaultValue="classic" onValueChange={e => setType(e as any)}>
                <SegmentedControl.Item value="classic">Classic</SegmentedControl.Item>
                <SegmentedControl.Item value="platformer">Platformer</SegmentedControl.Item>
            </SegmentedControl.Root>
            <br></br>
            <Grid columns={width > 1200 ? "6" : width > 1000 ? "5" : width > 800 ? "4" : width > 600 ? "3" : width > 400 ? "2" : "1"} gap="4" style={{width: "min(2500px, 100%)"}}>
                {filteredPacks.map((e: any) => <DialogRoot key={e.id} onOpenChange={async open => {
                    if(open) {
                        let req = await fetch(`/api/pack${type == "classic" ? "" : "/platformer"}/${e.id}`)
                        let pack = await req.json()
                        setPack(pack)
                    } else {
                        setPack(null)
                        setAddedLevels([])
                        setRemovedLevels([])
                    }
                }}>
                    <DialogTrigger>
                        <Card draggable="true" onDragStart={drag} onDragOver={allowDrop} onDrop={drop} id={e.id} key={e.id} style={{backgroundColor: `rgba(${hexToRGB(e.color) as any ? Object.values(hexToRGB(e.color) as any).join(", ") : "0, 0, 0"}, 0.5)`}}  className="infoCard" onClick={e => {
                            if(!!filteredPacks.find(e => e.difference)) e.preventDefault()
                        }}><Text size="4"><b>#{e.position}: </b>{e.name} {!e.difference ? "" : <Text size="4" color={e.difference < 0 ? "red" : "green"}>{e.difference < 0 ? "-" : "+"}{Math.abs(e.difference)}</Text>}</Text></Card>
                    </DialogTrigger>
                    <DialogContent>
                        {pack ? <>
                            <DialogTitle as="h1" align='center' style={{fontSize: "30px"}}>{pack.name}</DialogTitle>
                            <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot>#</TextFieldSlot>
                            <TextFieldInput defaultValue={e.position} onChange={e => {
                                setPack({...pack, position: parseInt(e.target.value)})
                            }} type="number"></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><LetterCaseCapitalizeIcon></LetterCaseCapitalizeIcon></TextFieldSlot>
                            <TextFieldInput defaultValue={e.name} onChange={e => {
                                setPack({...pack, name: e.target.value})
                            }} placeholder="Name..."></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TextFieldRoot>
                            <TextFieldSlot><ColorWheelIcon></ColorWheelIcon></TextFieldSlot>
                            <TextFieldInput defaultValue={e.color} onChange={e => {
                                setPack({...pack, color: e.target.value})
                            }} placeholder="Color..."></TextFieldInput>
                        </TextFieldRoot>
                        <br></br>
                        <TableRoot variant="surface" style={{backgroundColor: `rgba(${hexToRGB(pack.color) as any ? Object.values(hexToRGB(pack.color) as any).join(", ") : "0, 0, 0"}, 0.3)`}}>
                            <TableHeader>
                                <TableRow>
                                    <TableColumnHeaderCell><Text size="3">#</Text></TableColumnHeaderCell>
                                    <TableColumnHeaderCell><Text size="3">Name</Text></TableColumnHeaderCell>
                                    <TableColumnHeaderCell><Text size="3">Publisher</Text></TableColumnHeaderCell>
                                    <TableColumnHeaderCell><DropdownMenuRoot>
                                            <DropdownMenuTrigger>
                                            <IconButton><PlusIcon></PlusIcon></IconButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {levels.filter((x:any) => !pack?.levels.find((y:any) => y.id == x.id)).map(e => <DropdownMenuItem key={e.id} onClick={() => {
                                                    setPack({...pack, levels: [...pack?.levels, e].sort((a,b) => a.position - b.position)})
                                                    setAddedLevels([...addedLevels, e.id])
                                                    setRemovedLevels(removedLevels.filter((x:any) => x.id != e.id))
                                                }}>{e.name} by {e.publisher}</DropdownMenu.Item>)}
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Root></Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {pack.levels.map((x:any) => <Table.Row key={x.id}>
                                    <Table.RowHeaderCell><Text size="3">{x.position}</Text></Table.RowHeaderCell>
                                    <Table.Cell><Text size="3"><a href={`/${type == "platformer" ? "platformer" : "level"}/${x.id}`} style={{textDecoration: "none"}}>{x.name}</a></Text></Table.Cell>
                                    <Table.Cell><Text size="3">{x.publisher}</Text></Table.Cell>
                                    <Table.Cell><IconButton color='red' onClick={() => {
                                        setPack({...pack, levels: pack?.levels.filter((y:any) => y.id != x.id)})
                                        setAddedLevels(addedLevels.filter((y:any) => y != x.id))
                                        setRemovedLevels([...removedLevels, x.id])
                                    }}><MinusIcon></MinusIcon></IconButton></TableCell>
                                </TableRow>)}
                            </TableBody>
                        </TableRoot>
                        <br></br>
                        
                            <Box>
                            <Flex gap="9" justify={'center'}>
                            <DialogClose>
                            <Button size="4" onClick={async () => {
                                let obj: Record<any, any> = {
                                    ...pack,
                                    addedLevels,
                                    removedLevels
                                }
                                delete obj.levels
                                setError({color: "blue", message: "Loading..."})
                                let req = await fetch(`/api/pack${type == "classic" ? "" : "/platformer"}/`+pack?.id, {
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
                                   let req = await fetch(`/api/packs${type == "classic" ? "" : "/platformer"}?start=0`, {
                                       headers: {
                                           authorization: authData.token
                                       }
                                   })
                                   let levels = await req.json()
                                    setError({color: "green", message: `Successfully edited pack ${obj?.name}`})
                                    setFilteredPacks(levels)
                                    setOriginalLevels(levels)
                                    setTimeout(() =>{
                                       setError({color: "red", message: ""})
                                    }, 3000)
                                }
                            }}>Save</Button>
                            </DialogClose>
                            <DialogClose>
                            <Button size="4" color='red' onClick={async () => {
                                setError({color: "blue", message: "Loading..."})
                                let req = await fetch(`/api/pack${type == "classic" ? "" : "/platformer"}/`+pack?.id, {
                                    method: "DELETE",
                                    headers: {
                                        'content-type': 'application/json',
                                        'authorization': authData.token
                                    }
                                })
                                try {
                                    let data = await req.json()
                                    setError({color: "red", message: data.message})
                                } catch(_) {
                                   setError({color: "blue", message: "Fetching new information..."})
                                   let req = await fetch(`/api/packs${type == "classic" ? "" : "/platformer"}?start=0`, {
                                       headers: {
                                           authorization: authData.token
                                       }
                                   })
                                   let levels = await req.json()
                                    setError({color: "green", message: `Successfully deleted pack ${pack?.name}`})
                                    setFilteredPacks(levels)
                                    setOriginalLevels(levels)
                                    setEdits([])
                                    setTimeout(() =>{
                                       setError({color: "red", message: ""})
                                    }, 3000)
                                }
                            }}>Delete</Button>
                            </DialogClose>
                            </Flex>
                            <br></br>
                            <br></br>
                            <Grid style={{placeItems: "center"}}>
                            <DialogClose>
                                <Button color='red' size='3'>Close</Button>
                                </DialogClose>
                            </Grid>
                            </Box>
                        </> : <Text size="8" weight='bold' align='center' as='p'>Loading pack...</Text>}
                    </DialogContent>
                </DialogRoot>)}
            </Grid>
            </Grid>
        </Box>
    )
}