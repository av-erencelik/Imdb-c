import { Box, Card, CardBody, Container, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { getUserFromSession } from "~/auth.server";
import { type LoaderArgs, type Request, json } from "@remix-run/node";
import fallbackImg from "../../../../public/fallback.jpg";
import { Link, NavLink, useLoaderData } from "@remix-run/react";
import { DeleteIcon, StarIcon } from "@chakra-ui/icons";

import { type IconType } from "react-icons/lib";
import DeleteButton from "~/components/buttons/DeleteButton";
export async function loader({ request }: { request: Request }) {
  try {
    const sessionId = await getUserFromSession(request);
    const watchlistResponse = await fetch(`
    https://api.themoviedb.org/3/account/a/watchlist/movies?api_key=${process.env.API_KEY}&session_id=${sessionId}&sort_by=created_at.desc&page=1`);
    const watchlist = await watchlistResponse.json();
    if (watchlist.status_code) throw json("error");
    return { watchlist };
  } catch (e) {
    throw json("Error", { status: 404 });
  }
}
export async function action({ request }: LoaderArgs) {
  const formData = await request.formData();
  const sessionId = await getUserFromSession(request as Request);
  const response = await fetch(
    `https://api.themoviedb.org/3/account/1/watchlist?api_key=${process.env.API_KEY}&session_id=${sessionId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: formData.get("id"),
        watchlist: false,
      }),
    }
  );
  const status = await response.json();
  return { status };
}
const Watchlist = () => {
  const { watchlist } = useLoaderData();

  return (
    <Container maxW="container.xl" py="3">
      <Text as="h2" fontSize="2xl" fontWeight="bold" color="yellow.400" bg="blackAlpha.800" pl="4" borderRadius="md">
        My Watchlist
      </Text>
      <Flex gap="3" pl="4" py="2">
        <NavLink
          to="/profile/watchlist/movie"
          style={({ isActive }) => (isActive ? { borderBottom: "3px solid", borderBottomColor: "#ecc94b" } : undefined)}
        >
          Movie
        </NavLink>
        <NavLink
          to="/profile/watchlist/tv"
          style={({ isActive }) => (isActive ? { borderBottom: "3px solid", borderBottomColor: "#ecc94b" } : undefined)}
        >
          Tv Show
        </NavLink>
      </Flex>
      <Flex flexDirection="column" gap="3">
        {watchlist.results.map((result: ResultMovie) => {
          return (
            <Card
              key={result.id}
              overflow="hidden"
              cursor="pointer"
              w={{ base: "100%" }}
              direction={{ base: "row" }}
              variant="outline"
              alignItems="center"
              pr="3"
            >
              <Link to={`/movie/${result.id}`}>
                <div style={{ overflow: "hidden" }}>
                  <Image
                    objectFit="cover"
                    src={`https://image.tmdb.org/t/p/original${result.poster_path}`}
                    w={{ base: "100px", md: "150px" }}
                    h={{ base: "100px", md: "185px" }}
                    maxW="initial"
                    fallbackSrc={fallbackImg}
                    className="hover"
                  ></Image>
                </div>
              </Link>
              <Stack my={{ base: "auto" }} wrap="wrap" pl="3" w="full">
                <CardBody p="2" display="flex" flexDirection={{ base: "column" }}>
                  <Link to={`/movie/${result.id}`} className="remix-link">
                    <Text noOfLines={2} fontWeight="semibold" fontSize="medium">
                      {result.title}
                    </Text>
                  </Link>
                  <Box display="flex" alignItems="center" gap="10px">
                    <Flex gap="5px" alignItems="center">
                      <StarIcon color="yellow.400" boxSize={3} />
                      <Text fontWeight="semibold" fontSize="md" color="yellow.400">
                        {Number(result.vote_average).toFixed(1)}
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color="gray.400">
                      {new Date(result.release_date).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </Box>
                  <Text fontSize="sm" display={{ base: "none", md: "block" }}>
                    {result.overview}
                  </Text>
                </CardBody>
              </Stack>
              <DeleteButton id={result.id} label="delete" Icon={DeleteIcon as IconType} />
            </Card>
          );
        })}
      </Flex>
    </Container>
  );
};

export default Watchlist;
