'use client'
import Level from '@/components/Level'
import Profile from '@/components/Profile'
import { Box, Button, ContextMenu, Dialog, Flex, Table, Text } from '@radix-ui/themes'
import { useSearchParams } from 'next/navigation'

interface info {
    profile: Record<any, any>
    metadata: Record<any, any>,
    time: number,
    nationality?: boolean,
    icons?: Array<string>
}

export default function ProfileContextMenu({profile, metadata, time, nationality, icons}: info) {
    let params = useSearchParams()
    let platformer = params.get("platformer") == "true"
  return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
           <Box>
           <Dialog.Root>
            <Dialog.Trigger>
               <Button id="debug" style={{display: "none"}}></Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title as="h1" align="center" style={{fontSize: "30px"}}>Insane Demon List Debug Panel</Dialog.Title>
                <br></br>
                <Table.Root>
                    <Table.Header>
                    <Table.ColumnHeaderCell>Size</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>API Response Time</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>{nationality ? "Nationalities" : "Documents"}</Table.ColumnHeaderCell>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.RowHeaderCell>{JSON.stringify(profile).length / 1000} kb</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{time} ms</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{metadata.count}</Table.RowHeaderCell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
                <br></br>
                <Dialog.Close>
                <Button color="red">Close</Button>
            </Dialog.Close>
            </Dialog.Content>
        </Dialog.Root>
                <Profile
                    profile={profile}
                    metadata={metadata}
                    nationality={nationality}
                    icons={icons}
                    platformer={platformer}
                ></Profile>
           </Box>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
            <ContextMenu.Item onClick={() => document.getElementById("debug")?.click()}><Flex align={"center"} gap="2"><img src="/debug.png" height="20px"></img>Debug</Flex></ContextMenu.Item>
            {!nationality ? <ContextMenu.Item onClick={() => navigator.clipboard.writeText(profile.id)}><Flex align={"center"} gap="2"><img src="/mongo.png" height="20px"></img>Copy Object ID</Flex></ContextMenu.Item> : ""}
            <ContextMenu.Item onClick={() => navigator.clipboard.writeText(JSON.stringify(profile))}><Flex align={"center"} gap="2"><img src="/json.png" height="20px"></img>Copy Profile JSON</Flex></ContextMenu.Item>
            <ContextMenu.Item onClick={() => navigator.clipboard.writeText(JSON.stringify(metadata))}><Flex align={"center"} gap="2"><img src="/json.png" height="20px"></img>Copy Metadata JSON</Flex></ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
  )
}
