import { type LoaderArgs, redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderArgs) => {
  const requestTokenData = await fetch(
    "https://api.themoviedb.org/3/authentication/token/new?api_key=f6a209b4c28e86ec9c12c4ca8d885108"
  );
  const requestToken = await requestTokenData.json();
  const url = new URL(request.url);
  return redirect(
    `https://www.themoviedb.org/authenticate/${requestToken.request_token}?redirect_to=${url.origin}/approved`
  );
};
