import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userId: string;
  userEmail: string;
  userName?: string;
};

type SessionFlashData = {
  error: string;
  success: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET || "s3cret1"],
      secure: process.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };