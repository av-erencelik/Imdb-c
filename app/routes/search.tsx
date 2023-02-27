import { Container, Flex, Text } from "@chakra-ui/react";
import { redirect, type LoaderArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";

import { usePagination } from "@ajna/pagination";
import CommonPagination from "~/components/common_components/CommonPagination";
import { CardDiscover } from "~/components/common_components/CardDiscover";
export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const searchParam = url.searchParams.get("search");
  if (!searchParam) {
    throw json({ message: "there is no valid query to search" }, 501);
  }
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
  return { data: data, error: null };
}
const Search = () => {
  const { data } = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
      {data.total_pages != 1 && (
        <CommonPagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pages={pages}
        />
      )}

      <Flex
        gap={{ base: "10px", md: "27px" }}
        pt="3"
        wrap="wrap"
        justifyContent="flex-start"
        _after={{ content: '""', flex: "auto" }}
        mx="auto"
        px="5"
      >
        {data.results.map((result: ResultMovie | ResultPerson | ResultTvShow) => {
          return <CardDiscover result={result} key={result.id} />;
        })}
      </Flex>
      {data.results.length == 0 && (
        <Text fontSize="2xl" textAlign="center">
          No Result Found!
        </Text>
      )}
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

export default Search;
