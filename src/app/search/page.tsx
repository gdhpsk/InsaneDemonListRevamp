"use client";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Box,
  Card,
  Flex,
  Grid,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchResult {
  levels: Array<any>;
  platformers: Array<any>;
  players: Array<any>;
  packs: Array<any>;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("all");
  const [results, setResults] = useState<SearchResult>({
    levels: [],
    platformers: [],
    players: [],
    packs: [],
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, type);
    }
  }, [initialQuery, type]);

  const performSearch = async (searchQuery: string, searchType: string) => {
    if (searchQuery.trim().length < 2) {
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`,
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, type);
  };

  const totalResults =
    results.levels.length +
    results.platformers.length +
    results.players.length +
    results.packs.length;

  return (
    <main>
      <br />
      <Grid style={{ placeItems: "center", padding: "0 10px" }}>
        <Flex
          gap="4"
          style={{
            placeItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <img
            src="/favicon.ico"
            height="70px"
            alt="Logo"
            style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }}
          />
          <Text
            size="9"
            className="header"
            style={{ display: "contents", fontSize: "clamp(2rem, 6vw, 3rem)" }}
          >
            Search
          </Text>
          <img
            src="/favicon.ico"
            height="70px"
            alt="Logo"
            style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }}
          />
        </Flex>
        <br />
        <Text
          size="5"
          className="header"
          style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)", padding: "0 10px" }}
        >
          Search for levels, players, and packs
        </Text>
        <br />
        <br />

        <form
          onSubmit={handleSearch}
          style={{ width: "100%", maxWidth: "600px", padding: "0 10px" }}
        >
          <Flex gap="3" align="end">
            <Box style={{ flex: 1 }}>
              <TextField.Root
                placeholder="Search levels, players, packs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                size="3"
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="18" width="18" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            <Select.Root value={type} onValueChange={setType}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="all">All</Select.Item>
                <Select.Item value="levels">Main List</Select.Item>
                <Select.Item value="platformers">Platformers</Select.Item>
                <Select.Item value="players">Players</Select.Item>
                <Select.Item value="packs">Packs</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </form>

        <br />
        <br />

        {loading && (
          <Text size="3" style={{ opacity: 0.7 }}>
            Searching...
          </Text>
        )}

        {!loading && searched && totalResults === 0 && (
          <Text size="3" style={{ opacity: 0.7 }}>
            No results found for {query}
          </Text>
        )}

        {!loading && searched && totalResults > 0 && (
          <Box style={{ width: "100%", maxWidth: "900px", padding: "0 10px" }}>
            <Text size="3" weight="bold" style={{ opacity: 0.7 }}>
              Found {totalResults} result{totalResults !== 1 ? "s" : ""}
            </Text>
            <br />
            <br />

            {results.levels.length > 0 && (
              <>
                <Text size="5" weight="bold">
                  Main List Levels ({results.levels.length})
                </Text>
                <br />
                <br />
                <Grid gap="3">
                  {results.levels.map((level) => (
                    <Link
                      key={level.id}
                      href={`/level/${level.position}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card style={{ cursor: "pointer" }} className="infoCard">
                        <Flex justify="between" align="center" wrap="wrap">
                          <div style={{ wordBreak: "break-word" }}>
                            <Text
                              size="4"
                              weight="bold"
                              style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}
                            >
                              #{level.position} {level.name}
                            </Text>
                            <br />
                            <Text
                              size="2"
                              style={{
                                opacity: 0.7,
                                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                              }}
                            >
                              by {level.publisher}
                            </Text>
                          </div>
                        </Flex>
                      </Card>
                    </Link>
                  ))}
                </Grid>
                <br />
                <br />
              </>
            )}

            {results.platformers.length > 0 && (
              <>
                <Text size="5" weight="bold">
                  Platformer Levels ({results.platformers.length})
                </Text>
                <br />
                <br />
                <Grid gap="3">
                  {results.platformers.map((platformer) => (
                    <Link
                      key={platformer.id}
                      href={`/platformer/${platformer.position}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card style={{ cursor: "pointer" }} className="infoCard">
                        <Flex justify="between" align="center" wrap="wrap">
                          <div style={{ wordBreak: "break-word" }}>
                            <Text
                              size="4"
                              weight="bold"
                              style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}
                            >
                              #{platformer.position} {platformer.name}
                            </Text>
                            <br />
                            <Text
                              size="2"
                              style={{
                                opacity: 0.7,
                                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                              }}
                            >
                              by {platformer.publisher}
                            </Text>
                          </div>
                        </Flex>
                      </Card>
                    </Link>
                  ))}
                </Grid>
                <br />
                <br />
              </>
            )}

            {results.players.length > 0 && (
              <>
                <Text size="5" weight="bold">
                  Players ({results.players.length})
                </Text>
                <br />
                <br />
                <Grid gap="3">
                  {results.players.map((player) => (
                    <Link
                      key={player.id}
                      href={`/player/${player.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card style={{ cursor: "pointer" }} className="infoCard">
                        <Flex justify="between" align="center" wrap="wrap">
                          <div style={{ wordBreak: "break-word" }}>
                            <Text
                              size="4"
                              weight="bold"
                              style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}
                            >
                              {player.name}
                            </Text>
                            <br />
                            <Text
                              size="2"
                              style={{
                                opacity: 0.7,
                                fontSize: "clamp(0.8rem, 2vw, 1rem)",
                              }}
                            >
                              {player.records.length} record
                              {player.records.length !== 1 ? "s" : ""}
                            </Text>
                          </div>
                        </Flex>
                      </Card>
                    </Link>
                  ))}
                </Grid>
                <br />
                <br />
              </>
            )}

            {results.packs.length > 0 && (
              <>
                <Text size="5" weight="bold">
                  Packs ({results.packs.length})
                </Text>
                <br />
                <br />
                <Grid gap="3">
                  {results.packs.map((pack) => (
                    <Link
                      key={pack.id}
                      href={`/packs?pack=${encodeURIComponent(pack.name)}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Card style={{ cursor: "pointer" }} className="infoCard">
                        <Text
                          size="4"
                          weight="bold"
                          style={{
                            fontSize: "clamp(1rem, 3vw, 1.25rem)",
                            wordBreak: "break-word",
                          }}
                        >
                          {pack.name}
                        </Text>
                      </Card>
                    </Link>
                  ))}
                </Grid>
                <br />
                <br />
              </>
            )}
          </Box>
        )}
      </Grid>
    </main>
  );
}
