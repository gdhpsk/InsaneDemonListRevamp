'use client'
import { Card, Flex, Avatar, Box, Text, ContextMenu } from "@radix-ui/themes";

interface info {
    avatar: string;
    name: string;
    tag: string;
    channel: string;
    id: string
}

export default function InfoCard({avatar, name, tag, channel, id}: info) {
    return  <ContextMenu.Root>
    <ContextMenu.Trigger  className="infoCard">
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
          <a href={channel} target={channel == "#" ? "_self" : "_blank"} style={{textDecoration: "none", lineBreak: "anywhere"}}>{name}</a>
        </Text>
        <Text as="div" size="2" color="gray">
        {tag}
        </Text>
      </Box>
    </Flex>
            </Card>
    </ContextMenu.Trigger>
    <ContextMenu.Content>
      <ContextMenu.Item onClick={() => navigator.clipboard.writeText(id)} style={{verticalAlign: "middle"}}><img src="/discord.png" height="25px"></img>&nbsp;&nbsp;Copy {name}{name.endsWith("s") ? "'" : "'s"} User ID</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Root>
}