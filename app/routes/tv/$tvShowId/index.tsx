import { Box, Container } from "@chakra-ui/react";
import { json, type LoaderArgs, type Request } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getUserFromSession, postAddWatchList, postFavorite, rate } from "~/auth.server";

import DetailsStickyFooter from "~/components/common_components/DetailsStickyFooter";

import SimpleSlider from "~/components/MovieSlider";

import LandingTvDesktop from "~/components/tv/LandingTvDesktop";
import LandingTvMobile from "~/components/tv/LandingTvMobile";
import Seasons from "~/components/tv/Seasons";
import VideoSlider from "~/components/VideoSlider";
import { returnNecessaryPeople } from "~/data.server";
var Vibrant = require("node-vibrant");
var tinycolor = require("tinycolor2");

export async function loader({ params, request }: LoaderArgs) {
  const id = params.tvShowId;
  const sessionId = await getUserFromSession(request as Request);
  const responseTvShowDetails = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.API_KEY}&session_id=${sessionId}&US&append_to_response=credits,videos,account_states,watch/providers`
  );
  const tvShowDetails = await responseTvShowDetails.json();
  if (tvShowDetails.backdrop_path) {
    await Vibrant.from(`https://image.tmdb.org/t/p/original${tvShowDetails.backdrop_path}`)
      .getPalette()
      .then(
        (palette: any) =>
          (tvShowDetails.colorRgb = `rgb(${palette.Vibrant._rgb[0]},${palette.Vibrant._rgb[1]}, ${palette.Vibrant._rgb[2]}, 0.8)`)
      );
  } else {
    tvShowDetails.colorRgb = "rgb(236, 201, 75, 0.8)";
  }

  const color = tinycolor(tvShowDetails.colorRgb);
  const cast = returnNecessaryPeople(tvShowDetails.credits.cast);
  tvShowDetails.isLight = color.isLight();
  return json({ movie: tvShowDetails, cast });
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
const TvShowDetails = () => {
  const { movie, cast } = useLoaderData<typeof loader>();
  console.log(movie);
  return (
    <Box as="main">
      <LandingTvDesktop movie={movie} />
      <LandingTvMobile movie={movie} />
      <Container maxW="container.xl" mb="10">
        <SimpleSlider title="Cast" movies={cast} type="people" />
        <VideoSlider videos={movie.videos.results.filter((video: Video) => video.site !== "Youtube")} />
      </Container>
      <DetailsStickyFooter account_states={movie.account_states} />
      <Seasons seasons={movie.seasons} />
    </Box>
  );
};

export default TvShowDetails;
