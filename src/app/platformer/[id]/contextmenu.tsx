'use client'
import Platformer from '@/components/Platformer'
import { Box, Button, ContextMenu, Dialog, Flex, Table, Text } from '@radix-ui/themes'

interface info {
    level: Record<any, any>
    count: number,
    time: number
}

export default function LevelContextMenu({level, count, time}: info) {
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
                        <Table.ColumnHeaderCell>Documents</Table.ColumnHeaderCell>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.RowHeaderCell>{JSON.stringify(level).length / 1000} kb</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{time} ms</Table.RowHeaderCell>
                            <Table.RowHeaderCell>{count}</Table.RowHeaderCell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
                <br></br>
                <Dialog.Close>
                <Button color="red">Close</Button>
            </Dialog.Close>
            </Dialog.Content>
        </Dialog.Root>
                <Platformer
                    level={level}
                    count={count}
                ></Platformer>
           </Box>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
        <ContextMenu.Item disabled><Flex align={"center"} gap="2"><img src="/song.png" height="20px"></img>Copy Song Link</Flex></ContextMenu.Item>
      <ContextMenu.Item onClick={() => navigator.clipboard.writeText(`https://youtu.be/${level.ytcode}`)}><Flex align={"center"} gap="2"><img src="/youtube.svg" height="20px"></img>Copy Video Link</Flex></ContextMenu.Item>
      <ContextMenu.Item onClick={() => {
        navigator.clipboard.writeText(Object.entries(level).filter(e => e[1] && !["id", "list"].includes(e[0])).map(e => {
             if(e[0] == "ytcode") {
                e[0] = "link"
                e[1] = `https://youtu.be/${e[1]}`
             }
            if(e[0] == "packs") {
                e[1] = e[1].length ? e[1].map((x: any) => x.name).join(", ") : "none"
            }
            return `${e[0]}: ${e[1]}`
        }).join("\n"))
      }}><Flex align={"center"} gap="2"><img src="/text.png" height="20px"></img>Copy Text Format</Flex></ContextMenu.Item>
      <ContextMenu.Separator></ContextMenu.Separator>
      <ContextMenu.Item onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/platformer/${level.id}`)}><Flex align={"center"} gap="2"><img src="/mongo.png" height="20px"></img>Copy Exact Level URL</Flex></ContextMenu.Item>
    <ContextMenu.Item onClick={() => navigator.clipboard.writeText(level.id)}><Flex align={"center"} gap="2"><img src="/mongo.png" height="20px"></img>Copy Object ID</Flex></ContextMenu.Item>
    <ContextMenu.Item onClick={() => navigator.clipboard.writeText(JSON.stringify(level))}><Flex align={"center"} gap="2"><img src="/json.png" height="20px"></img>Copy Level JSON</Flex></ContextMenu.Item>
    <ContextMenu.Item onClick={() => document.getElementById("debug")?.click()}><Flex align={"center"} gap="2"><img src="/debug.png" height="20px"></img>Debug</Flex></ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
  )
}