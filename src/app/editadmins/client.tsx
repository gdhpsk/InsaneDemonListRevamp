'use client'
import { Flex, Text, Box, Grid, IconButton, DialogRoot, DialogTrigger, DialogClose, Button, DialogContent, DialogTitle, DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, CalloutIcon, CalloutRoot, CalloutText } from '@radix-ui/themes';
import Image from "next/image"
import Admin from '@/components/Admin';
import { useState } from 'react';
import { CaretDownIcon, CheckIcon, CrossCircledIcon, InfoCircledIcon, PlusIcon } from '@radix-ui/react-icons';
import cache from "../../../cache.json"

interface info {
    authData: Record<any, any>,
    users: Array<Record<any, any>>
}

export default function EditAdmins({ authData, users }: info) {

    let [accounts, setAccounts] = useState(users)
    let [edits, setEdits] = useState({
        id: "",
        name: "",
        email: "",
        perms: 0
    })
    let [error, setError] = useState({ color: "red", message: "" })

    return (
        <Box>
            <Flex gap="4" style={{ placeItems: "center", justifyContent: "center" }}>
            <img src="/favicon.ico" height="70px"></img>
                <Text size="9" className="header" style={{ display: "contents" }}>Admin Editor</Text>
                <img src="/favicon.ico" height="70px"></img>
            </Flex>
            <br></br>
            <Grid style={{ placeItems: "center" }}>
                <DialogRoot>
                    <DialogTrigger>
                        <IconButton disabled={authData.user.perms.idl < 2}>
                            <PlusIcon></PlusIcon>
                        </IconButton>
                    </DialogTrigger>
                    <DialogContent style={{ padding: "30px" }}>
                        <DialogTitle as="h1" align="center" style={{ fontSize: "30px" }}>Add Admin</DialogTitle>
                        <br></br>
                        <DropdownMenuRoot>
                            <DropdownMenuTrigger disabled={authData.user.perms.idl < 2}>
                                <Flex gap="2" justify={'center'}>
                                    <Text size="5">User:</Text>
                                    <Button style={{ width: "90%" }} color="purple">
                                        <Text size="4" align="left" as="p" style={{ width: "100%" }}>{edits.id ? `${edits.email} (${edits.name})` : "Select"}</Text>
                                        <Text style={{ textAlign: "end" }} as="p"><CaretDownIcon style={{ scale: 2.5 }}></CaretDownIcon></Text>
                                    </Button>
                                </Flex>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {accounts.filter((e: any) => !e.perms?.idl).map((e: any) => <DropdownMenuItem style={{ fontSize: "15px" }} key={e._id} onClick={() => setEdits({ ...edits, id: e._id, name: e.name, email: e.email })}>{e.email} ({e.name})</DropdownMenuItem>)}
                            </DropdownMenuContent>
                        </DropdownMenuRoot>
                        <br></br>
                        <DropdownMenuRoot>
                            <DropdownMenuTrigger disabled={authData.user.perms.idl < 2}>
                                <Flex gap="2" justify={'center'}>
                                    <Text size="5">Perms:</Text>
                                    <Button style={{ width: "87%" }} color="purple">
                                        <Text size="4" align="left" as="p" style={{ width: "100%" }}>{edits.perms ? cache.perms[edits.perms - 1] : "Select"}</Text>
                                        <Text style={{ textAlign: "end" }} as="p"><CaretDownIcon style={{ scale: 2.5 }}></CaretDownIcon></Text>
                                    </Button>
                                </Flex>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {cache.perms.map((e, i) => <DropdownMenuItem style={{ fontSize: "15px" }} key={e} onClick={() => setEdits({ ...edits, perms: i + 1 })}>{e}</DropdownMenuItem>)}
                            </DropdownMenuContent>
                        </DropdownMenuRoot>
                        <br></br>
                        {error.message ? <><CalloutRoot color={error.color as any}>
                            <CalloutIcon>
                                {error.color == "red" ? <CrossCircledIcon style={{ scale: 1.5 }}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{ scale: 1.5 }}></CheckIcon> : <InfoCircledIcon style={{ scale: 1.5 }}></InfoCircledIcon>}
                            </CalloutIcon>
                            <CalloutText size="3" ml="-1">{error.message}</CalloutText>
                        </CalloutRoot><br></br></> : ""}
                        <Flex gap="4" align="center" justify={'center'}>
                            <Button size="3" disabled={!edits.id || !edits.perms || authData.user.perms.idl < 2} onClick={async () => {
                                setError({ color: "blue", message: "Loading..." })
                                let req = await fetch("/api/admins/site", {
                                    method: "POST",
                                    headers: {
                                        'content-type': 'application/json',
                                        authorization: authData.user.token
                                    },
                                    body: JSON.stringify(edits)
                                })
                                    let data = await req.json()
                                    if (!req.ok) return setError({ color: "red", message: data.message })
                                    setError({ color: "green", message: `Successfully added admin` })
                                    setAccounts([...accounts.filter(e => e._id != data._id), {...data, perms: {...data.perms, idl: edits.perms}}].sort((a: any, b: any) => b?.perms?.idl - a?.perms?.idl))
                                    setTimeout(() => {
                                        document.getElementById("add-close")?.click()
                                        setError({ color: "red", message: "" })
                                    }, 3000)
                            }}>Submit</Button>
                        </Flex>
                        <br></br>
                        <br></br>
                        <Grid style={{ placeItems: "center" }}>
                            <DialogClose>
                                <Button color="red" size="3" id="add-close" onClick={() => setEdits({
                                    id: "",
                                    name: "",
                                    email: "",
                                    perms: 0
                                })}>Close</Button>
                            </DialogClose>
                        </Grid>
                    </DialogContent>
                </DialogRoot>
            </Grid>
            <br></br>
            {accounts.filter((e: any) => e.perms?.idl).map((e: any) => <Grid style={{ placeItems: "center" }} key={e._id}><Admin
                authData={authData.user}
                admin={e}
                users={accounts}
                stateFunc={setAccounts}
            ></Admin><br></br></Grid>)}
        </Box>
    )
}
