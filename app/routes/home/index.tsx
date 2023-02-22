import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MainImage from "~/components/MainImage";
import SimpleSlider from "~/components/MovieSlider";
import PeopleImage from "~/components/PeopleImage";
import { returnNecessaryMovieData, returnNecessaryPeople, returnNecessaryTvData } from "~/data.server";

export const loader = async () => {
  const responseFeaturedMovies = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&page=1`
  );
  let featuredMovies = await responseFeaturedMovies.json();
  featuredMovies = returnNecessaryMovieData(featuredMovies);
  const responseFeaturedTvShows = await fetch(
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.API_KEY}`
  );
  let featuredTvShows = await responseFeaturedTvShows.json();
  featuredTvShows = returnNecessaryTvData(featuredTvShows);
  const responseFeaturedPeople = await fetch(
    `https://api.themoviedb.org/3/trending/person/week?api_key=${process.env.API_KEY}`
  );
  let featuredPeople = await responseFeaturedPeople.json();
  featuredPeople = returnNecessaryPeople(featuredPeople.results);
  return json({ featuredMovies, featuredTvShows, featuredPeople });
};

const Home = () => {
  const { featuredMovies, featuredTvShows, featuredPeople } = useLoaderData<typeof loader>();
  return (
    <>
      <MainImage />
      <SimpleSlider movies={featuredMovies} title={"Featured Movies"} type="movie" />
      <SimpleSlider movies={featuredTvShows} title={"Featured TV Shows"} type="tv" />
      <PeopleImage />
      <SimpleSlider movies={featuredPeople} title={"Featured People"} type="people" />
    </>
  );
};

export default Home;
