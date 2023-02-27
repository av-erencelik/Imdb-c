import { Box, Card, CardBody, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import fallbackImg from "../../../public/fallback.jpg";
import defaultPP from "../../../public/default.jpg";
import { StarIcon } from "@chakra-ui/icons";

export const CardDiscover = ({ result }: { result: ResultMovie | ResultPerson | ResultTvShow }) => {
  return (
    <Card
      overflow="hidden"
      cursor="pointer"
      w={{ base: "100%", md: "220px" }}
      direction={{ base: "row", md: "column" }}
      variant="outline"
    >
      <Link to={`/${result.media_type === "person" ? "people" : result.media_type}/${result.id}`}>
        <div style={{ overflow: "hidden" }}>
          <Image
            objectFit="cover"
            src={`https://image.tmdb.org/t/p/original${
              "profile_path" in result ? result.profile_path : result.poster_path
            }`}
            w={{ base: "100px", md: "220px" }}
            h={{ base: "100px", md: "275px" }}
            maxW="initial"
            fallbackSrc={"profile_path" in result ? defaultPP : fallbackImg}
            className="hover"
          ></Image>
        </div>
      </Link>
      <Stack my={{ base: "auto", md: "0" }} wrap="wrap">
        <CardBody p="2" display="flex" flexDirection={{ base: "column-reverse", md: "column" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" gap="20px">
            {"vote_average" in result ? (
              <>
                <Flex gap="5px" alignItems="center">
                  <StarIcon color="yellow.400" boxSize={3} />
                  <Text fontWeight="semibold" fontSize="md" color="yellow.400">
                    {Number(result.vote_average).toFixed(1)}
                  </Text>
                </Flex>
                <Text fontSize="sm" color="gray.400">
                  {new Date("release_date" in result ? result.release_date : result.first_air_date).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </Text>
              </>
            ) : null}
          </Box>

          {"known_for_department" in result ? (
            <Text fontSize="sm" color="gray.400">
              {result.known_for_department}
            </Text>
          ) : null}

          <Text noOfLines={2} fontWeight="semibold" fontSize="medium">
            {"title" in result ? result.title : result.name}
          </Text>
        </CardBody>
      </Stack>
    </Card>
  );
};
