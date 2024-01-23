'use client'
import { Box, CalloutIcon, CalloutRoot, CalloutText, Card, Flex, Grid, IconButton, Separator, Text, TextFieldInput, TextFieldRoot, TextFieldSlot } from '@radix-ui/themes';
import styles from "../account.module.css"
import { ChatBubbleIcon, CheckIcon, Cross1Icon, CrossCircledIcon, EnvelopeClosedIcon, HomeIcon, InfoCircledIcon, Pencil1Icon, ReaderIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import ProfileHome from './home';
import ProfileSubmissions from './submissions';

interface info {
    account: Record<any, any>
}

export default function ProfileClient({account}: info) {

    let [authData, setAuthData] = useState(account)
    let [part, selectPart] = useState("home")
    

  return (
    <Grid style={{placeItems: "center"}}>
        <Flex gap="9" style={{width: "min(1800px, 100%)"}}>
            <Box style={{width: "300px"}}>
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
                <br></br>
                <Flex gap="3" align={'center'}className={`${styles.option} ${part == "submissions" ? styles.active : ""}`} onClick={() => selectPart("submissions")}>
                <ReaderIcon style={{scale: 1.4}}></ReaderIcon>
                <Text size="4" as='p'>Submissions</Text>
                </Flex>
            </Box>
            <Separator orientation="vertical" style={{height: "93vh"}} />
            <Box width={"100%"}>
                {part == "home" ? <ProfileHome
                    authData={authData}
                    setAuthData={setAuthData}
                ></ProfileHome> : part == "submissions" ? <ProfileSubmissions
                    data={authData}
                ></ProfileSubmissions> : ""}
            </Box>
        </Flex>
    </Grid>
  )
}

export const revalidate = 0