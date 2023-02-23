import { StarIcon } from "@chakra-ui/icons";
import { Box, Flex, Image, Text, Tooltip } from "@chakra-ui/react";

import { CgFormatSlash } from "react-icons/cg";

import Genre from "../common_components/Genre";
import ReleaseDate from "../common_components/ReleaseDate";
import Runtime from "../common_components/Runtime";
import Title from "../common_components/Title";

const LandingTvMobile = ({ movie }: { movie: any }) => {
  return (
    <Box bgColor={movie.colorRgb} p="5" display={{ base: "block", md: "none" }}>
      <Box color={movie.isLight ? "black" : "white"} alignItems="center" display="flex" flexDirection="column" gap="3">
        <Box>
          <Title title={movie.name} date={movie.first_air_date} textAlign={"center"} />
          <Flex alignItems="center" flexWrap="wrap" textAlign="center" justifyContent="center">
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
  );
};

export default LandingTvMobile;
