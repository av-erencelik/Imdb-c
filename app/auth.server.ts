import { createCookieSessionStorage, redirect, Request } from "@remix-run/node";

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
