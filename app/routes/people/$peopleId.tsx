import { Box, Card, CardBody, Container, Image, Stack, Text } from "@chakra-ui/react";
import { type LoaderArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import BioTruncate from "~/components/BioTruncate";
import ReleaseDate from "../../components/common_components/ReleaseDate";
import { useEffect, useState } from "react";
import { type MetaFunction } from "@remix-run/react/dist/routeModules";
import defaultPP from "../../../public/default.jpg";
export async function loader({ params, request }: LoaderArgs) {
  const id = params.peopleId;
  const responsePeopleDetails = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.API_KEY}&language=en-US&append_to_response=combined_credits`
  );
  const peopleDetails: People = await responsePeopleDetails.json();
  return json({ people: peopleDetails });
}
function compare(a: TvCredit | MovieCredit, b: TvCredit | MovieCredit) {
  return (
    new Date("release_date" in b ? b.release_date : b.first_air_date).getTime() -
    new Date("release_date" in a ? a.release_date : a.first_air_date).getTime()
  );
}
function returnSortedNonNullArray(array: People) {
  return array.combined_credits.cast
    .filter((e) => ("release_date" in e ? e.release_date !== "" : e.first_air_date !== ""))
    .sort(compare);
}
function returnSortedNonNullArrayCrew(array: People) {
  return array.combined_credits.crew
    .filter((e) => ("release_date" in e ? e.release_date !== "" : e.first_air_date !== ""))
    .sort(compare);
}
function returnNullArray(array: People) {
  return array.combined_credits.cast.filter((e) =>
    "release_date" in e ? e.release_date === "" : e.first_air_date === ""
  );
}
function returnNullArrayCrew(array: People) {
  return array.combined_credits.crew.filter((e) =>
    "release_date" in e ? e.release_date === "" : e.first_air_date === ""
  );
}
const PeopleDetails = () => {
  const { people } = useLoaderData<typeof loader>();
  const [sortedNonNullArray, setSortedNonNullArray] = useState([] as (TvCredit | MovieCredit)[]);
  const [sortedNonNullArrayCrew, setSortedNonNullArrayCrew] = useState([] as (TvCredit | MovieCredit)[]);
  const [nullArray, setNullArray] = useState([] as (TvCredit | MovieCredit)[]);
  const [nullArrayCrew, setNullArrayCrew] = useState([] as (TvCredit | MovieCredit)[]);
  useEffect(() => {
    setSortedNonNullArray(returnSortedNonNullArray(people));
    setNullArray(returnNullArray(people));
    setSortedNonNullArrayCrew(returnSortedNonNullArrayCrew(people));
    setNullArrayCrew(returnNullArrayCrew(people));
  }, [people]);
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
          <Image
            src={`https://image.tmdb.org/t/p/original${people.profile_path}`}
            h="250px"
            borderRadius="xl"
            fallbackSrc={defaultPP}
          ></Image>
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
                {nullArray.map((e) => {
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
                              {"title" in e ? e.title : e.name}
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
                {sortedNonNullArray.map((e, index, array: any[]) => {
                  return (
                    <div key={e.credit_id}>
                      {index > 0 &&
                        new Date(
                          array[index - 1].release_date
                            ? array[index - 1].release_date
                            : array[index - 1].first_air_date
                        ).getFullYear() !==
                          new Date("release_date" in e ? e.release_date : e.first_air_date).getFullYear() && (
                          <>
                            <Text borderBottom="1px" borderBottomColor="black" fontWeight="bold">
                              {new Date("release_date" in e ? e.release_date : e.first_air_date).getFullYear()}
                            </Text>
                          </>
                        )}
                      {index == 0 && (
                        <>
                          <Text fontWeight="bold" borderBottom="1px" borderBottomColor="black">
                            {new Date("release_date" in e ? e.release_date : e.first_air_date).getFullYear()}
                          </Text>
                        </>
                      )}
                      <Stack direction="row">
                        <Text fontSize="sm">
                          {new Date("release_date" in e ? e.release_date : e.first_air_date).toLocaleString("en-US", {
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
                              {"title" in e ? e.title : e.name}
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
            Crew
          </Text>
          {nullArrayCrew.length === 0 && sortedNonNullArrayCrew.length === 0 ? (
            <Text textAlign="center" py="3">
              {people.name} doesn't have any credits.
            </Text>
          ) : (
            <Card variant="outline" my="5">
              <CardBody>
                {nullArrayCrew.length > 0 && (
                  <Text fontWeight="bold" borderBottom="1px" borderBottomColor="black">
                    Unknown
                  </Text>
                )}
                {nullArrayCrew.map((e) => {
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
                              {"title" in e ? e.title : e.name}
                            </Text>
                          </Link>

                          {e.job && (
                            <>
                              <Text color="gray.400" fontSize="sm">
                                <i>job</i>
                              </Text>
                              <Text fontSize="sm">{e.job}</Text>
                            </>
                          )}
                        </Stack>
                      </Stack>
                    </div>
                  );
                })}
                {sortedNonNullArrayCrew.map((e, index, array: any[]) => {
                  return (
                    <div key={e.credit_id}>
                      {index > 0 &&
                        new Date(
                          array[index - 1].release_date
                            ? array[index - 1].release_date
                            : array[index - 1].first_air_date
                        ).getFullYear() !==
                          new Date("release_date" in e ? e.release_date : e.first_air_date).getFullYear() && (
                          <>
                            <Text borderBottom="1px" borderBottomColor="black" fontWeight="bold">
                              {new Date("release_date" in e ? e.release_date : e.first_air_date).getFullYear()}
                            </Text>
                          </>
                        )}
                      {index == 0 && (
                        <>
                          <Text fontWeight="bold" borderBottom="1px" borderBottomColor="black">
                            {new Date("release_date" in e ? e.release_date : e.first_air_date).getFullYear()}
                          </Text>
                        </>
                      )}
                      <Stack direction="row">
                        <Text fontSize="sm">
                          {new Date("release_date" in e ? e.release_date : e.first_air_date).toLocaleString("en-US", {
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
                              {"title" in e ? e.title : e.name}
                            </Text>
                          </Link>

                          {e.job && (
                            <>
                              <Text color="gray.400" fontSize="sm">
                                <i>as</i>
                              </Text>
                              <Text fontSize="sm">{e.job}</Text>
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
    title: data.people.name,
  };
};
export default PeopleDetails;
