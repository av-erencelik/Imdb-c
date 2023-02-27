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
  }&vote_average.gte=${url.searchParams.get("min") || "0"}&vote_average.lte=${url.searchParams.get("max") || "10"}`);
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
        Discover Movies
      </Text>
      {data.total_pages != 1 && (
        <CommonPagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pages={pages}
        />
      )}
      <Flex>
        <Box py="3">
          <Accordion w="232px" allowToggle>
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
                <Form method="get">
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
                          isChecked={searchParams.getAll("genres").includes(`${genre.id}`)}
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
                </Form>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        <Flex
          gap={{ base: "10px", md: "27px" }}
          pt="3"
          wrap="wrap"
          justifyContent="flex-start"
          _after={{ content: '""', flex: "auto" }}
          mx={{ base: "auto", lg: "0" }}
          px="5"
        >
          {data.results.map((result: ResultMovie) => {
            return <CardDiscover result={result} key={result.id} />;
          })}
        </Flex>
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