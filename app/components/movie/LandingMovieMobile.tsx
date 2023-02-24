import { StarIcon } from "@chakra-ui/icons";
import { Box, Flex, Image, Text, Tooltip } from "@chakra-ui/react";

import { CgFormatSlash } from "react-icons/cg";
import Genre from "../common_components/Genre";
import ReleaseDate from "../common_components/ReleaseDate";
import Runtime from "../common_components/Runtime";
import Title from "../common_components/Title";

const LandingMovieMobile = ({ movie }: { movie: any }) => {
  return (
    <Box bgColor={movie.colorRgb} p="5" display={{ base: "block", md: "none" }}>
      <Box color={movie.isLight ? "black" : "white"} alignItems="center" display="flex" flexDirection="column" gap="3">
        <Box>
          <Title title={movie.title} date={movie.release_date} textAlign={"center"} />
          <Flex alignItems="center" flexWrap="wrap" textAlign="center" justifyContent="center">
            <ReleaseDate date={movie.release_date} />
            <CgFormatSlash size="1.3em" />
            {movie.genres.map((genre: { id: string; name: string }, index: number) => {
              return <Genre genre={genre} index={index} key={genre.id} length={movie.genres.length} />;
            })}
            <CgFormatSlash size="1.3em" />
            <Runtime runtime={movie.runtime} />
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
    </Box>
  );
};

export default LandingMovieMobile;
