import { Box, Card, CardBody, Container, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ReleaseDate from "~/components/common_components/ReleaseDate";
import Title from "~/components/common_components/Title";
export async function loader({ params, request }: LoaderArgs) {
  const seasonNumber = params.seasonId;
  const url = new URL(request.url);
  const responseSeasonDetails = await fetch(
    `https://api.themoviedb.org/3/tv/${url.pathname.split("/")[2]}/season/${seasonNumber}?api_key=${
      process.env.API_KEY
    }&append_to_response=images`
  );
  const seasonDetails = await responseSeasonDetails.json();
  return json({ season: seasonDetails });
}
const Season = () => {
  const { season } = useLoaderData<typeof loader>();
  console.log(season);
  return (
    <Box as="main">
      <Box borderBottom="1px" borderColor="gray.200" bg="yellow.400">
        <Container maxW={"container.xl"} overflow="hidden" gap="5" alignItems="center" display="flex" py="5">
          <Image src={`https://image.tmdb.org/t/p/original${season.poster_path}`} h="250px" borderRadius="xl"></Image>
          <Box>
            <Title title={season.name} date={season.air_date} />
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
        </Container>
      </Box>
      <Container maxW="container.xl">
        <Flex flexDirection="column" gap={5} py="5">
          {season.episodes.map((episode: Episode) => {
            return (
              <Card direction={{ base: "column", sm: "row" }} key={episode.id} overflow="hidden" variant="outline">
                <Image
                  src={`https://image.tmdb.org/t/p/original${episode.still_path}`}
                  maxW={{ base: "100%", sm: "200px" }}
                  objectFit="cover"
                  loading="lazy"
                />
                <Stack>
                  <CardBody>
                    <Heading fontSize="xl" fontWeight="semibold" textAlign={{ base: "center", md: "inherit" }}>
                      {episode.episode_number} {episode.name}
                    </Heading>
                    <ReleaseDate date={episode.air_date} textAlign={{ base: "center", md: "inherit" }} />
                    <Text textAlign={{ base: "center", md: "inherit" }}>
                      <i>{episode.overview}</i>
                    </Text>
                  </CardBody>
                </Stack>
              </Card>
            );
          })}
        </Flex>
      </Container>
    </Box>
  );
};

export default Season;
