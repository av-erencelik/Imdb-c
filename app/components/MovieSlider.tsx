import { StarIcon } from "@chakra-ui/icons";
import { Box, Card, CardBody, CardFooter, Container, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { useRef } from "react";
import Slider from "react-slick";
export default function SimpleSlider(props: {
  title: string;
  movies: NecessaryData[] | NecessaryDataPeople[];
  type: string;
}) {
  const { movies, title, type } = props;
  const slider = useRef(null);
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 4,
    draggable: false,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1050,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Container maxW="container.xl" mt="2" px={"1"}>
      <Text as="h2" fontSize="2xl" fontWeight="bold" color="yellow.400" bg="blackAlpha.800" pl="4" borderRadius="md">
        {title}
      </Text>
      <Slider {...settings} ref={slider}>
        {movies.map((movie: NecessaryData | NecessaryDataPeople, index: number) => (
          <Card maxW="175px" h="285px" overflow="hidden" cursor="pointer" key={index} className="hover">
            <Link to={`/${type}/${movie.id}`}>
              <CardBody p="0">
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.poster}`}
                  w="100%"
                  objectFit={"cover"}
                  maxH="200px"
                  fallback={
                    <Skeleton>
                      <Box h="200px" w="100%"></Box>
                    </Skeleton>
                  }
                  loading="lazy"
                />
              </CardBody>
              <CardFooter display="block" p="2">
                <Box display="flex" justifyContent="space-between" alignItems="center" gap="20px">
                  {"rating" in movie ? (
                    <Flex gap="5px" alignItems="center">
                      <StarIcon color="yellow.400" boxSize={3} />
                      <Text fontWeight="medium" fontSize="sm" color="yellow.400">
                        {movie.rating}
                      </Text>
                    </Flex>
                  ) : null}

                  {"releaseDate" in movie ? (
                    <Text fontSize="sm">
                      {new Date(movie.releaseDate).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  ) : movie.character ? (
                    <Text fontSize="sm">{movie.character}</Text>
                  ) : (
                    <Text fontSize="sm">
                      {movie.role === "Acting" ? (movie.gender === "female" ? "Actress" : "Actor") : "Director"}
                    </Text>
                  )}
                </Box>
                <Text noOfLines={2} fontWeight="semibold" fontSize="medium">
                  {"title" in movie ? movie.title : movie.name}
                </Text>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </Slider>
    </Container>
  );
}
