import { StarIcon } from "@chakra-ui/icons";
import { Box, Container, Flex, Image, Text, IconButton, Tooltip, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { type LoaderArgs, json, type Request } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { CgFormatSlash } from "react-icons/cg";
import { getUserFromSession } from "~/auth.server";
import { AiFillHeart } from "react-icons/ai";
import { MdWatchLater } from "react-icons/md";
import StarRating from "~/components/StarRating";
import { returnNecessaryPeople } from "~/data.server";
import SimpleSlider from "~/components/MovieSlider";
import VideoSlider from "~/components/VideoSlider";
var Vibrant = require("node-vibrant");
var tinycolor = require("tinycolor2");

export async function loader({ params, request }: LoaderArgs) {
  const id = params.movieId;
  const sessionId = await getUserFromSession(request as Request);
  const responseMovieDetails = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.API_KEY}&session_id=${sessionId}&US&append_to_response=credits,videos,account_states,watch/providers`
  );
  const movieDetails = await responseMovieDetails.json();
  await Vibrant.from(`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`)
    .getPalette()
    .then(
      (palette: any) =>
        (movieDetails.colorRgb = `rgb(${palette.Vibrant._rgb[0]},${palette.Vibrant._rgb[1]}, ${palette.Vibrant._rgb[2]}, 0.8)`)
    );
  const color = tinycolor(movieDetails.colorRgb);
  const cast = returnNecessaryPeople(movieDetails.credits.cast);
  movieDetails.isLight = color.isLight();
  return json({ movie: movieDetails, cast });
}

const MovieDetails = () => {
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
                  <b>{movie.title}</b> ({new Date(movie.release_date).getFullYear()})
                </Text>
                <Flex alignItems="center">
                  <Text>
                    {new Date(movie.release_date).toLocaleString("en-US", {
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
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
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
                <Tooltip label="Add to favourites" hasArrow openDelay={250} letterSpacing="wide">
                  <IconButton
                    icon={<AiFillHeart />}
                    bg="blackAlpha.800"
                    size={"md"}
                    fontSize="15px"
                    color="white"
                    aria-label="fav"
                    borderRadius="full"
                    _hover={{ bg: "blackAlpha.700" }}
                  ></IconButton>
                </Tooltip>
                <Tooltip label="Watch Later" hasArrow openDelay={250} letterSpacing="wide">
                  <IconButton
                    icon={<MdWatchLater />}
                    bg="blackAlpha.800"
                    size={"md"}
                    fontSize="15px"
                    color="white"
                    aria-label="fav"
                    borderRadius="full"
                    _hover={{ bg: "blackAlpha.700" }}
                  ></IconButton>
                </Tooltip>

                <Menu>
                  <Tooltip label="Rate it" hasArrow openDelay={250} letterSpacing="wide">
                    <MenuButton
                      as={IconButton}
                      icon={<StarIcon />}
                      bg="blackAlpha.800"
                      size={"md"}
                      fontSize="15px"
                      color="white"
                      aria-label="fav"
                      borderRadius="full"
                      _hover={{ bg: "blackAlpha.700" }}
                      _active={{ bg: "blackAlpha.700" }}
                    ></MenuButton>
                  </Tooltip>
                  <MenuList minWidth={"150px"} bg="blackAlpha.800" border="none">
                    <StarRating />
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
              <Flex gap="3" w="50px" alignItems="flex-end">
                {movie["watch/providers"].results.US.flatrate &&
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
              <b>{movie.title}</b> ({new Date(movie.release_date).getFullYear()})
            </Text>
            <Flex alignItems="center" flexWrap="wrap" textAlign="center" justifyContent="center">
              <Text>
                {new Date(movie.release_date).toLocaleString("en-US", {
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
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
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
          <Flex gap="3" w="50px" alignItems="flex-end">
            {movie["watch/providers"].results.US.flatrate &&
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
      </Box>
      <Container maxW="container.xl" mb="10">
        <SimpleSlider title="Cast" movies={cast} type="people" />
        <VideoSlider videos={movie.videos.results.filter((video: Video) => video.site !== "Youtube")} />
      </Container>
    </Box>
  );
};

export default MovieDetails;
