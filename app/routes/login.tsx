import { type LoaderArgs, redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  const requestTokenData = await fetch(
    `https://api.themoviedb.org/3/authentication/token/new?api_key=${process.env.API_KEY}`
  );
  const requestToken = await requestTokenData.json();
  const url = new URL(request.url);
  return redirect(
    `https://www.themoviedb.org/authenticate/${requestToken.request_token}?redirect_to=${url.origin}/approved`
  );
};
