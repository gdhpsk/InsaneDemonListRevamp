'use client'
import { Box, Button, CalloutIcon, CalloutRoot, CalloutText, Card, Flex, Grid, IconButton, Separator, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from '@radix-ui/themes';
import styles from "../account.module.css"
import { ChatBubbleIcon, CheckIcon, Cross1Icon, CrossCircledIcon, EnvelopeClosedIcon, ExitIcon, HomeIcon, InfoCircledIcon, Pencil1Icon, ReaderIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import ProfileHome from './home';
import ProfileSubmissions from './submissions';
import AdminPanel from './adminpanel';
import { signOut } from 'next-auth/react';

interface info {
    account: Record<any, any>
}

export default function ProfileClient({account}: info) {

    let [authData, setAuthData] = useState(account)
    let [part, selectPart] = useState("home")

    let [width, setWidth] = useState(0)

    let getWidth = () => typeof window === 'undefined' ? 0 : window.innerWidth
  
    useEffect(() => {
      setWidth(getWidth())
    })
    

  return (
    <Grid style={{placeItems: "center"}}>
        <Flex gap="9" style={{width: "min(1600px, 100%)"}}>
        {width > 700 || !(part == 'home' || part == 'submissions') ? <Box style={{width: "300px"}}>
                <Grid style={{placeItems: "center"}}>
                <Text size="8" weight="bold" as="p" align={'center'}>Logged in as:</Text>
                <br></br>
                    <img src="/account-icon.webp" width="120px"></img>
                    <Text size="7" weight="bold" as="p" align={'center'}>{authData.name}</Text>
                    <Text size="5" weight="bold" as="p" align={'center'}>{authData.email}</Text>
                </Grid>
                <Separator my="5" size="4"></Separator>
                <Flex gap="3" align={'center'}className={`${styles.option} ${part == "home" ? styles.active : ""}`} onClick={() => selectPart("home")}>
                <HomeIcon style={{scale: 1.4}}></HomeIcon>
                <Text size="4" as='p'>Home</Text>
                </Flex>
                <Flex gap="3" align={'center'}className={`${styles.option} ${part == "submissions" ? styles.active : ""}`} onClick={() => selectPart("submissions")}>
                <ReaderIcon style={{scale: 1.4}}></ReaderIcon>
                <Text size="4" as='p'>Submissions</Text>
                </Flex>
                <Separator my="3" size="4"></Separator>
                {account.perms?.idl ? <><AdminPanel
                    part={part}
                    selectPart={selectPart}
                ></AdminPanel><Separator my="3" size="4"></Separator></> : ""}
                <Grid style={{placeItems: "center"}}>
                <Flex gap="3" align={'center'}className={`${styles.logout}`} onClick={async () => {
                    await signOut()
                    window.location.href = "/"
                }}>
                <ExitIcon style={{scale: 1.4}}></ExitIcon>
                <Text size="4" as='p'>Log Out</Text>
                </Flex>
                </Grid>
            </Box> : ""}
            <Separator orientation="vertical" style={{height: "93vh"}} />
            {width > 700 || (part == 'home' || part == 'submissions') ? <Box width={"100%"}>
                {width <= 700 ? <Button onClick={() => selectPart('')}>Back</Button> : ""}
                {part == "home" ? <ProfileHome
                    authData={authData}
                    setAuthData={setAuthData}
                ></ProfileHome> : part == "submissions" ? <ProfileSubmissions
                    data={authData}
                ></ProfileSubmissions> : ""}
            </Box> : ""}
        </Flex>
    </Grid>
  )
}

export const revalidate = 0