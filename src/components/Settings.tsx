import { CheckIcon, CrossCircledIcon, EnterIcon, ExitIcon, GearIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, CalloutIcon, CalloutRoot, CalloutText, DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger, Flex, Grid, Separator, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from "@radix-ui/themes";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface info {
    authData: Record<any, any>
}

export default function Settings({authData}: info) {
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
                <CalloutText size="3" ml="-1">Verify your email address by checking your inbox! Relog back in to receive the email again. Your account will be deleted after 24 hours if you don't verify your account.</CalloutText>
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