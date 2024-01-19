'use client';
import { CheckIcon, CrossCircledIcon, EnterIcon, EnvelopeClosedIcon, InfoCircledIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button, CalloutIcon, CalloutRoot, CalloutText, DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger, Flex, Grid, Separator, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
    let [email, setEmail] = useState("")
    let [valid, setValid] = useState(true)
    let [error, setError] = useState({color: "red", message: ""})
  return (
    <DialogRoot>
        <DialogTrigger>
            <Link href="#" style={{textDecoration: "none", color: "white"}}><Text size="3"><EnterIcon style={{scale: 1.3}}></EnterIcon></Text></Link>
        </DialogTrigger>
        <DialogContent style={{padding: "30px"}}>
            <Flex gap="4" justify={'center'} align={'center'} >
                <EnvelopeClosedIcon style={{scale: 2}}></EnvelopeClosedIcon>
                <DialogTitle as="h1" align="center" style={{fontSize: "30px", marginBottom: "-5px"}}>Email Login</DialogTitle>
            </Flex>
            <br></br>
            <TextFieldRoot>
                <TextFieldSlot pr="3"><PaperPlaneIcon></PaperPlaneIcon></TextFieldSlot>
                <TextFieldInput defaultValue={email} placeholder="Email..." color={valid ? "blue" : "red"} onChange={(e) => {
                    let valid = !e.target.value ||  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(e.target.value)
                    setValid(valid)
                    setEmail(e.target.value)
                }}></TextFieldInput>
            </TextFieldRoot>
            {!valid ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{scale: 1.4}}></CrossCircledIcon>
                    <Text size="3" color="red" style={{lineHeight: "20px"}}>Not a valid email</Text>
               </Flex> : ""}
            <br></br>
            {error.message ? <><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
            <Flex justify={'center'} gap="3">
            <Button style={{width: "20%"}} onClick={async () => {
                if(!valid || !email) return;
                setError({color: "blue", message: "Attempting to send email to client..."})
                let req = await signIn("email", {email, redirect: false})
                if(!req?.ok) {
                    setError({color: "red", message: req?.error || ""})
                } else {
                    setError({color: "green", message: `Successfully sent a login email to ${email}!`})
                }
            }}>Submit</Button>
            <br></br>
            <DialogClose>
                <Button style={{width: "20%"}} color="red" onClick={() => {setEmail(""); setError({color: "red", message: ""})}}>Cancel</Button>
            </DialogClose>
            </Flex>
        </DialogContent>
    </DialogRoot>
  )
}