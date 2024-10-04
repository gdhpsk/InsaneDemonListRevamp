'use client'
import { ButtonIcon, CheckIcon, CrossCircledIcon, EnvelopeClosedIcon, EyeNoneIcon, EyeOpenIcon, InfoCircledIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { Button, Callout, Dialog, Flex, Grid, Text, TextField } from '@radix-ui/themes'
import { useState } from 'react'

export default function Nav() {
    let [reset, setReset] = useState({
        email: {
            valid: true,
            text: ""
        },
        password1: {
            hidden: true,
            text: ""
        },
        password2: {
            hidden: true,
            text: ""
        }
    })
    let [error, setError] = useState({ color: "red", message: "" })
    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Text size="2" style={{ textDecoration: "none" }}>Forgot your password?</Text>
            </Dialog.Trigger>
            <Dialog.Content style={{ padding: "30px" }}>
                <Dialog.Title as="h1" weight="bold" align="center" style={{ fontSize: "30px" }}>
                    Reset Password
                </Dialog.Title>
                <Dialog.Description align="center">Reset your password through this form!</Dialog.Description>
                <br></br>
                <TextField.Root defaultValue={reset.email.text} placeholder="Email..." color={reset.email.valid ? "blue" : "red"} onChange={(e) => {
                        let valid = !e.target.value || /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(e.target.value)
                        setReset({
                            ...reset,
                            email: {
                                valid,
                                text: e.target.value
                            }
                        })
                    }}>
                    <TextField.Slot pr="3"><EnvelopeClosedIcon></EnvelopeClosedIcon></TextField.Slot>
                </TextField.Root>
                {!reset.email.valid ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{ scale: 1.4 }}></CrossCircledIcon>
                    <Text size="3" color="red" style={{ lineHeight: "20px" }}>Not a valid email</Text>
                </Flex> : ""}
                <br></br>
                <TextField.Root defaultValue={reset.password1.text} type={reset.password1.hidden ? "password" : "text"} placeholder="New password..." onChange={(e) => {
                        setReset({ ...reset, password1: { hidden: reset.password1.hidden, text: e.target.value } })
                    }}>
                    <TextField.Slot pr="3"><ButtonIcon></ButtonIcon></TextField.Slot>
                    <TextField.Slot pr="3" onClick={() => setReset({ ...reset, password1: { hidden: !reset.password1.hidden, text: reset.password1.text } })}>{reset.password1.hidden ? <EyeNoneIcon></EyeNoneIcon> : <EyeOpenIcon></EyeOpenIcon>}</TextField.Slot>
                </TextField.Root>
                <br></br>
                <TextField.Root defaultValue={reset.password2.text} type={reset.password2.hidden ? "password" : "text"} color={!reset.password2.text || reset.password1.text == reset.password2.text ? "blue" : "red"} placeholder="Repeat new password..." onChange={(e) => {
                        setReset({ ...reset, password2: { hidden: reset.password2.hidden, text: e.target.value } })
                    }}>
                    <TextField.Slot pr="3"><ButtonIcon></ButtonIcon></TextField.Slot>
                    <TextField.Slot pr="3" onClick={() => setReset({ ...reset, password2: { hidden: !reset.password2.hidden, text: reset.password2.text } })}>{reset.password2.hidden ? <EyeNoneIcon></EyeNoneIcon> : <EyeOpenIcon></EyeOpenIcon>}</TextField.Slot>
                </TextField.Root>
                {reset.password2.text && reset.password1.text != reset.password2.text ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{ scale: 1.4 }}></CrossCircledIcon>
                    <Text size="3" color="red" style={{ lineHeight: "20px" }}>Passwords do not match</Text>
                </Flex> : ""}
                <br></br>
                <Grid style={{ placeItems: "center" }}>
                    <Button disabled={!reset.email.valid || !reset.email.text || !reset.password1.text || !reset.password2.text || reset.password1.text != reset.password2.text} style={{ width: "20%" }} onClick={async () => {
                        setError({ color: "blue", message: "Loading..." })
                        let req = await fetch(`/api/login/reset`, {
                            method: "POST",
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: reset.email.text,
                                password: reset.password1.text
                            })
                        })
                        try {
                            let data = await req.json()
                            setError({ color: "red", message: data.message })
                        } catch(_) {
                            setError({ color: "green", message: `Successfully sent password reset email to ${reset.email.text}! If you didn't receive it, redo the form.` })
                            setTimeout(() => setError({ color: "red", message: "" }), 3000)
                        }
                    }}>Submit</Button>
                </Grid>
                <br></br>
                {error.message ? <><Callout.Root color={error.color as any}>
                <Callout.Icon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </Callout.Icon>
                <Callout.Text size="3" ml="-1">{error.message}</Callout.Text>
            </Callout.Root><br></br></> : ""}
                <Grid style={{ placeItems: "center" }}>
                    <Dialog.Close>
                        <Button color="red" style={{ width: "20%" }} onClick={() => setReset({
                            email: {
                                valid: true,
                                text: ""
                            },
                            password1: {
                                hidden: true,
                                text: ""
                            },
                            password2: {
                                hidden: true,
                                text: ""
                            }
                        })}>Close</Button>
                    </Dialog.Close>
                </Grid>
            </Dialog.Content>
        </Dialog.Root>
    )
}