'use client';
import { HomeIcon, RocketIcon } from "@radix-ui/react-icons";
import { Button, DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger, Flex, Grid, Text } from "@radix-ui/themes";
import styles from "../account.module.css"

interface info {
    part: string,
    selectPart: Function
}

export default function AdminPanel({part, selectPart}: info) {

    return (
        <DialogRoot>
            <DialogTrigger>
            <Flex gap="3" align={'center'}className={`${styles.option}`}>
                <RocketIcon style={{scale: 1.4}}></RocketIcon>
                <Text size="4" as='p'>Admin Panel</Text>
                </Flex>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle as="h1" weight="bold" align="center" size="8">Admin Panel</DialogTitle>
                <br></br>
                <Grid style={{placeItems: "center"}}>
                    <Button onClick={() => window.location.href = "/editadmins"} size="3">Admin Editor</Button>
                </Grid>
                <br></br>
                <Grid style={{placeItems: "center"}}>
                    <Button onClick={() => window.location.href = "/submissions"} size="3">Submission Editor</Button>
                </Grid>
                <br></br>
                <Grid style={{placeItems: "center"}}>
                    <Button onClick={() => window.location.href = "/editlevels"} size="3">Level Editor</Button>
                </Grid>
                <br></br>
                <Grid style={{placeItems: "center"}}>
                    <Button onClick={() => window.location.href = "/editpacks"} size="3">Pack Editor</Button>
                </Grid>
                <br></br>
                <Grid style={{placeItems: "center"}}>
                    <Button onClick={() => window.location.href = "/editprofiles"} size="3">Leaderboard Editor</Button>
                </Grid>
                <br></br>
                <br></br>
                <Grid style={{placeItems: "center"}}>
                    <DialogClose>
                        <Button size="3" color="red">Close</Button>
                    </DialogClose>
                </Grid>
            </DialogContent>
        </DialogRoot>
    )
}