import { StarIcon } from "@chakra-ui/icons";
import { Box, Container, Flex, IconButton, Tooltip, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { type LoaderArgs, json, type Request } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getUserFromSession, postAddWatchList, postFavorite, rate } from "~/auth.server";
import { AiFillHeart } from "react-icons/ai";
import { MdWatchLater } from "react-icons/md";
import StarRating from "~/components/StarRating";
import { returnNecessaryPeople } from "~/data.server";
import SimpleSlider from "~/components/MovieSlider";
import VideoSlider from "~/components/VideoSlider";
import MainStatefulButton from "~/components/buttons/MainStatefulButton";
import LandingMovieDesktop from "~/components/movie/LandingMovieDesktop";
import LandingMovieMobile from "~/components/movie/LandingMovieMobile";
import DetailsStickyFooter from "~/components/common_components/DetailsStickyFooter";
var Vibrant = require("node-vibrant");
var tinycolor = require("tinycolor2");

export async function loader({ params, request }: LoaderArgs) {
  const id = params.movieId;
  const sessionId = await getUserFromSession(request as Request);
  const responseMovieDetails = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.API_KEY}&session_id=${sessionId}&US&append_to_response=credits,videos,account_states,watch/providers`
  );
  const movieDetails = await responseMovieDetails.json();
  await Vibrant.from(`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`)
    .getPalette()
    .then(
      (palette: any) =>
        (movieDetails.colorRgb = `rgb(${palette.Vibrant._rgb[0]},${palette.Vibrant._rgb[1]}, ${palette.Vibrant._rgb[2]}, 0.8)`)
    );
  const color = tinycolor(movieDetails.colorRgb);
  const cast = returnNecessaryPeople(movieDetails.credits.cast);
  movieDetails.isLight = color.isLight();
  return json({ movie: movieDetails, cast });
}
export async function action({ request, params }: LoaderArgs) {
  const formData = await request.formData();
  const sessionId = await getUserFromSession(request as Request);
  if (!sessionId) {
    return json({ userError: "You must be logged in to perform this action" });
  }
  let status;
  if (formData.get("type") === "favorites") {
    status = await postFavorite({ request, params } as LoaderArgs, formData, sessionId);
  } else if (formData.get("type") === "watchlist") {
    status = await postAddWatchList({ request, params } as LoaderArgs, formData, sessionId);
  } else if (formData.get("type") === "rate") {
    status = await rate({ request, params } as LoaderArgs, formData, sessionId);
  }

  return json(status);
}

const MovieDetails = () => {
  const { movie, cast } = useLoaderData<typeof loader>();
  return (
    <Box as="main">
      <LandingMovieDesktop movie={movie} />
      <LandingMovieMobile movie={movie} />
      <Container maxW="container.xl" mb="10">
        <SimpleSlider title="Cast" movies={cast} type="people" />
        <VideoSlider videos={movie.videos.results.filter((video: Video) => video.site !== "Youtube")} />
      </Container>
      <DetailsStickyFooter account_states={movie.account_states} />
    </Box>
  );
};

export default MovieDetails;
