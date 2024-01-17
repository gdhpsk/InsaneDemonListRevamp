'use client'
import Level from '@/components/Level'
import Profile from '@/components/Profile'
import { Box, Button, ContextMenuContent, ContextMenuItem, ContextMenuRoot, ContextMenuSeparator, ContextMenuTrigger, DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger, Flex, Table, TableBody, TableColumnHeaderCell, TableHeader, TableRoot, TableRow, TableRowHeaderCell, Text } from '@radix-ui/themes'

interface info {
    profile: Record<any, any>
    metadata: Record<any, any>,
    time: number,
    nationality?: boolean
}

export default function ProfileContextMenu({profile, metadata, time, nationality}: info) {
  return (
      <ContextMenuRoot>
        <ContextMenuTrigger>
           <Box>
           <DialogRoot>
            <DialogTrigger>
               <Button id="debug" style={{display: "none"}}></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle as="h1" align="center" style={{fontSize: "30px"}}>Insane Demon List Debug Panel</DialogTitle>
                <br></br>
                <TableRoot>
                    <TableHeader>
                    <TableColumnHeaderCell>Size</TableColumnHeaderCell>
                        <TableColumnHeaderCell>API Response Time</TableColumnHeaderCell>
                        <TableColumnHeaderCell>{nationality ? "Nationalities" : "Documents"}</TableColumnHeaderCell>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableRowHeaderCell>{JSON.stringify(profile).length / 1000} kb</TableRowHeaderCell>
                            <TableRowHeaderCell>{time} ms</TableRowHeaderCell>
                            <TableRowHeaderCell>{metadata.count}</TableRowHeaderCell>
                        </TableRow>
                    </TableBody>
                </TableRoot>
                <br></br>
                <DialogClose>
                <Button color="red">Close</Button>
            </DialogClose>
            </DialogContent>
        </DialogRoot>
                <Profile
                    profile={profile}
                    metadata={metadata}
                    nationality={nationality}
                ></Profile>
           </Box>
        </ContextMenuTrigger>
        <ContextMenuContent>
            <ContextMenuItem onClick={() => document.getElementById("debug")?.click()}><Flex align={"center"} gap="2"><img src="/debug.png" height="20px"></img>Debug</Flex></ContextMenuItem>
            {!nationality ? <ContextMenuItem onClick={() => navigator.clipboard.writeText(profile.id)}><Flex align={"center"} gap="2"><img src="/mongo.png" height="20px"></img>Copy Object ID</Flex></ContextMenuItem> : ""}
            <ContextMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(profile))}><Flex align={"center"} gap="2"><img src="/json.png" height="20px"></img>Copy Profile JSON</Flex></ContextMenuItem>
            <ContextMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(metadata))}><Flex align={"center"} gap="2"><img src="/json.png" height="20px"></img>Copy Metadata JSON</Flex></ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuRoot>
  )
}
