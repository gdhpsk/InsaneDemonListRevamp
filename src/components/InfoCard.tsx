import { Card, Flex, Avatar, Box, Text } from "@radix-ui/themes";

interface info {
    avatar: string;
    name: string;
    tag: string;
    channel: string
}

export default function InfoCard({avatar, name, tag, channel}: info) {
    return  <Card style={{ marginTop: "15px", width: "240px" }}>
    <Flex gap="3" align="center">
      <Avatar
        size="4"
        src={avatar}
        radius="full"
        fallback="willow"
      />
      <Box>
        <Text as="div" size="2" weight="bold">
          <a href={channel} target="_blank" style={{textDecoration: "none"}}>{name}</a>
        </Text>
        <Text as="div" size="2" color="gray">
        {tag}
        </Text>
      </Box>
    </Flex>
            </Card>
}