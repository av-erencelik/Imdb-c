import { Box, Container, Flex, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";

const Seasons = ({ seasons }: { seasons: Season[] }) => {
  return (
    <Container maxW="container.xl">
      <Tabs variant="line">
        <TabList flexWrap={"wrap"}>
          {seasons.map((season: Season) => {
            if (season.season_number) {
              return (
                <Tab key={season.id} _selected={{ color: "yellow.400", borderColor: "yellow.400" }}>
                  {season.season_number}
                </Tab>
              );
            }
            return null;
          })}
        </TabList>
        <TabPanels>
          {seasons.map((season: Season) => {
            if (season.season_number) {
              return (
                <TabPanel key={season.id + season.name} px="0">
                  <Flex
                    borderRadius="xl"
                    overflow="hidden"
                    gap="5"
                    alignItems="center"
                    border="1px"
                    borderColor="gray.200"
                    pr="4"
                  >
                    <Image src={`https://image.tmdb.org/t/p/original${season.poster_path}`} h="200px"></Image>
                    <Box>
                      <Text fontWeight="bold" fontSize={{ base: "lg", md: "2xl" }} noOfLines={1}>
                        {season.name}
                      </Text>
                      <Text fontWeight="bold">
                        {new Date(season.air_date).getFullYear()} | {season.episode_count} Episodes
                      </Text>
                      {season.overview ? (
                        <Text noOfLines={5}>{season.overview}</Text>
                      ) : (
                        <Text>
                          This season aired on{" "}
                          {new Date(season.air_date).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                </TabPanel>
              );
            }
            return null;
          })}
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default Seasons;
