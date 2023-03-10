import { usePagination } from "@ajna/pagination";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Flex,
  Text,
} from "@chakra-ui/react";
import { Form, Link, useLoaderData, useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import { redirect, type LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { CardDiscover } from "~/components/common_components/CardDiscover";
import CommonPagination from "~/components/common_components/CommonPagination";
import GenreCheckbox from "~/components/form/GenreCheckbox";
import RatingSlider from "~/components/form/RatingSlider";
import ReleaseDateInputs from "~/components/form/ReleaseDateInputs";
import SortSelect from "~/components/form/SortSelect";
export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.get("page")) {
    url.searchParams.set("page", "1");
    return redirect(`/discover/tv?${url.searchParams.toString()}`);
  }
  if (url.searchParams.get("airing")) {
    const airingResponse = await fetch(
      `https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.API_KEY}&page=${url.searchParams.get(
        "page"
      )}&language=en-US`
    );
    const airing = await airingResponse.json();
    if (airing.status_code) throw json("Error", 404);
    return { data: airing };
  }
  if (!url.searchParams.get("sort_by")) {
    url.searchParams.set("sort_by", "popularity.desc");
    return redirect(`/discover/tv?${url.searchParams.toString()}`);
  }

  const discoverResponse = await fetch(`
      https://api.themoviedb.org/3/discover/tv?api_key=${process.env.API_KEY}&page=${url.searchParams.get(
    "page"
  )}&sort_by=${url.searchParams.get("sort_by")}&first_air_date.lte=${
    url.searchParams.get("first_air_date.lte") || ""
  }&first_air_date.gte=${url.searchParams.get("first_air_date.gte") || ""}&with_genres=${
    url.searchParams.getAll("genres").toString() || ""
  }&vote_average.gte=${url.searchParams.get("min") || "0"}&vote_average.lte=${url.searchParams.get("max") || "10"}${
    url.searchParams.get("sort_by") === "vote_average.desc" ? "&vote_count.gte=200" : ""
  }`);
  const genresResponse = await fetch(`
    https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.API_KEY}`);
  const genres = await genresResponse.json();
  const responseData = await discoverResponse.json();
  if (genres.status_code) throw json("Error", 404);
  if (responseData.status_code) throw json("Error", 404);
  return { data: responseData, genres: genres };
}
const DiscoverTv = () => {
  const { data, genres } = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: Number(data.total_pages) > 100 ? 100 : Number(data.total_pages),
    limits: {
      outer: 1,
      inner: 1,
    },
    initialState: { currentPage: Number(searchParams.get("page")) },
  });
  const handlePageChange = (nextPage: number): void => {
    setCurrentPage(nextPage);
    searchParams.set("page", `${nextPage}`);
    navigate(`/discover/tv?${searchParams.toString()}`);
  };
  return (
    <Container maxW="container.xl" py="5">
      <Text as="h2" fontSize="2xl" fontWeight="bold" color="yellow.400" bg="blackAlpha.800" pl="4" borderRadius="md">
        {searchParams.get("sort_by") === "vote_average.desc"
          ? "Top Rated"
          : searchParams.get("airing")
          ? "Currently Airing"
          : "Discover"}{" "}
        Tv Shows
      </Text>
      {data.total_pages != 1 && data.total_pages != 0 && (
        <CommonPagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pages={pages}
        />
      )}
      <Flex flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "center", md: "normal" }}>
        {!searchParams.get("airing") && (
          <Box py="3" w={{ base: "full", md: "initial" }}>
            <Accordion w={{ base: "full", md: "232px" }} allowToggle>
              <Form method="get">
                <AccordionItem w="full" border="1px" borderColor="gray.300" borderRadius="md">
                  <h2>
                    <AccordionButton>
                      <Box as="span" textAlign="left">
                        Sort
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <SortSelect
                      searchParams={searchParams}
                      dateAsc="first_air_date.asc"
                      dateDesc="first_air_date.desc"
                    />
                    <Flex>
                      <Link to="/discover/movie" style={{ width: "100%" }}>
                        <Button
                          type="submit"
                          w="full"
                          colorScheme="blackAlpha"
                          mt="20px"
                          borderEndRadius="0"
                          isDisabled={navigation.state !== "idle"}
                        >
                          Reset
                        </Button>
                      </Link>

                      <Button
                        type="submit"
                        w="full"
                        colorScheme="yellow"
                        mt="20px"
                        borderStartRadius="0"
                        isDisabled={navigation.state !== "idle"}
                      >
                        Sort
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem w="full" border="1px" borderColor="gray.300" borderRadius="md">
                  <h2>
                    <AccordionButton>
                      <Box as="span" textAlign="left">
                        Filter
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap="2"
                      py="1"
                      pb="2"
                      borderTop="1px"
                      borderColor="gray.300"
                    >
                      <Text color="gray.500">Release Dates</Text>
                      <ReleaseDateInputs
                        searchParams={searchParams}
                        lte={"first_air_date.lte"}
                        gte={"first_air_date.gte"}
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap="2"
                      py="1"
                      pb="2"
                      borderTop="1px"
                      borderColor="gray.300"
                    >
                      <Text color="gray.500">Genres</Text>
                      <Flex wrap="wrap" gap="5px" justifyContent="space-between">
                        {genres.genres.map((genre: { id: number; name: string }) => (
                          <GenreCheckbox key={genre.id} searchParams={searchParams} genre={genre} />
                        ))}
                      </Flex>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap="2"
                      py="1"
                      pb="2"
                      borderTop="1px"
                      borderColor="gray.300"
                    >
                      <Text color="gray.500">Rating</Text>
                      <RatingSlider searchParams={searchParams} />
                    </Box>

                    <Flex>
                      <Link to="/discover/movie" style={{ width: "100%" }}>
                        <Button
                          type="submit"
                          w="full"
                          colorScheme="blackAlpha"
                          mt="20px"
                          borderEndRadius="0"
                          isDisabled={navigation.state !== "idle"}
                        >
                          Reset
                        </Button>
                      </Link>

                      <Button
                        type="submit"
                        w="full"
                        colorScheme="yellow"
                        mt="20px"
                        borderStartRadius="0"
                        isDisabled={navigation.state !== "idle"}
                      >
                        Filter
                      </Button>
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              </Form>
            </Accordion>
          </Box>
        )}

        {data.results.length == 0 ? (
          <Text fontSize="2xl" textAlign="center" w="full" pt="3">
            No Result Found!
          </Text>
        ) : (
          <Flex
            gap={{ base: "10px", md: "27px" }}
            pt="3"
            wrap="wrap"
            justifyContent="flex-start"
            _after={{ content: '""', flex: "auto" }}
            mx={{ base: "auto", lg: "0" }}
            px={{ base: "0", md: "5px" }}
          >
            {data.results.map((result: ResultTvShow) => {
              return <CardDiscover result={result} key={result.id} />;
            })}
          </Flex>
        )}
      </Flex>

      {data.results.length === 20 && (
        <CommonPagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pages={pages}
        />
      )}
    </Container>
  );
};

export default DiscoverTv;
