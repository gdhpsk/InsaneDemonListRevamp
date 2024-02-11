'use client'
import { Card, Flex, Avatar, Box, Text, ContextMenuRoot, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@radix-ui/themes";

interface info {
    avatar: string;
    name: string;
    tag: string;
    channel: string;
    id: string
}

export default function InfoCard({avatar, name, tag, channel, id}: info) {
    return  <ContextMenuRoot>
    <ContextMenuTrigger  className="infoCard">
    <Card style={{ marginTop: "15px", width: "240px" }}>
    <Flex gap="3" align="center">
      <Avatar
        size="4"
        src={avatar}
        radius="full"
        fallback={name}
      />
      <Box>
        <Text as="div" size="2" weight="bold">
          <a href={channel} target={channel == "#" ? "_self" : "_blank"} style={{textDecoration: "none", color: "skyblue"}}>{name}</a>
        </Text>
        <Text as="div" size="2" color="gray">
        {tag}
        </Text>
      </Box>
    </Flex>
            </Card>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem onClick={() => navigator.clipboard.writeText(id)} style={{verticalAlign: "middle"}}><img src="/discord.png" height="25px"></img>&nbsp;&nbsp;Copy {name}{name.endsWith("s") ? "'" : "'s"} User ID</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenuRoot>
}