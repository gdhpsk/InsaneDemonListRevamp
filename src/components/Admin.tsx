'use client'
import { Button, CalloutIcon, CalloutRoot, CalloutText, Card, DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRoot, DropdownMenuTrigger, Flex, Grid, Text } from "@radix-ui/themes";
import { useState } from "react";
import cache from "../../cache.json"
import { CaretDownIcon, CheckIcon, Cross1Icon, CrossCircledIcon, InfoCircledIcon } from "@radix-ui/react-icons";

interface info {
    authData: Record<any, any>,
    admin: Record<any, any>,
    users: Array<Record<any, any>>,
    stateFunc: Function
}

export default function Admin({authData, admin, users, stateFunc}: info) {

    function objectEquals(x: any, y: any) {
        'use strict';
        if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
        if (x.constructor !== y.constructor) { return false; }
        if (x instanceof Function) { return x === y; }
        if (x instanceof RegExp) { return x === y; }
        if (x === y || x.valueOf() === y.valueOf()) { return true; }
        if (Array.isArray(x) && x.length !== y.length) { return false; }
        if (x instanceof Date) { return false; }
        if (!(x instanceof Object)) { return false; }
        if (!(y instanceof Object)) { return false; }
        var p = Object.keys(x);
        return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
            p.every(function (i: any) { return objectEquals(x[i], y[i]); } as any);
    }

    let [edits, setEdits] = useState<Record<any, any>>(admin)
    let [error, setError] = useState({color: "red", message: ""})
  return (
    <DialogRoot>
        <DialogTrigger>
            <Card style={{width: "min(600px, 100%)", padding: "10px"}}>
                <Text size="8" weight="bold">{admin.name}{objectEquals(admin, edits) ? "" : " *"}</Text>
                <br></br>
                <br></br>
                <Text size="3">Email: {admin.email}</Text>
                <br></br>
                <Text size="3">Perms: {cache.perms[admin.perms.idl-1]}</Text>
            </Card>
        </DialogTrigger>
            <DialogContent style={{padding: "30px"}}>
            <DialogTitle as="h1" align="center" style={{fontSize: "30px"}}>Admin Settings</DialogTitle>
            <br></br>
            <DropdownMenuRoot>
                <DropdownMenuTrigger disabled={authData.perms.idl < 2}>
                <Flex gap="2" justify={'center'}>
                    <Text size="5">User:</Text>
                    <Button style={{width: "90%"}} color="purple">
                            <Text size="4" align="left" as="p" style={{width: "100%"}}>{edits.email} ({edits.name})</Text>
                            <Text style={{textAlign: "end"}} as="p"><CaretDownIcon style={{scale: 2.5}}></CaretDownIcon></Text>
                    </Button>
                </Flex>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {users.filter((e:any) =>  e._id != edits._id && (edits._id != admin._id ? e._id == admin._id : !e.perms?.idl)).map((e:any) => <DropdownMenuItem style={{fontSize: "15px"}} key={e._id} onClick={() => setEdits({...edits, email: e.email, name: e.name, _id: e._id})}>{e.email} ({e.name})</DropdownMenuItem>)}
                </DropdownMenuContent>
            </DropdownMenuRoot>
            <br></br>
            <DropdownMenuRoot>
                <DropdownMenuTrigger disabled={authData.perms.idl < 2}>
                <Flex gap="2" justify={'center'}>
                    <Text size="5">Perms:</Text>
                    <Button style={{width: "87%"}} color="purple">
                            <Text size="4" align="left" as="p" style={{width: "100%"}}>{cache.perms[edits.perms.idl-1]}</Text>
                            <Text style={{textAlign: "end"}} as="p"><CaretDownIcon style={{scale: 2.5}}></CaretDownIcon></Text>
                    </Button>
                </Flex>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {cache.perms.map((e,i) => <DropdownMenuItem style={{fontSize: "15px"}} key={e} onClick={() => setEdits({...edits, perms: {...edits.perms, idl: i+1}})}>{e}</DropdownMenuItem>)}
                </DropdownMenuContent>
            </DropdownMenuRoot>
            <br></br>
            {error.message ? <><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
            <Flex gap="4" align="center" justify={'center'}>
                <Button size="3" disabled={authData.perms.idl < 2 || objectEquals(admin, edits) || authData.perms.idl < 2} onClick={async () => {
                    setError({color: "blue", message: "Loading..."})
                    let obj = {
                        admin: admin._id,
                        id: edits._id,
                        perms: edits.perms.idl
                    }
                    let req = await fetch("/api/admins/site", {
                        method: "PATCH",
                        headers: {
                            'content-type': 'application/json',
                            authorization: authData.token
                        },
                        body: JSON.stringify(obj)
                    })
                    try {
                        let data = await req.json()
                        setError({color: "red", message: data.message})
                    } catch(_) {
                        stateFunc([...users.filter((e:any) => e._id != admin._id), edits].sort((a:any, b:any) => b?.perms?.idl - a?.perms?.idl))
                        setError({color: "green", message: `Successfully edited admin`})
                        setTimeout(() => setError({color: "red", message: ""}), 3000)
                    }
                }}><CheckIcon></CheckIcon></Button>
                <Button size="3" color="red" disabled={authData.perms.idl < 2 || !objectEquals(admin, edits) || authData.perms.idl < 2} onClick={async () => {
                    setError({color: "blue", message: "Loading..."})
                    let obj = {
                        admin: admin._id
                    }
                    let req = await fetch("/api/admins/site", {
                        method: "DELETE",
                        headers: {
                            'content-type': 'application/json',
                            authorization: authData.token
                        },
                        body: JSON.stringify(obj)
                    })
                    try {
                        let data = await req.json()
                        setError({color: "red", message: data.message})
                    } catch(_) {
                        setError({color: "green", message: `Successfully deleted admin`})
                        setTimeout(() => stateFunc([...users.filter((e:any) => e._id != admin._id), {...admin, perms: {...admin.perms, idl: 0}}].sort((a:any, b:any) => b?.perms?.idl - a?.perms?.idl)), 3000)
                    }
                }}>Delete</Button>
                <Button size="3" color="red" disabled={authData.perms.idl < 2 || objectEquals(admin, edits) || authData.perms.idl < 2} onClick={() => setEdits(admin)}><Cross1Icon></Cross1Icon></Button>
            </Flex>
            <br></br>
            <br></br>
            <Grid style={{placeItems: "center"}}>
            <DialogClose>
                <Button color="red" size="3">Close</Button>
            </DialogClose>
            </Grid>
        </DialogContent>
    </DialogRoot>
  )
}