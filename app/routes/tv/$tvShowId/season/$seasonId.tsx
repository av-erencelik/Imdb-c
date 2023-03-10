import { Box, Card, CardBody, Container, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { type MetaFunction } from "@remix-run/react/dist/routeModules";
import ReleaseDate from "~/components/common_components/ReleaseDate";
import Title from "~/components/common_components/Title";
import fallbackImg from "../../../../../public/fallback.jpg";
import fallbackPng from "../../../../../public/fallback.png";
export async function loader({ params, request }: LoaderArgs) {
  const seasonNumber = params.seasonId;
  const url = new URL(request.url);
  try {
    const responseSeasonDetails = await fetch(
      `https://api.themoviedb.org/3/tv/${url.pathname.split("/")[2]}/season/${seasonNumber}?api_key=${
        process.env.API_KEY
      }&append_to_response=images`
    );
    const seasonDetails = await responseSeasonDetails.json();
    if (seasonDetails.status_code) {
      throw json("error");
    }
    return json({ season: seasonDetails });
  } catch (e) {
    throw json("Error", { status: 404 });
  }
}
const Season = () => {
  const { season } = useLoaderData<typeof loader>();
  return (
    <Box as="main">
      <Box borderBottom="1px" borderColor="gray.200" bg="yellow.400">
        <Container maxW={"container.xl"} overflow="hidden" gap="5" alignItems="center" display="flex" py="5">
          <Image
            src={`https://image.tmdb.org/t/p/original${season.poster_path}`}
            h="250px"
            borderRadius="xl"
            fallbackSrc={fallbackImg}
          ></Image>
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
                  fallbackSrc={fallbackPng}
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
export const meta: MetaFunction = ({ data }) => {
  return {
    title: data ? `${data.season.name}` : "Error",
  };
};
export default Season;
