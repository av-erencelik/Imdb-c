import { createCookieSessionStorage, redirect, Request, LoaderArgs } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET as string],
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
  },
});
export async function createUserSession(sessionId: string) {
  const session = await sessionStorage.getSession();
  session.set("sessionId", sessionId);
  return redirect("/home", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
export async function getUserFromSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const sessionId = session.get("sessionId");
  if (!sessionId) {
    return null;
  }
  return sessionId;
}
export async function getUserInfos(request: Request) {
  const sessionId = await getUserFromSession(request);
  if (!sessionId) {
    return null;
  }
  const userResponse = await fetch(
    `https://api.themoviedb.org/3/account?api_key=${process.env.API_KEY}&session_id=${sessionId}`
  );
  const user = await userResponse.json();
  return user;
}
export async function postFavorite({ request, params }: LoaderArgs, form: FormData) {
  const url = new URL(request.url);
  let id;
  if (url.pathname.split("/")[1] === "movie") {
    id = params.movieId;
  } else {
    id = params.tvShowId;
  }

  const sessionId = await getUserFromSession(request as Request);
  const user = await getUserInfos(request as Request);

  const response = await fetch(
    `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.API_KEY}&session_id=${sessionId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: url.pathname.split("/")[1],
        media_id: id,
        favorite: form.get("fav") === "true" ? false : true,
      }),
    }
  );
  const status = await response.json();
  if (!status.success) {
    return { error: status.status_message };
  }
  return status;
}
export async function postAddWatchList({ request, params }: LoaderArgs, form: FormData) {
  const url = new URL(request.url);
  let id;
  if (url.pathname.split("/")[1] === "movie") {
    id = params.movieId;
  } else {
    id = params.tvShowId;
  }

  const sessionId = await getUserFromSession(request as Request);
  const user = await getUserInfos(request as Request);

  const response = await fetch(
    `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.API_KEY}&session_id=${sessionId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_type: url.pathname.split("/")[1],
        media_id: id,
        watchlist: form.get("fav") === "true" ? false : true,
      }),
    }
  );
  const status = await response.json();
  if (!status.success) {
    return { error: status.status_message };
  }
  return status;
}
export async function rate({ request, params }: LoaderArgs, form: FormData) {
  const url = new URL(request.url);
  let id;
  if (url.pathname.split("/")[1] === "movie") {
    id = params.movieId;
  } else {
    id = params.tvShowId;
  }

  const sessionId = await getUserFromSession(request as Request);

  let response;
  if (request.method === "POST") {
    response = await fetch(
      `https://api.themoviedb.org/3/${url.pathname.split("/")[1]}/${id}/rating?api_key=${
        process.env.API_KEY
      }&session_id=${sessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: form.get("value"),
        }),
      }
    );
  } else {
    response = await fetch(
      `https://api.themoviedb.org/3/${url.pathname.split("/")[1]}/${id}/rating?api_key=${
        process.env.API_KEY
      }&session_id=${sessionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const status = await response.json();
  if (!status.success) {
    return { error: status.status_message };
  }
  return status;
}
