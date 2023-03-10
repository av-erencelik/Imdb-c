import { Box } from "@chakra-ui/react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { type MetaFunction } from "@remix-run/react/dist/routeModules";
import MainImage from "~/components/MainImage";
import SimpleSlider from "~/components/MovieSlider";
import PeopleImage from "~/components/PeopleImage";
import { returnNecessaryMovieData, returnNecessaryPeople, returnNecessaryTvData } from "~/data.server";

export const loader = async () => {
  const urls = [
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&page=1`,
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.API_KEY}`,
    `https://api.themoviedb.org/3/trending/person/week?api_key=${process.env.API_KEY}`,
  ];
  try {
    const [movies, tvshows, people] = await Promise.all(urls.map((url) => fetch(url))).then((values) =>
      Promise.all(values.map((value) => value.json())).then()
    );
    if (movies.status_code || tvshows.status_code || people.status_code) throw json("error");
    const featuredMovies = returnNecessaryMovieData(movies);
    const featuredTvShows = returnNecessaryTvData(tvshows);
    const featuredPeople = returnNecessaryPeople(people.results);
    return json({ featuredMovies, featuredTvShows, featuredPeople });
  } catch (e) {
    throw json("error", { status: 404 });
  }
};

const Home = () => {
  const { featuredMovies, featuredTvShows, featuredPeople } = useLoaderData<typeof loader>();
  return (
    <Box as="main">
      <MainImage />
      <SimpleSlider movies={featuredMovies} title={"Featured Movies"} type="movie" />
      <SimpleSlider movies={featuredTvShows} title={"Featured TV Shows"} type="tv" />
      <PeopleImage />
      <SimpleSlider movies={featuredPeople} title={"Featured People"} type="people" />
    </Box>
  );
};
export const meta: MetaFunction = ({ data }) => {
  return {
    title: "IMDB-C",
  };
};

export default Home;
