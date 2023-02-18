import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import MainImage from "~/components/MainImage";
import SimpleSlider from "~/components/MovieSlider";
import { returnNecessaryMovieData, returnNecessaryTvData } from "~/data.server";

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
  return json({ featuredMovies, featuredTvShows });
};

const Home = () => {
  const { featuredMovies, featuredTvShows } = useLoaderData<typeof loader>();
  return (
    <>
      <MainImage />
      <SimpleSlider movies={featuredMovies} title={"Featured Movies"} />
      <SimpleSlider movies={featuredTvShows} title={"Featured TV Shows"} />
    </>
  );
};

export default Home;
