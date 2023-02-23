import { StarIcon } from "@chakra-ui/icons";
import { Box, Container, Flex, IconButton, Image, Menu, MenuButton, MenuList, Text, Tooltip } from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { CgFormatSlash } from "react-icons/cg";
import { MdWatchLater } from "react-icons/md";
import MainStatefulButton from "../buttons/MainStatefulButton";
import Genre from "../common_components/Genre";
import ReleaseDate from "../common_components/ReleaseDate";
import Runtime from "../common_components/Runtime";
import Title from "../common_components/Title";
import StarRating from "../StarRating";

const LandingTvDesktop = ({ movie }: { movie: any }) => {
  return (
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
              <Title title={movie.name} date={movie.first_air_date} />
              <Flex alignItems="center">
                <ReleaseDate date={movie.first_air_date} />
                <CgFormatSlash size="1.3em" />
                {movie.genres.map((genre: { id: string; name: string }, index: number) => {
                  return <Genre genre={genre} index={index} key={genre.id} length={movie.genres.length} />;
                })}
                <CgFormatSlash size="1.3em" />
                <Runtime runtime={movie.episode_run_time} />
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
  );
};

export default LandingTvDesktop;
