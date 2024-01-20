'use client';
import { ButtonIcon, ChatBubbleIcon, CheckIcon, CrossCircledIcon, EnterIcon, EnvelopeClosedIcon, EyeClosedIcon, EyeNoneIcon, EyeOpenIcon, InfoCircledIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button, CalloutIcon, CalloutRoot, CalloutText, DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger, Flex, Grid, Separator, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
    let [login, setLogin] = useState({
        email: {
            valid: true,
            text: ""
        },
        password: {
            hidden: true,
            text: ""
        }
    })
    let [signup, setSignUp] = useState({
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
        },
        username: ""
    })
    let [error, setError] = useState({color: "red", message: "", type: 1})
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
                <TextFieldInput defaultValue={login.email.text} placeholder="Email..." color={login.email.valid ? "blue" : "red"} onChange={(e) => {
                    let valid = !e.target.value ||  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(e.target.value)
                    setLogin({
                        ...login,
                        email: {
                            valid,
                            text: e.target.value
                        }
                    })
                }}></TextFieldInput>
            </TextFieldRoot>
            {!login.email.valid ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{scale: 1.4}}></CrossCircledIcon>
                    <Text size="3" color="red" style={{lineHeight: "20px"}}>Not a valid email</Text>
               </Flex> : ""}
            <br></br>
            <TextFieldRoot>
                <TextFieldSlot pr="3"><ButtonIcon></ButtonIcon></TextFieldSlot>
                <TextFieldInput defaultValue={login.password.text} type={login.password.hidden ? "password" : "text"} placeholder="Password..." onChange={(e) => {
                    setLogin({...login, password: {hidden: login.password.hidden, text: e.target.value}})
                }}></TextFieldInput>
                <TextFieldSlot pr="3" onClick={() => setLogin({...login, password: {hidden: !login.password.hidden, text: login.password.text}})}>{login.password.hidden ? <EyeNoneIcon></EyeNoneIcon> : <EyeOpenIcon></EyeOpenIcon>}</TextFieldSlot>
            </TextFieldRoot>
            <br></br>
            {error.message && error.type == 1 ? <><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
            <Grid style={{placeItems: "center"}}>
            <Button style={{width: "20%"}} onClick={async () => {
                if(!login.email.valid || !login.email.text || !login.password.text) return;
                setError({color: "blue", message: "Loading...", type: 1})
                let req = await signIn("credentials", {email: login.email.text, password: login.password.text, type: "login", redirect: false})
                if(req?.error) {
                    setError({color: "red", message: req?.error || "", type: 1})
                } else {
                    window.location.reload()
                }
            }}>Submit</Button>
            </Grid>
            <br></br>
            <Separator my="3" size="4" />
            <br></br>
            <Flex gap="4" justify={'center'} align={'center'} >
                <EnvelopeClosedIcon style={{scale: 2}}></EnvelopeClosedIcon>
                <DialogTitle as="h1" align="center" style={{fontSize: "30px", marginBottom: "-5px"}}>Email Signup</DialogTitle>
            </Flex>
            <br></br>
            <TextFieldRoot>
                <TextFieldSlot pr="3"><PaperPlaneIcon></PaperPlaneIcon></TextFieldSlot>
                <TextFieldInput defaultValue={signup.email.text} placeholder="Email..." color={signup.email.valid ? "blue" : "red"} onChange={(e) => {
                    let valid = !e.target.value ||  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(e.target.value)
                    setSignUp({
                        ...signup,
                        email: {
                            valid,
                            text: e.target.value
                        }
                    })
                }}></TextFieldInput>
            </TextFieldRoot>
            {!signup.email.valid ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{scale: 1.4}}></CrossCircledIcon>
                    <Text size="3" color="red" style={{lineHeight: "20px"}}>Not a valid email</Text>
               </Flex> : ""}
               <br></br>
            <TextFieldRoot>
                <TextFieldSlot pr="3"><ChatBubbleIcon></ChatBubbleIcon></TextFieldSlot>
                <TextFieldInput defaultValue={signup.username} placeholder="Name..." onChange={(e) => {
                    setSignUp({
                        ...signup,
                        username: e.target.value
                    })
                }}></TextFieldInput>
            </TextFieldRoot>
            <br></br>
            <TextFieldRoot>
                <TextFieldSlot pr="3"><ButtonIcon></ButtonIcon></TextFieldSlot>
                <TextFieldInput defaultValue={signup.password1.text} type={signup.password1.hidden ? "password" : "text"} placeholder="Password..." onChange={(e) => {
                    setSignUp({...signup, password1: {hidden: signup.password1.hidden, text: e.target.value}})
                }}></TextFieldInput>
                <TextFieldSlot pr="3" onClick={() => setSignUp({...signup, password1: {hidden: !signup.password1.hidden, text: signup.password1.text}})}>{signup.password1.hidden ? <EyeNoneIcon></EyeNoneIcon> : <EyeOpenIcon></EyeOpenIcon>}</TextFieldSlot>
            </TextFieldRoot>
            <br></br>
            <TextFieldRoot>
                <TextFieldSlot pr="3"><ButtonIcon></ButtonIcon></TextFieldSlot>
                <TextFieldInput defaultValue={signup.password2.text} type={signup.password2.hidden ? "password" : "text"}  color={!signup.password2.text || signup.password1.text == signup.password2.text ? "blue" : "red"} placeholder="Repeat password..." onChange={(e) => {
                    setSignUp({...signup, password2: {hidden: signup.password2.hidden, text: e.target.value}})
                }}></TextFieldInput>
                <TextFieldSlot pr="3" onClick={() => setSignUp({...signup, password2: {hidden: !signup.password2.hidden, text: signup.password2.text}})}>{signup.password2.hidden ? <EyeNoneIcon></EyeNoneIcon> : <EyeOpenIcon></EyeOpenIcon>}</TextFieldSlot>
            </TextFieldRoot>
            {signup.password2.text && signup.password1.text != signup.password2.text ? <Flex mt="2" align={'center'} gap="2">
                    <CrossCircledIcon color="red" style={{scale: 1.4}}></CrossCircledIcon>
                    <Text size="3" color="red" style={{lineHeight: "20px"}}>Passwords do not match</Text>
               </Flex> : ""}
            <br></br>
            {error.message && error.type == 2 ? <><CalloutRoot color={error.color as any}>
                <CalloutIcon>
                    {error.color == "red" ? <CrossCircledIcon style={{scale: 1.5}}></CrossCircledIcon> : error.color == "green" ? <CheckIcon style={{scale: 1.5}}></CheckIcon> : <InfoCircledIcon style={{scale: 1.5}}></InfoCircledIcon>}
                </CalloutIcon>
                <CalloutText size="3" ml="-1">{error.message}</CalloutText>
            </CalloutRoot><br></br></> : ""}
            <Grid style={{placeItems: "center"}}>
            <Button style={{width: "20%"}} onClick={async () => {
                if(!signup.email.valid || !signup.email.text || !signup.password1.text || !signup.password2.text) return;
                setError({color: "blue", message: "Loading...", type: 2})
                let req = await signIn("credentials", {email: signup.email.text, username: signup.username, password: signup.password1.text, type: "signup", redirect: false})
                if(req?.error) {
                    setError({color: "red", message: req?.error || "", type: 2})
                } else {
                    setError({color: "green", message: `Successfully sent verification email to ${signup.email.text}`, type: 2})
                    setTimeout(() => window.location.reload(), 3000)
                }
            }}>Submit</Button>
            </Grid>
            <br></br>
            <DialogClose>
            <Grid style={{placeItems: "center"}}>
            <Button style={{width: "20%"}} color="red">Close</Button>
            </Grid>
            </DialogClose>
        </DialogContent>
    </DialogRoot>
  )
}