import { StarIcon } from "@chakra-ui/icons";
import { Box, Card, CardBody, CardFooter, Container, Flex, Grid, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import fallbackImg from "../../public/fallback.jpg";
import defaultPP from "../../public/default.jpg";
export async function loader({ params, request }: LoaderArgs) {
  const url = new URL(request.url);
  const searchParam = url.searchParams.get("search");
  const searchResponse = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_KEY}&query=${searchParam}&page=1`
  );
  const data = await searchResponse.json();
  return { data: data };
}
const Search = () => {
  const { data } = useLoaderData();
  const [searchParams] = useSearchParams();
  console.log(data);
  return (
    <Container maxW="container.xl" py="5">
      <Text as="h2" fontSize="2xl" fontWeight="bold" color="yellow.400" bg="blackAlpha.800" pl="4" borderRadius="md">
        Results For "{searchParams.get("search")}"
      </Text>

      <Flex gap="27px" pt="3" wrap="wrap" justifyContent="flex-start" _after={{ content: '""', flex: "auto" }}>
        {data.results.map((result: ResultMovie | ResultPerson | ResultTvShow) => {
          return (
            <Card key={result.id} overflow="hidden" cursor="pointer" w="185px">
              <Link to={`/${result.media_type === "person" ? "people" : result.media_type}/${result.id}`}>
                <CardBody p="0" overflow="hidden">
                  <Image
                    objectFit="cover"
                    src={`https://image.tmdb.org/t/p/original${
                      "profile_path" in result ? result.profile_path : result.poster_path
                    }`}
                    w="100%"
                    h="275px"
                    fallbackSrc={"profile_path" in result ? defaultPP : fallbackImg}
                    className="hover"
                  ></Image>
                </CardBody>
                <CardFooter p="2" display="block">
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
                          {new Date(
                            "release_date" in result ? result.release_date : result.first_air_date
                          ).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
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
                </CardFooter>
              </Link>
            </Card>
          );
        })}
      </Flex>
      {data.total_results == 0 && (
        <Text fontSize="2xl" textAlign="center">
          No Result Found!
        </Text>
      )}
    </Container>
  );
};

export default Search;
