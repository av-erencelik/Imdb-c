import { usePagination } from "@ajna/pagination";

import { Container, Flex, Text } from "@chakra-ui/react";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { redirect, type LoaderArgs } from "@remix-run/server-runtime";

import { CardDiscover } from "~/components/common_components/CardDiscover";
import CommonPagination from "~/components/common_components/CommonPagination";
export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.get("page")) {
    url.searchParams.set("page", "1");
    return redirect(`/people/popular?${url.searchParams.toString()}`);
  }

  const popularPeopleResponse = await fetch(`
        https://api.themoviedb.org/3/person/popular?api_key=${process.env.API_KEY}&page=${url.searchParams.get(
    "page"
  )}`);
  const responseData = await popularPeopleResponse.json();
  return { data: responseData };
}
const PopularPeople = () => {
  const { data } = useLoaderData();
  const [searchParams] = useSearchParams();
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
    navigate(`/discover/people?${searchParams.toString()}`);
  };
  return (
    <Container maxW="container.xl" py="5">
      <Text as="h2" fontSize="2xl" fontWeight="bold" color="yellow.400" bg="blackAlpha.800" pl="4" borderRadius="md">
        Popular People
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
            {data.results.map((result: ResultPerson) => {
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

export default PopularPeople;
