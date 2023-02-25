import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@chakra-ui/icons";
import { Box, Card, CardBody, CardFooter, Container, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { redirect, type LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import fallbackImg from "../../public/fallback.jpg";
import defaultPP from "../../public/default.jpg";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
export async function loader({ params, request }: LoaderArgs) {
  const url = new URL(request.url);
  const searchParam = url.searchParams.get("search");
  if (!url.searchParams.get("page")) {
    url.searchParams.set("page", "1");
    return redirect(`/search?${url.searchParams.toString()}`);
  }
  const searchResponse = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${
      process.env.API_KEY
    }&query=${searchParam}&page=${url.searchParams.get("page")}`
  );
  const data = await searchResponse.json();
  return { data: data };
}
const Search = () => {
  const { data } = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  console.log(data);
  const { currentPage, setCurrentPage, pagesCount, pages } = usePagination({
    pagesCount: Number(data.total_pages),
    limits: {
      outer: 1,
      inner: 1,
    },
    initialState: { currentPage: Number(searchParams.get("page")) },
  });
  const handlePageChange = (nextPage: number): void => {
    setCurrentPage(nextPage);
    searchParams.set("page", `${nextPage}`);
    navigate(`/search?${searchParams.toString()}`);
  };
  return (
    <Container maxW="container.xl" py="5">
      <Text as="h2" fontSize="2xl" fontWeight="bold" color="yellow.400" bg="blackAlpha.800" pl="4" borderRadius="md">
        Results For "{searchParams.get("search")}"
      </Text>
      <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChange}>
        <PaginationContainer w="full" justifyContent={"center"} pt="3" mt="auto" gap={1}>
          <PaginationPrevious colorScheme="yellow" p="0">
            <ChevronLeftIcon />
          </PaginationPrevious>
          <PaginationPageGroup justifyContent="center">
            {pages.map((page: number) => (
              <PaginationPage
                key={`pagination_page_${page}`}
                page={page}
                w={5}
                colorScheme="gray"
                bg="transparent"
                fontSize="sm"
                color="blackAlpha.800"
                _hover={{
                  bg: "yellow.400",
                  color: "blackAlpha.800",
                }}
                _current={{
                  w: 10,
                  bg: "yellow.400",
                  fontSize: "sm",
                  color: "blackAlpha.800",
                }}
              />
            ))}
          </PaginationPageGroup>
          <Link to={`?${searchParams.toString()}`}>
            <PaginationNext colorScheme="yellow" p="0">
              <ChevronRightIcon />
            </PaginationNext>
          </Link>
        </PaginationContainer>
      </Pagination>
      <Flex
        gap="27px"
        pt="3"
        wrap="wrap"
        justifyContent="flex-start"
        _after={{ content: '""', flex: "auto" }}
        mx="auto"
        px="5"
      >
        {data.results.map((result: ResultMovie | ResultPerson | ResultTvShow) => {
          return (
            <Card
              key={result.id}
              overflow="hidden"
              cursor="pointer"
              w={{ base: "100%", md: "220px" }}
              direction={{ base: "row", md: "column" }}
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
                    fallbackSrc={"profile_path" in result ? defaultPP : fallbackImg}
                    className="hover"
                  ></Image>
                </div>
              </Link>
              <Stack my="auto">
                <CardBody p="2" display="block">
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
                </CardBody>
              </Stack>
            </Card>
          );
        })}
      </Flex>
      {data.results.length == 0 && (
        <Text fontSize="2xl" textAlign="center">
          No Result Found!
        </Text>
      )}
      {data.results.length === 20 && (
        <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChange}>
          <PaginationContainer w="full" justifyContent={"center"} pt="3" mt="auto" gap={1}>
            <PaginationPrevious colorScheme="yellow" p="0">
              <ChevronLeftIcon />
            </PaginationPrevious>
            <PaginationPageGroup justifyContent="center">
              {pages.map((page: number) => (
                <PaginationPage
                  key={`pagination_page_${page}`}
                  page={page}
                  w={5}
                  colorScheme="gray"
                  bg="transparent"
                  fontSize="sm"
                  color="blackAlpha.800"
                  _hover={{
                    bg: "yellow.400",
                    color: "blackAlpha.800",
                  }}
                  _current={{
                    w: 10,
                    bg: "yellow.400",
                    fontSize: "sm",
                    color: "blackAlpha.800",
                  }}
                />
              ))}
            </PaginationPageGroup>
            <Link to={`?${searchParams.toString()}`}>
              <PaginationNext colorScheme="yellow" p="0">
                <ChevronRightIcon />
              </PaginationNext>
            </Link>
          </PaginationContainer>
        </Pagination>
      )}
    </Container>
  );
};

export default Search;
