import { StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { json, type LoaderArgs, type Request } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { AiFillHeart } from "react-icons/ai";
import { CgFormatSlash } from "react-icons/cg";
import { MdWatchLater } from "react-icons/md";
import { getUserFromSession, postAddWatchList, postFavorite, rate } from "~/auth.server";
import MainStatefulButton from "~/components/buttons/MainStatefulButton";
import SimpleSlider from "~/components/MovieSlider";
import StarRating from "~/components/StarRating";
import VideoSlider from "~/components/VideoSlider";
import { returnNecessaryPeople } from "~/data.server";
var Vibrant = require("node-vibrant");
var tinycolor = require("tinycolor2");

export async function loader({ params, request }: LoaderArgs) {
  const id = params.tvShowId;
  const sessionId = await getUserFromSession(request as Request);
  const responseTvShowDetails = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.API_KEY}&session_id=${sessionId}&US&append_to_response=credits,videos,account_states,watch/providers`
  );
  const tvShowDetails = await responseTvShowDetails.json();
  await Vibrant.from(`https://image.tmdb.org/t/p/original${tvShowDetails.backdrop_path}`)
    .getPalette()
    .then(
      (palette: any) =>
        (tvShowDetails.colorRgb = `rgb(${palette.Vibrant._rgb[0]},${palette.Vibrant._rgb[1]}, ${palette.Vibrant._rgb[2]}, 0.8)`)
    );
  const color = tinycolor(tvShowDetails.colorRgb);
  const cast = returnNecessaryPeople(tvShowDetails.credits.cast);
  tvShowDetails.isLight = color.isLight();
  return json({ movie: tvShowDetails, cast });
}
export async function action({ request, params }: LoaderArgs) {
  const formData = await request.formData();
  const sessionId = await getUserFromSession(request as Request);
  if (!sessionId) {
    return json({ userError: "You must be logged in to perform this action" });
  }
  let status;
  if (formData.get("type") === "favorites") {
    status = await postFavorite({ request, params } as LoaderArgs, formData, sessionId);
  } else if (formData.get("type") === "watchlist") {
    status = await postAddWatchList({ request, params } as LoaderArgs, formData, sessionId);
  } else if (formData.get("type") === "rate") {
    status = await rate({ request, params } as LoaderArgs, formData, sessionId);
  }

  return json(status);
}
const TvShowDetails = () => {
  const { movie, cast } = useLoaderData<typeof loader>();
  console.log(movie);
  return (
    <Box as="main">
      <Box
        bgImage={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        h={{ base: "250px", md: "450px" }}
        backgroundPosition={"top"}
        backgroundSize="cover"
      >
        <Box bgColor={movie.colorRgb} p="5">
          <Container maxW="container.xl" zIndex="10" display="flex" gap="8">
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              objectFit="contain"
              h={{ base: "210px", md: "410px" }}
              borderRadius={"xl"}
            ></Image>
            <Box
              color={movie.isLight ? "black" : "white"}
              display={{ base: "none", md: "flex" }}
              justifyContent="center"
              flexDirection="column"
              gap="3"
            >
              <Box>
                <Text as="h2" fontSize="2xl">
                  <b>{movie.name}</b> ({new Date(movie.first_air_date).getFullYear()})
                </Text>
                <Flex alignItems="center">
                  <Text>
                    {new Date(movie.first_air_date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                  <CgFormatSlash size="1.3em" />
                  {movie.genres.map((genre: { id: string; name: string }, index: number) => {
                    return (
                      <div key={genre.id}>
                        <Link to={`/movies/${genre.name}`} className="remix-link">
                          {genre.name}
                        </Link>
                        {index !== movie.genres.length - 1 && <span style={{ marginRight: "5px" }}>{" - "}</span>}
                      </div>
                    );
                  })}
                  <CgFormatSlash size="1.3em" />
                  <Text>
                    {Math.floor(movie.episode_run_time[0] / 60)}h {movie.episode_run_time[0] % 60}m
                  </Text>
                  {movie.next_episode_to_air && (
                    <>
                      <CgFormatSlash size="1.3em" />
                      <Text>
                        Next Ep:{" "}
                        {new Date(movie.next_episode_to_air.air_date).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                    </>
                  )}
                </Flex>
              </Box>
              <Flex gap="5" alignItems="center">
                <Box
                  bgColor="blackAlpha.800"
                  color="yellow.400"
                  p="1"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  gap="1"
                  fontSize="2xl"
                  fontWeight="semibold"
                >
                  <StarIcon color="yellow.400" boxSize={5} />
                  {Number(movie.vote_average).toFixed(1)}
                </Box>

                <MainStatefulButton
                  added={movie.account_states ? movie.account_states.favorite : false}
                  Icon={AiFillHeart}
                  type="favorites"
                  label="Add to favorites"
                />
                <MainStatefulButton
                  added={movie.account_states ? movie.account_states.watchlist : false}
                  Icon={MdWatchLater}
                  type="watchlist"
                  label="Watch later"
                />

                <Menu>
                  <Tooltip label="Rate it" hasArrow openDelay={250} letterSpacing="wide">
                    <MenuButton
                      as={IconButton}
                      icon={<StarIcon />}
                      bg="blackAlpha.800"
                      size={"md"}
                      fontSize="15px"
                      color={movie.account_states?.rated ? "yellow.400" : "white"}
                      aria-label="fav"
                      borderRadius="full"
                      _hover={{ bg: "blackAlpha.700" }}
                      _active={{ bg: "blackAlpha.700" }}
                    ></MenuButton>
                  </Tooltip>
                  <MenuList minWidth={"150px"} bg="blackAlpha.800" border="none">
                    <StarRating isRated={movie.account_states?.rated ? movie.account_states.rated.value : 0} />
                  </MenuList>
                </Menu>
              </Flex>
              <Text fontStyle="italic" opacity="0.7" fontWeight="semibold" fontSize="xl">
                "{movie.tagline}"
              </Text>
              <Box>
                <Text fontSize="2xl" fontWeight="bold">
                  Overview
                </Text>
                <Text>{movie.overview}</Text>
              </Box>
              <Flex gap="3" w="50px">
                {movie["watch/providers"].results.US &&
                  movie["watch/providers"].results.US.flatrate &&
                  movie["watch/providers"].results.US.flatrate.map(
                    (provider: { logo_path: string; provider_name: string; provider_id: string }) => {
                      return (
                        <Tooltip key={provider.provider_id} label={provider.provider_name}>
                          <Image
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            borderRadius="xl"
                            cursor="pointer"
                          ></Image>
                        </Tooltip>
                      );
                    }
                  )}
              </Flex>
            </Box>
          </Container>
        </Box>
      </Box>
      <Box bgColor={movie.colorRgb} p="5" display={{ base: "block", md: "none" }}>
        <Box
          color={movie.isLight ? "black" : "white"}
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap="3"
        >
          <Box>
            <Text as="h2" fontSize="2xl" textAlign="center">
              <b>{movie.name}</b> ({new Date(movie.first_air_date).getFullYear()})
            </Text>
            <Flex alignItems="center" flexWrap="wrap" textAlign="center" justifyContent="center">
              <Text>
                {new Date(movie.first_air_date).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
              <CgFormatSlash size="1.3em" />
              {movie.genres.map((genre: { id: string; name: string }, index: number) => {
                return (
                  <div key={genre.id}>
                    <Link to={`/movies/${genre.name}`} className="remix-link">
                      {genre.name}
                    </Link>
                    {index !== movie.genres.length - 1 && <span style={{ marginRight: "5px" }}>{" - "}</span>}
                  </div>
                );
              })}
              <CgFormatSlash size="1.3em" />
              <Text>
                {Math.floor(movie.episode_run_time / 60)}h {movie.episode_run_time % 60}m
              </Text>
            </Flex>
          </Box>
          <Flex gap="5" alignItems="center">
            <Box
              bgColor="blackAlpha.800"
              color="yellow.400"
              p="1"
              borderRadius="md"
              display="flex"
              alignItems="center"
              gap="1"
              fontSize="2xl"
              fontWeight="semibold"
            >
              <StarIcon color="yellow.400" boxSize={5} />
              {Number(movie.vote_average).toFixed(1)}
            </Box>
          </Flex>
          <Text fontStyle="italic" opacity="0.7" fontWeight="semibold" fontSize="xl" textAlign="center">
            "{movie.tagline}"
          </Text>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              Overview
            </Text>
            <Text textAlign="center">{movie.overview}</Text>
          </Box>
          <Flex gap="3" flexWrap="wrap" flexDirection="row" justifyContent="center">
            {movie["watch/providers"].results.US &&
              movie["watch/providers"].results.US.flatrate &&
              movie["watch/providers"].results.US.flatrate.map(
                (provider: { logo_path: string; provider_name: string; provider_id: string }) => {
                  return (
                    <Tooltip key={provider.provider_id} label={provider.provider_name}>
                      <Image
                        src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                        borderRadius="xl"
                        cursor="pointer"
                        w="50px"
                      ></Image>
                    </Tooltip>
                  );
                }
              )}
          </Flex>
        </Box>
      </Box>
      <Container maxW="container.xl" mb="10">
        <SimpleSlider title="Cast" movies={cast} type="people" />
        <VideoSlider videos={movie.videos.results.filter((video: Video) => video.site !== "Youtube")} />
      </Container>
      <Flex
        display={{ base: "flex", md: "none" }}
        position="fixed"
        left="0"
        bottom="0"
        bg="blackAlpha.800"
        color="white"
        zIndex="100"
        w="full"
        justifyContent="space-around"
        px="5"
      >
        <MainStatefulButton
          added={movie.account_states ? movie.account_states.favorite : false}
          Icon={AiFillHeart}
          type="favorites"
          label="Add to favorites"
          bg="transparent"
        />
        <MainStatefulButton
          added={movie.account_states ? movie.account_states.watchlist : false}
          Icon={MdWatchLater}
          type="watchlist"
          label="Watch later"
          bg="transparent"
        />
        <Menu offset={[64, 4]}>
          <Tooltip label="Rate it" hasArrow openDelay={250} letterSpacing="wide">
            <MenuButton
              as={IconButton}
              icon={<StarIcon />}
              bg="transparent"
              size={"md"}
              fontSize="15px"
              color={movie.account_states?.rated ? "yellow.400" : "white"}
              aria-label="fav"
              borderRadius="full"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
            ></MenuButton>
          </Tooltip>
          <MenuList minWidth={"150px"} bg="blackAlpha.800" border="none">
            <StarRating isRated={movie.account_states?.rated ? movie.account_states.rated.value : 0} />
          </MenuList>
        </Menu>
      </Flex>
      <Container maxW="container.xl">
        <Tabs variant="line">
          <TabList flexWrap={"wrap"}>
            {movie.seasons.map((season: Season) => {
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
            {movie.seasons.map((season: Season) => {
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
    </Box>
  );
};

export default TvShowDetails;
