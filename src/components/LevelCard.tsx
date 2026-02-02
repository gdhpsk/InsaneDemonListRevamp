"use client";
import styles from "../app/levelcard.module.css";
import {
  Card,
  Flex,
  Box,
  Text,
  ContextMenu,
  Inset,
  Badge,
  IconButton,
  HoverCard,
} from "@radix-ui/themes";
import points from "../functions/points";
import { calc_points_plat } from "../functions/points";
import hexToRGB from "../functions/hexToRGB";
import {
  DotFilledIcon,
  DotsHorizontalIcon,
  SpeakerLoudIcon,
} from "@radix-ui/react-icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

interface info {
  level: Record<any, any>;
  platformer?: boolean;
  removeTn?: boolean;
}

export default function InfoCard({ level, removeTn, platformer }: info) {
  dayjs.extend(utc);
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className={styles.levelCard}>
        <Card
          style={{
            marginTop: "15px",
            width: "min(100%, 1650px)",
            backgroundColor: `${level.weekly?.date > Date.now() - 604_800_000 ? "rgba(53, 53, 99, 0.5)" : ""}`,
          }}
          variant="surface"
          onClick={() => {
            window.location.href = `/${platformer ? "platformer" : "level"}/${level.position}`;
          }}
        >
          <Flex gap="5" wrap="wrap">
            <Inset
              side="left"
              clip="padding-box"
              style={{
                overflow: "visible",
                display: removeTn ? "none" : "block",
                minWidth: "200px",
                maxWidth: "320px",
              }}
            >
              <a
                className="bright"
                href={`https://youtu.be/${level.ytcode}`}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={`https://i.ytimg.com/vi/${level.ytcode}/mqdefault.jpg`}
                  className={styles.ytImage}
                  style={{ height: "auto", width: "100%", maxWidth: "320px" }}
                />
              </a>
            </Inset>
            <Box p={"3"} style={{ flex: "1", minWidth: "250px" }}>
              <Text
                as="p"
                size="8"
                weight="bold"
                style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)" }}
              >
                <a
                  href={`https://youtu.be/${level.ytcode}`}
                  target="_blank"
                  className="bright"
                  style={{ textDecoration: "none", wordBreak: "break-word" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {level.position}. {level.name} by {level.publisher}
                </a>
              </Text>
              <Text
                as="p"
                size="5"
                weight="bold"
                style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)" }}
              >
                {platformer
                  ? calc_points_plat(level.position)
                  : points(level.position)}{" "}
                points
              </Text>
              <br></br>
              <Flex gap="3" style={{ maxWidth: "100%" }} wrap="wrap">
                {level.packs.length
                  ? level.packs
                      .sort((a: any, b: any) => a.position - b.positon)
                      .map((e: any) => {
                        let rgb = hexToRGB(e.color);
                        return (
                          <Badge
                            style={{
                              backgroundColor: `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, 0.5)`,
                              color: "white",
                              fontSize: "20px",
                              padding: "10px",
                              paddingRight: "17px",
                              borderRadius: "20px",
                            }}
                            key={e.name}
                          >
                            <DotFilledIcon></DotFilledIcon>
                            {e.name}
                          </Badge>
                        );
                      })
                  : ""}
              </Flex>
              <br></br>
              <Text
                size="4"
                weight={"bold"}
                style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.25rem)" }}
              >
                Weekly:{" "}
                {level.weekly
                  ? `${dayjs(level.weekly.date).utc(false).format("MMM D, YYYY")} - ${dayjs(
                      level.weekly.date + 604_800_000,
                    )
                      .utc(false)
                      .format("MMM D, YYYY")}`
                  : "never"}
              </Text>
            </Box>
          </Flex>
          <IconButton
            style={{
              position: "absolute",
              right: "5px",
              top: "5px",
              zIndex: 10,
            }}
            radius="full"
            color="teal"
            size="2"
            onClick={(e) => {
              e.stopPropagation();
              e.target.dispatchEvent(
                new MouseEvent("ContextMenu.", {
                  bubbles: true,
                  clientX: e.currentTarget.getBoundingClientRect().x - 150,
                  clientY: e.currentTarget.getBoundingClientRect().y + 50,
                }),
              );
            }}
          >
            <DotsHorizontalIcon></DotsHorizontalIcon>
          </IconButton>
          <Box
            style={{
              position: "absolute",
              right: "5px",
              bottom: "5px",
              zIndex: 10,
            }}
          >
            <HoverCard.Root>
              <HoverCard.Trigger onClick={(e) => e.stopPropagation()}>
                <IconButton radius="full" color="teal" size="2" disabled>
                  <SpeakerLoudIcon></SpeakerLoudIcon>
                </IconButton>
              </HoverCard.Trigger>
              <HoverCard.Content>
                <Text size="3">This feature is still in the works!</Text>
              </HoverCard.Content>
            </HoverCard.Root>
          </Box>
        </Card>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item disabled>
          <Flex align={"center"} gap="2">
            <img src="/song.png" height="20px"></img>Copy Song Link
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item
          onClick={() =>
            navigator.clipboard.writeText(`https://youtu.be/${level.ytcode}`)
          }
        >
          <Flex align={"center"} gap="2">
            <img src="/youtube.svg" height="20px"></img>Copy Video Link
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item
          onClick={() => {
            navigator.clipboard.writeText(
              Object.entries(level)
                .filter((e) => e[1] && e[0] != "id")
                .map((e) => {
                  if (e[0] == "ytcode") {
                    e[0] = "link";
                    e[1] = `https://youtu.be/${e[1]}`;
                  }
                  if (e[0] == "packs") {
                    e[1] = e[1].length
                      ? e[1].map((x: any) => x.name).join(", ")
                      : "none";
                  }
                  return `${e[0]}: ${e[1]}`;
                })
                .join("\n"),
            );
          }}
        >
          <Flex align={"center"} gap="2">
            <img src="/text.png" height="20px"></img>Copy Text Format
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Separator></ContextMenu.Separator>
        <ContextMenu.Item
          onClick={() =>
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_URL}/${platformer ? "platformer" : "level"}/${level.id}`,
            )
          }
        >
          <Flex align={"center"} gap="2">
            <img src="/mongo.png" height="20px"></img>Copy Exact Level URL
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item
          onClick={() => navigator.clipboard.writeText(level.id)}
        >
          <Flex align={"center"} gap="2">
            <img src="/mongo.png" height="20px"></img>Copy Object ID
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item
          onClick={() => navigator.clipboard.writeText(JSON.stringify(level))}
        >
          <Flex align={"center"} gap="2">
            <img src="/json.png" height="20px"></img>Copy Level JSON
          </Flex>
        </ContextMenu.Item>
        <ContextMenu.Item
          onClick={async () => {
            let req = await fetch(
              `/api/${platformer ? "platformer" : "level"}/${level.id}`,
            );
            let full = await req.text();
            navigator.clipboard.writeText(full);
          }}
        >
          <Flex align={"center"} gap="2">
            <img src="/json.png" height="20px"></img>Copy Full Level JSON
          </Flex>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
