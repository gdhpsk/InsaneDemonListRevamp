"use client";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Box, Card, Flex, Text, TextField } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  mainLevels: Array<any>;
  extendedLevels: Array<any>;
  legacyLevels: Array<any>;
  platformers: Array<any>;
  players: Array<any>;
  packs: Array<any>;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({
    mainLevels: [],
    extendedLevels: [],
    legacyLevels: [],
    platformers: [],
    players: [],
    packs: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults({
          mainLevels: [],
          extendedLevels: [],
          legacyLevels: [],
          platformers: [],
          players: [],
          packs: [],
        });
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        const mainLevels = data.levels.filter((l: any) => l.position <= 75);
        const extendedLevels = data.levels.filter(
          (l: any) => l.position > 75 && l.position <= 150,
        );
        const legacyLevels = data.levels.filter((l: any) => l.position > 150);
        setResults({
          mainLevels,
          extendedLevels,
          legacyLevels,
          platformers: data.platformers,
          players: data.players,
          packs: data.packs,
        });
        setIsOpen(true);
      } catch (error) {}
      setLoading(false);
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  const hasResults =
    results.mainLevels.length > 0 ||
    results.extendedLevels.length > 0 ||
    results.legacyLevels.length > 0 ||
    results.platformers.length > 0 ||
    results.players.length > 0 ||
    results.packs.length > 0;

  return (
    <div
      ref={searchRef}
      style={{
        position: "relative",
        width: "100%",
        minWidth: "250px",
        maxWidth: "100%",
      }}
    >
      <TextField.Root
        placeholder="Search levels, players, packs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() =>
          query.trim().length >= 2 && hasResults && setIsOpen(true)
        }
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>

      {isOpen && hasResults && (
        <Card
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "8px",
            maxHeight: "400px",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          <Box
            p="2"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {results.mainLevels.length > 0 && (
              <>
                <Text
                  size="2"
                  weight="bold"
                  style={{ opacity: 0.7, userSelect: "none" }}
                  className="no-glow"
                >
                  Main List Levels
                </Text>
                <Box mt="2" mb="3">
                  {results.mainLevels.map((level) => (
                    <Link
                      key={level.id}
                      href={`/level/${level.position}`}
                      style={{
                        textDecoration: "none",
                        display: "block",
                        overflow: "hidden",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Box
                        p="2"
                        className="search-result-item"
                        style={{ overflow: "hidden" }}
                      >
                        <Flex
                          justify="between"
                          align="center"
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              minWidth: 0,
                            }}
                          >
                            <Text size="2" weight="bold">
                              #{level.position} {level.name}
                            </Text>
                            <br />
                            <Text size="1" style={{ opacity: 0.7 }}>
                              by {level.publisher}
                            </Text>
                          </div>
                        </Flex>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </>
            )}

            {results.extendedLevels.length > 0 && (
              <>
                <Text
                  size="2"
                  weight="bold"
                  style={{ opacity: 0.7, userSelect: "none" }}
                  className="no-glow"
                >
                  Extended List Levels
                </Text>
                <Box mt="2" mb="3">
                  {results.extendedLevels.map((level) => (
                    <Link
                      key={level.id}
                      href={`/level/${level.position}`}
                      style={{
                        textDecoration: "none",
                        display: "block",
                        overflow: "hidden",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Box
                        p="2"
                        className="search-result-item"
                        style={{ overflow: "hidden" }}
                      >
                        <Flex
                          justify="between"
                          align="center"
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              minWidth: 0,
                            }}
                          >
                            <Text size="2" weight="bold">
                              #{level.position} {level.name}
                            </Text>
                            <br />
                            <Text size="1" style={{ opacity: 0.7 }}>
                              by {level.publisher}
                            </Text>
                          </div>
                        </Flex>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </>
            )}

            {results.legacyLevels.length > 0 && (
              <>
                <Text
                  size="2"
                  weight="bold"
                  style={{ opacity: 0.7, userSelect: "none" }}
                  className="no-glow"
                >
                  Legacy List Levels
                </Text>
                <Box mt="2" mb="3">
                  {results.legacyLevels.map((level) => (
                    <Link
                      key={level.id}
                      href={`/level/${level.position}`}
                      style={{
                        textDecoration: "none",
                        display: "block",
                        overflow: "hidden",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Box
                        p="2"
                        className="search-result-item"
                        style={{ overflow: "hidden" }}
                      >
                        <Flex
                          justify="between"
                          align="center"
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              minWidth: 0,
                            }}
                          >
                            <Text size="2" weight="bold">
                              #{level.position} {level.name}
                            </Text>
                            <br />
                            <Text size="1" style={{ opacity: 0.7 }}>
                              by {level.publisher}
                            </Text>
                          </div>
                        </Flex>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </>
            )}

            {results.platformers.length > 0 && (
              <>
                <Text
                  size="2"
                  weight="bold"
                  style={{ opacity: 0.7, userSelect: "none" }}
                  className="no-glow"
                >
                  Platformer Levels
                </Text>
                <Box mt="2" mb="3">
                  {results.platformers.map((platformer) => (
                    <Link
                      key={platformer.id}
                      href={`/platformer/${platformer.position}`}
                      style={{
                        textDecoration: "none",
                        display: "block",
                        overflow: "hidden",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Box
                        p="2"
                        className="search-result-item"
                        style={{ overflow: "hidden" }}
                      >
                        <Flex
                          justify="between"
                          align="center"
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              minWidth: 0,
                            }}
                          >
                            <Text size="2" weight="bold">
                              #{platformer.position} {platformer.name}
                            </Text>
                            <br />
                            <Text size="1" style={{ opacity: 0.7 }}>
                              by {platformer.publisher}
                            </Text>
                          </div>
                        </Flex>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </>
            )}

            {results.players.length > 0 && (
              <>
                <Text
                  size="2"
                  weight="bold"
                  style={{ opacity: 0.7, userSelect: "none" }}
                  className="no-glow"
                >
                  Players
                </Text>
                <Box mt="2" mb="3">
                  {results.players.map((player) => (
                    <Link
                      key={player.id}
                      href={`/player/${player.id}`}
                      style={{
                        textDecoration: "none",
                        display: "block",
                        overflow: "hidden",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Box
                        p="2"
                        className="search-result-item"
                        style={{ overflow: "hidden" }}
                      >
                        <Flex
                          justify="between"
                          align="center"
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              minWidth: 0,
                            }}
                          >
                            <Text size="2" weight="bold">
                              {player.name}
                            </Text>
                            <br />
                            <Text size="1" style={{ opacity: 0.7 }}>
                              {player.records.length} records
                            </Text>
                          </div>
                        </Flex>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </>
            )}

            {results.packs.length > 0 && (
              <>
                <Text
                  size="2"
                  weight="bold"
                  style={{ opacity: 0.7, userSelect: "none" }}
                  className="no-glow"
                >
                  Packs
                </Text>
                <Box mt="2">
                  {results.packs.map((pack) => (
                    <Link
                      key={pack.id}
                      href={`/packs?pack=${encodeURIComponent(pack.name)}`}
                      style={{
                        textDecoration: "none",
                        display: "block",
                        overflow: "hidden",
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Box
                        p="2"
                        className="search-result-item"
                        style={{ overflow: "hidden" }}
                      >
                        <Text size="2" weight="bold">
                          {pack.name}
                        </Text>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Card>
      )}

      {isOpen && !hasResults && !loading && query.trim().length >= 2 && (
        <Card
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "8px",
            zIndex: 1000,
          }}
        >
          <Box p="3">
            <Text size="2" style={{ opacity: 0.7 }}>
              No results found for {query}
            </Text>
          </Box>
        </Card>
      )}
    </div>
  );
}
