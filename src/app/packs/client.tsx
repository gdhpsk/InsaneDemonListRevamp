'use client';
import hexToRGB from "@/functions/hexToRGB";
import { CrossCircledIcon, CheckIcon, InfoCircledIcon, Link1Icon, PersonIcon, VideoIcon, LetterCaseCapitalizeIcon, DotFilledIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Badge, Box, Button, CalloutIcon, CalloutRoot, CalloutText, Card, DialogClose, DialogContent, DialogDescription, DialogRoot, DialogTitle, DialogTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuRoot, DropdownMenuTrigger, Flex, Grid, IconButton, SelectContent, SelectGroup, SelectItem, SelectRoot, SelectTrigger, Separator, TableBody, TableCell, TableColumnHeaderCell, TableHeader, TableRoot, TableRow, TableRowHeaderCell, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from "@radix-ui/themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import styles from "../../app/submit.module.css"
import dayjs from "dayjs";

interface info {
    packs: Array<Record<any, any>>
}

export default function Packs({ packs }: info) {

    let [pack, setPack] = useState<Record<any, any> | null>(null)

    let [width, setWidth] = useState(0)

    let getWidth = () => typeof window === 'undefined' ? 0 : window.innerWidth
  
    useEffect(() => {
      setWidth(getWidth())
    })

    return (
        <Box>
            <Flex gap="4" style={{ placeItems: "center", justifyContent: "center" }}>
            <img src="/favicon.ico" height="70px"></img>
                <Text size="9" className="header" style={{ display: "contents" }}>Packs</Text>
                <img src="/favicon.ico" height="70px"></img>
            </Flex>
            <br></br>
            <Grid style={{placeItems: "center"}}>
            <Grid columns={width > 1200 ? "6" : width > 1000 ? "5" : width > 800 ? "4" : width > 600 ? "3" : width > 400 ? "2" : "1"} gap="4" style={{width: "min(2500px, 100%)"}}>
                {packs.map((e: any) => <DialogRoot key={e.id} onOpenChange={async open => {
                    if(open) {
                        let req = await fetch(`/api/pack/${e.id}`)
                        let pack = await req.json()
                        setPack(pack)
                    } else {
                        setPack(null)
                    }
                }}>
                    <DialogTrigger>
                        <Card id={e.id} key={e.id} style={{backgroundColor: `rgba(${Object.values(hexToRGB(e.color) as any).join(", ")}, 0.5)`}} className="infoCard"><Text size="4"><b>#{e.position}: </b>{e.name}</Text></Card>
                    </DialogTrigger>
                    <DialogContent>
                        {pack ? <>
                            <DialogTitle as="h1" align='center' style={{fontSize: "30px"}}>{pack.name}</DialogTitle>
                        <br></br>
                        <TableRoot variant="surface" style={{backgroundColor: `rgba(${Object.values(hexToRGB(e.color) as any).join(", ")}, 0.3)`}}>
                            <TableHeader>
                                <TableRow>
                                    <TableColumnHeaderCell><Text size="3">#</Text></TableColumnHeaderCell>
                                    <TableColumnHeaderCell><Text size="3">Name</Text></TableColumnHeaderCell>
                                    <TableColumnHeaderCell><Text size="3">Publisher</Text></TableColumnHeaderCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pack.levels.map((x:any) => <TableRow key={x.id}>
                                    <TableRowHeaderCell><Text size="3">{x.position}</Text></TableRowHeaderCell>
                                    <TableCell><Text size="3"><a href={`/level/${x.id}`} style={{textDecoration: "none", color: "skyblue"}}>{x.name}</a></Text></TableCell>
                                    <TableCell><Text size="3">{x.publisher}</Text></TableCell>
                                </TableRow>)}
                            </TableBody>
                        </TableRoot>
                        <br></br>
                        <DialogClose>
                            <Grid style={{placeItems: "center"}}>
                            <Button color='red' size='4'>Close</Button>
                            </Grid>
                        </DialogClose>
                        </> : <Text size="8" weight='bold' align='center' as='p'>Loading pack...</Text>}
                    </DialogContent>
                </DialogRoot>)}
            </Grid>
            </Grid>
        </Box>
    )
}