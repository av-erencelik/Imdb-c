import { type Request } from "@remix-run/node";
import { destroyUserSession, getUserFromSession } from "~/auth.server";
export const loader = async ({ request }: { request: Request }) => {
  const response = await fetch(`https://api.themoviedb.org/3/authentication/session?api_key=${process.env.API_KEY}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      session_id: await getUserFromSession(request),
    }),
  });
  const data = await response.json();
  console.log(data);
  return destroyUserSession(request);
};
