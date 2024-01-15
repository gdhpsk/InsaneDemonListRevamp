'use client'
import Level from '@/components/Level'
import { Box, Button, ContextMenuContent, ContextMenuItem, ContextMenuRoot, ContextMenuSeparator, ContextMenuTrigger, DialogClose, DialogContent, DialogRoot, DialogTitle, DialogTrigger, Flex, Table, TableBody, TableColumnHeaderCell, TableHeader, TableRoot, TableRow, TableRowHeaderCell, Text } from '@radix-ui/themes'

interface info {
    level: Record<any, any>
    count: number,
    time: number
}

export default function LevelContextMenu({level, count, time}: info) {
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
                        <TableColumnHeaderCell>Documents</TableColumnHeaderCell>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableRowHeaderCell>{JSON.stringify(level).length / 1000} kb</TableRowHeaderCell>
                            <TableRowHeaderCell>{time} ms</TableRowHeaderCell>
                            <TableRowHeaderCell>{count}</TableRowHeaderCell>
                        </TableRow>
                    </TableBody>
                </TableRoot>
                <br></br>
                <DialogClose>
                <Button color="red">Close</Button>
            </DialogClose>
            </DialogContent>
        </DialogRoot>
                <Level
                    level={level}
                    count={count}
                ></Level>
           </Box>
        </ContextMenuTrigger>
        <ContextMenuContent>
        <ContextMenuItem disabled><Flex align={"center"} gap="2"><img src="/song.png" height="20px"></img>Copy Song Link</Flex></ContextMenuItem>
      <ContextMenuItem onClick={() => navigator.clipboard.writeText(`https://youtu.be/${level.ytcode}`)}><Flex align={"center"} gap="2"><img src="/youtube.svg" height="20px"></img>Copy Video Link</Flex></ContextMenuItem>
      <ContextMenuItem onClick={() => {
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
      }}><Flex align={"center"} gap="2"><img src="/text.png" height="20px"></img>Copy Text Format</Flex></ContextMenuItem>
      <ContextMenuSeparator></ContextMenuSeparator>
      <ContextMenuItem onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/level/${level.id}`)}><Flex align={"center"} gap="2"><img src="/mongo.png" height="20px"></img>Copy Exact Level URL</Flex></ContextMenuItem>
    <ContextMenuItem onClick={() => navigator.clipboard.writeText(level.id)}><Flex align={"center"} gap="2"><img src="/mongo.png" height="20px"></img>Copy Object ID</Flex></ContextMenuItem>
    <ContextMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(level))}><Flex align={"center"} gap="2"><img src="/json.png" height="20px"></img>Copy Level JSON</Flex></ContextMenuItem>
    <ContextMenuItem onClick={() => document.getElementById("debug")?.click()}><Flex align={"center"} gap="2"><img src="/debug.png" height="20px"></img>Debug</Flex></ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuRoot>
  )
}
