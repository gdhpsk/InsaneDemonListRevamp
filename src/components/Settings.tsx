'use client';
import { CheckIcon, CrossCircledIcon, EnterIcon, ExitIcon, GearIcon } from "@radix-ui/react-icons";
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