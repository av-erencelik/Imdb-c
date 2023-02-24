import { Box, Card, CardBody, Container, Image, Stack, Text } from "@chakra-ui/react";
import { type LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import BioTruncate from "~/components/BioTruncate";
import ReleaseDate from "../../components/common_components/ReleaseDate";
import { useEffect, useState } from "react";
import { MetaFunction } from "@remix-run/react/dist/routeModules";

export async function loader({ params, request }: LoaderArgs) {
  const id = params.peopleId;
  const responsePeopleDetails = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.API_KEY}&language=en-US&append_to_response=combined_credits`
  );
  const peopleDetails = await responsePeopleDetails.json();
  return json({ people: peopleDetails });
}
function compare(a: any, b: any) {
  return (
    new Date(b.release_date ? b.release_date : b.first_air_date).getTime() -
    new Date(a.release_date ? a.release_date : a.first_air_date).getTime()
  );
}
function returnSortedNonNullArray(array: any) {
  return array.combined_credits.cast.filter((e: any) => e.release_date !== "" && e.first_air_date !== "").sort(compare);
}
function returnNullArray(array: any) {
  return array.combined_credits.cast.filter((e: any) => e.release_date === "" || e.first_air_date === "");
}
const PeopleDetails = () => {
  const { people } = useLoaderData<typeof loader>();
  const [sortedNonNullArray, setSortedNonNullArray] = useState([]);
  const [nullArray, setNullArray] = useState([]);
  useEffect(() => {
    setSortedNonNullArray(returnSortedNonNullArray(people));
    setNullArray(returnNullArray(people));
  }, []);
  console.log(people);
  console.log(sortedNonNullArray);
  console.log(nullArray);
  return (
    <Box as="main">
      <Box bg="yellow.400">
        <Container
          maxW="container.xl"
          overflow="hidden"
          gap={{ base: "1", md: "5" }}
          alignItems="center"
          display="flex"
          py="5"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Image src={`https://image.tmdb.org/t/p/original${people.profile_path}`} h="250px" borderRadius="xl"></Image>
          <Box textAlign={{ base: "center", md: "initial" }}>
            <Text as="h2" fontSize="2xl" textAlign={{ base: "center", md: "initial" }} fontWeight="semibold">
              {people.name}{" "}
              <span style={{ fontWeight: "normal" }}>
                ({Math.floor((new Date().getTime() - new Date(people.birthday).getTime()) / 3.15576e10)})
              </span>
            </Text>
            <ReleaseDate date={people.birthday} textAlign={{ base: "center", md: "initial" }} />
            <Text fontWeight="semibold">
              Department: <span style={{ fontWeight: "normal" }}>{people.known_for_department}</span>
            </Text>
            <Text>{people.place_of_birth}</Text>
          </Box>
        </Container>
      </Box>
      <Container maxW="container.xl" px="1" py="3">
        <BioTruncate biography={people.biography} />
        <Box>
          <Text
            as="h2"
            fontSize="2xl"
            fontWeight="bold"
            color="yellow.400"
            bg="blackAlpha.800"
            pl="4"
            borderRadius="md"
          >
            Acting
          </Text>
          {nullArray.length === 0 && sortedNonNullArray.length === 0 ? (
            <Text textAlign="center" py="3">
              {people.name} doesn't have any credits.
            </Text>
          ) : (
            <Card variant="outline" my="5">
              <CardBody>
                {nullArray.length > 0 && (
                  <Text fontWeight="bold" borderBottom="1px" borderBottomColor="black">
                    Unknown
                  </Text>
                )}
                {nullArray.map((e: any) => {
                  return (
                    <div key={e.credit_id}>
                      <Stack direction="row">
                        <Text fontSize="sm">
                          {new Date().toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                          })}
                        </Text>
                        <Box width="50px" textAlign="center" fontSize="sm" display={{ base: "none", md: "block" }}>
                          -
                        </Box>
                        <Stack direction="row" wrap="wrap">
                          <Link to={`/${e.media_type}/${e.id}`} className="remix-link">
                            <Text fontWeight="semibold" fontSize="sm">
                              {e.title ? e.title : e.name}
                            </Text>
                          </Link>

                          {e.character.length > 0 && (
                            <>
                              <Text color="gray.400" fontSize="sm">
                                <i>as</i>
                              </Text>
                              <Text fontSize="sm">{e.character}</Text>
                            </>
                          )}
                        </Stack>
                      </Stack>
                    </div>
                  );
                })}
                {sortedNonNullArray.map((e: any, index, array: any[]) => {
                  return (
                    <div key={e.credit_id}>
                      {index > 0 &&
                        new Date(
                          array[index - 1].release_date
                            ? array[index - 1].release_date
                            : array[index - 1].first_air_date
                        ).getFullYear() !==
                          new Date(e.release_date ? e.release_date : e.first_air_date).getFullYear() && (
                          <>
                            <Text borderBottom="1px" borderBottomColor="black" fontWeight="bold">
                              {new Date(e.release_date ? e.release_date : e.first_air_date).getFullYear()}
                            </Text>
                          </>
                        )}
                      {index == 0 && (
                        <>
                          <Text fontWeight="bold" borderBottom="1px" borderBottomColor="black">
                            {new Date(e.release_date ? e.release_date : e.first_air_date).getFullYear()}
                          </Text>
                        </>
                      )}
                      <Stack direction="row">
                        <Text fontSize="sm">
                          {new Date(e.release_date ? e.release_date : e.first_air_date).toLocaleString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                          })}
                        </Text>
                        <Box width="50px" textAlign="center" fontSize="sm" display={{ base: "none", md: "block" }}>
                          -
                        </Box>
                        <Stack direction="row" wrap="wrap">
                          <Link to={`/${e.media_type}/${e.id}`} className="remix-link">
                            <Text fontWeight="semibold" fontSize="sm">
                              {e.title ? e.title : e.name}
                            </Text>
                          </Link>

                          {e.character.length > 0 && (
                            <>
                              <Text color="gray.400" fontSize="sm">
                                <i>as</i>
                              </Text>
                              <Text fontSize="sm">{e.character}</Text>
                            </>
                          )}
                        </Stack>
                      </Stack>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};
export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.people.name}`,
  };
};
export default PeopleDetails;