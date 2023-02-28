import { type LoaderArgs, redirect } from "@remix-run/node";
import { createUserSession } from "~/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const approved = url.searchParams.get("approved");
  if (approved !== "true") {
    return redirect("/home");
  }
  const requestToken = url.searchParams.get("request_token");
  const response = await fetch(
    `https://api.themoviedb.org/3/authentication/session/new?api_key=${process.env.API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        request_token: requestToken,
      }),
    }
  );
  const data = await response.json();
  return createUserSession(data.session_id);
};
