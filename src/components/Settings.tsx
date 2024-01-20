import { CheckIcon, CrossCircledIcon, EnterIcon, ExitIcon, GearIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, CalloutIcon, CalloutRoot, CalloutText, DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger, Flex, Grid, Separator, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from "@radix-ui/themes";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface info {
    authData: Record<any, any>
}

export default function Settings({authData}: info) {
    let [error, setError] = useState({color: "red", message: "", type: 1})
  return (
    <DialogRoot>
        <DialogTrigger>
            <Link href="#" style={{textDecoration: "none", color: "white"}}><Text size="3"><GearIcon style={{scale: 1.3}}></GearIcon></Text></Link>
        </DialogTrigger>
        <DialogContent style={{padding: "30px"}}>
            {!authData.user.emailVerified ? <><CalloutRoot color={"red"}>
                <CalloutIcon>
                    <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>
                </CalloutIcon>
                <CalloutText size="3" ml="-1">Verify your email address by checking your inbox! If you didn't receive it, <span style={{color: "skyblue", textDecoration: "underline"}} onClick={async () => {
                    setError({
                        color: "blue",
                        message: "Loading...",
                        type: 1
                    })
                    let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/resend`, {
                        headers: {
                            authorization: authData.user.token
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
                            message: `Successfully resent verification email to ${authData.user.email}`,
                            type: 1
                        })
                    }
                }}>Resend it.</span> Your account will be deleted after 24 hours if you don't verify your account.</CalloutText>
            </CalloutRoot><br></br></> : ""}
            {error.message && error.type == 1 ? <><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
            <DialogTitle as="h1" align="center" style={{fontSize: "30px"}}>Account Settings</DialogTitle>
            <Text as="p" align="center" weight="bold" size="3">Email: {authData.user.email}</Text>
            <br></br>
            <Grid style={{placeItems: "center"}}>
            <Button style={{width: "20%"}} onClick={() => signOut()} color="red">Log Out</Button>
            </Grid>
        </DialogContent>
    </DialogRoot>
  )
}