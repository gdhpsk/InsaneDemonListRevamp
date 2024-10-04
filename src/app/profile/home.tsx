'use client';

import { ChatBubbleIcon, CheckIcon, Cross1Icon, CrossCircledIcon, EnvelopeClosedIcon, InfoCircledIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Callout, Grid, TextField, Text, IconButton, Flex } from "@radix-ui/themes";
import { useState } from "react";

interface info {
    authData: Record<any, any>, 
    setAuthData: Function
}
export default function ProfileHome({authData, setAuthData}: info) {

    let [error, setError] = useState({color: "red", message: "", type: 1})
    let [edit, setEdit] = useState(false)
    let [edits, setEdits] = useState<Record<any, any>>({})

    return (
        <Grid style={{alignItems: "center"}}>
                {!authData.emailVerified ? <Grid style={{placeItems: "center"}}><Callout.Root color={"red"}>
                <Callout.Icon>
                    <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>
                </Callout.Icon>
                <Callout.Text size="3" ml="-1">Verify your email address by checking your inbox! If you didn&apos;t receive it, <span style={{textDecoration: "underline"}} onClick={async () => {
                    setError({
                        color: "blue",
                        message: "Loading...",
                        type: 1
                    })
                    let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/resend/email`, {
                        headers: {
                            authorization: authData.token
                        }
                    })
                    try {
                        let data = await req.json()
                        setError({
                            color: "red",
                            message: data.message,
                            type: 1
                        })
                    } catch(_) {
                        setError({
                            color: "green",
                            message: `Successfully resent verification email to ${authData.email}`,
                            type: 1
                        })
                        setTimeout(() => setError({color: "red", message: "", type: 1}), 3000)
                    }
                }}>Resend it.</span> Your account will be deleted after 24 hours if you don&apos;t verify your account.</Callout.Text>
            </Callout.Root><br></br></Grid> : ""}
            <Flex justify={'end'}>
                    {!edit ? <IconButton style={{position: "absolute"}} onClick={() => {
                        setEdit(!edit)
                    }}>
                        <Pencil1Icon></Pencil1Icon>
                    </IconButton> : <Flex gap="3"  style={{position: "absolute"}}>
                    <IconButton color="red" onClick={() => {
                        setEdit(!edit)
                        setEdits({})
                    }}>
                        <Cross1Icon></Cross1Icon>
                    </IconButton>
                    <IconButton onClick={async () => {
                        setError({color: "blue", message: "Loading...", type: 2})
                        setEdit(!edit)
                        let allEdits = structuredClone(edits)
                        if(allEdits.email) {
                            allEdits = {...allEdits, email: allEdits.email.text}
                        }
                        let req = await fetch("/api/user/me", {
                            method: "PATCH",
                            headers: {
                                'content-type': 'application/json',
                                authorization: authData.token
                            },
                            body: JSON.stringify(allEdits)
                        })
                            let data = await req.json()
                            if(!req.ok) return setError({color: "red", message: data.message, type: 2})
                            setError({color: "green", message: `Successfully edited information. ${edits.email ? `Please make sure you check your inbox in order to verify your new email ${allEdits.email}` : ""}`, type: 2})
                            setAuthData(data)
                            setTimeout(() => setError({color: "red", message: "", type: 1}), 3000)
                        setEdits({})
                    }}>
                        <CheckIcon></CheckIcon>
                    </IconButton>
                    </Flex>}
                </Flex>
            {error.message && error.type == 1 ? <Grid style={{placeItems: "center"}}><Callout.Root color={error.color as any}>
                <Callout.Icon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </Callout.Icon>
                <Callout.Text size="3" ml="-1">{error.message}</Callout.Text>
            </Callout.Root><br></br></Grid> : ""}
                    <br></br>
                    <Grid style={{placeItems: "center"}}>
                        <img src="/account-icon.webp" width="120px"></img>
                        <br></br>
                        {!edit ? <Text as="p" align="center" weight="bold" size="3">Email: {authData.email}</Text> : <><br></br><TextField.Root  placeholder="Email..." defaultValue={authData.email} onChange={(e) => {
                            let valid = !e.target.value ||  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(e.target.value)
                            let obj = structuredClone(edits)
                            if(e.target.value == authData.email) {
                                delete obj.email
                            } else {
                                obj.email = {
                                    valid,
                                    text: e.target.value
                                }
                            }
                            setEdits(obj)
                        }}>
                        <TextField.Slot><EnvelopeClosedIcon></EnvelopeClosedIcon></TextField.Slot>
                    </TextField.Root>
                    {edits.email && !edits.email.valid ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{scale: 1.4}}></CrossCircledIcon>
                    <Text size="3" color="red" style={{lineHeight: "20px"}}>Not a valid email</Text>
               </Flex> : ""}
                    </>}
                    {!edit ? <Text as="p" align="center" weight="bold" size="3">Name: {authData.name}</Text> : <><br></br><TextField.Root placeholder="Name..." defaultValue={authData.name} onChange={(e) => {
                            let obj = structuredClone(edits)
                            if(e.target.value == authData.name) {
                                delete obj.email
                            } else {
                                obj.name = e.target.value
                            }
                            setEdits(obj)
                        }}>
                        <TextField.Slot><ChatBubbleIcon></ChatBubbleIcon></TextField.Slot>
                    </TextField.Root></>}
            <br></br>
            {error.message && error.type == 2 ? <><Callout.Root color={error.color as any}>
                <Callout.Icon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </Callout.Icon>
                <Callout.Text size="3" ml="-1">{error.message}</Callout.Text>
            </Callout.Root><br></br></> : ""}
            </Grid>
                </Grid>
    )
}