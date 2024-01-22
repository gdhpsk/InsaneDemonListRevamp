'use client';
import { Button, DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger, Grid } from "@radix-ui/themes";

export default function AdminPanel() {
    return (
        <DialogRoot>
            <DialogTrigger>
                <Grid style={{placeItems: "center"}}>
                    <Button>Admin Panel</Button>
                </Grid>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle as="h1" weight="bold" align="center" size="8">Admin Panel</DialogTitle>
                <br></br>
                <Grid style={{placeItems: "center"}}>
                    <Button onClick={() => window.location.href = "/editadmins"} size="3">Admin Editor</Button>
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