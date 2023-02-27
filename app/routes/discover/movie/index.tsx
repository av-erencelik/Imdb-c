import { usePagination } from "@ajna/pagination";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Select,
  Text,
} from "@chakra-ui/react";
import { Form, Link, useLoaderData, useNavigate, useNavigation, useSearchParams } from "@remix-run/react";
import { redirect, type LoaderArgs } from "@remix-run/server-runtime";
import { useState } from "react";
import { CardDiscover } from "~/components/common_components/CardDiscover";
import CommonPagination from "~/components/common_components/CommonPagination";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.get("page")) {
    url.searchParams.set("page", "1");
    return redirect(`/discover/movie?${url.searchParams.toString()}`);
  }
  if (url.searchParams.get("upcoming")) {
    const upcomingResponse = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API_KEY}&page=${url.searchParams.get(
        "page"
      )}&region=us`
    );
    const upcoming = await upcomingResponse.json();
    return { data: upcoming };
  }
  if (!url.searchParams.get("sort_by")) {
    url.searchParams.set("sort_by", "popularity.desc");
    return redirect(`/discover/movie?${url.searchParams.toString()}`);
  }

  const discoverResponse = await fetch(`
    https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&page=${url.searchParams.get(
    "page"
  )}&sort_by=${url.searchParams.get("sort_by")}&primary_release_date.lte=${
    url.searchParams.get("primary_release_date.lte") || ""
  }&primary_release_date.gte=${url.searchParams.get("primary_release_date.gte") || ""}&with_genres=${
    url.searchParams.getAll("genres").toString() || ""
  }&vote_average.gte=${url.searchParams.get("min") || "0"}&vote_average.lte=${url.searchParams.get("max") || "10"}${
    url.searchParams.get("sort_by") === "vote_average.desc" || url.searchParams.get("sort_by") === "vote_average.desc"
      ? "&vote_count.gte=200"
      : ""
  }`);
  const genresResponse = await fetch(`
  https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY}`);
  const genres = await genresResponse.json();
  const responseData = await discoverResponse.json();
  return { data: responseData, genres: genres };
}

const DiscoverMovie = () => {
  const { data, genres } = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const navigate = useNavigate();
  console.log(data);
  const [selectedMaxDate, setSelectedMaxDate] = useState(new Date().toISOString().split("T")[0]);
  const [sliderRange, setSliderRange] = useState<number[]>([]);
  const [showMark, setShowMark] = useState(false);
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
    navigate(`/discover/movie?${searchParams.toString()}`);
  };
  return (
    <Container maxW="container.xl" py="5">
      <Text as="h2" fontSize="2xl" fontWeight="bold" color="yellow.400" bg="blackAlpha.800" pl="4" borderRadius="md">
        {searchParams.get("sort_by") === "vote_average.desc"
          ? "Top Rated"
          : searchParams.get("upcoming")
          ? "Upcoming"
          : "Discover"}{" "}
        Movies
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
        {!searchParams.get("upcoming") && (
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
                    <FormControl>
                      <Select
                        placeholder="Sort"
                        size="sm"
                        name="sort_by"
                        focusBorderColor="yellow.400"
                        borderColor={"yellow.400"}
                        borderRadius="5px"
                        defaultValue={searchParams.get("sort_by") || ""}
                      >
                        <option value="popularity.desc">Popularity Descending</option>
                        <option value="popularity.asc">Popularity Ascending</option>
                        <option value="primary_release_date.desc">Release Date Descending</option>
                        <option value="primary_release_date.asc">Release Date Ascending</option>
                        <option value="vote_average.desc">Rating Descending</option>
                        <option value="vote_average.asc">Rating Ascending</option>
                      </Select>
                    </FormControl>
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
                      <FormControl>
                        <InputGroup display="flex" alignItems="center" justifyContent="space-between">
                          <FormLabel htmlFor="primary_release_date.gte" m="0" mr="1">
                            from:
                          </FormLabel>
                          <Input
                            type="date"
                            name="primary_release_date.gte"
                            id="primary_release_date.gte"
                            focusBorderColor="yellow.400"
                            borderColor={"yellow.400"}
                            size="sm"
                            fontSize="sm"
                            borderRadius="5px"
                            w="125px"
                            defaultValue={searchParams.get("primary_release_date.gte") || ""}
                            max={new Date(selectedMaxDate).toISOString().split("T")[0]}
                            _hover={{ borderColor: "yellow.400" }}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl>
                        <InputGroup display="flex" alignItems="center" justifyContent="space-between">
                          <FormLabel htmlFor="primary_release_date.lte" m="0" mr="1">
                            to:
                          </FormLabel>
                          <Input
                            type="date"
                            name="primary_release_date.lte"
                            id="primary_release_date.lte"
                            focusBorderColor="yellow.400"
                            borderColor={"yellow.400"}
                            size="sm"
                            fontSize="sm"
                            w="125px"
                            borderRadius="5px"
                            defaultValue={new Date().toISOString().split("T")[0]}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setSelectedMaxDate(e.target.value)}
                            _hover={{ borderColor: "yellow.400" }}
                          />
                        </InputGroup>
                      </FormControl>
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
                          <Checkbox
                            key={genre.id}
                            value={genre.id}
                            colorScheme="yellow"
                            name="genres"
                            sx={{ color: "gray.400", "input:checked ~ span": { color: "blackAlpha.800" } }}
                            size="sm"
                            flex="47%"
                            defaultChecked={searchParams.getAll("genres").includes(`${genre.id}`)}
                          >
                            {genre.name}
                          </Checkbox>
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
                      <RangeSlider
                        // eslint-disable-next-line jsx-a11y/aria-proptypes
                        aria-label={["min", "max"]}
                        defaultValue={[Number(searchParams.get("min")) || 0, Number(searchParams.get("max")) || 10]}
                        max={10}
                        min={0}
                        name={["min", "max"]}
                        onChange={(val) => {
                          setShowMark(true);
                          setSliderRange(val);
                        }}
                        onChangeEnd={() => {
                          setTimeout(() => {
                            setShowMark(false);
                          }, 1000);
                        }}
                      >
                        <RangeSliderTrack bg="yellow.200">
                          <RangeSliderFilledTrack bg="yellow.400" />
                        </RangeSliderTrack>
                        {showMark && (
                          <RangeSliderMark
                            value={2}
                            textAlign="center"
                            bg="yellow.400"
                            color="blackAlpha.800"
                            mt="5px"
                            w="100px"
                            borderRadius="md"
                          >
                            Rated {sliderRange[0]} - {sliderRange[1]}
                          </RangeSliderMark>
                        )}

                        <RangeSliderThumb index={0} bg="blackAlpha.800" />
                        <RangeSliderThumb index={1} bg="blackAlpha.800" />
                      </RangeSlider>
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
            {data.results.map((result: ResultMovie) => {
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

export default DiscoverMovie;
