import type { Request, Response, NextFunction } from "express";
import { WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

// Auth middleware function
export async function withAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies["wos-session"],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD || "",
  });

  const authResult = await session.authenticate();

  if (authResult.authenticated) {
    const userId = authResult.user.id;
    req.userId = userId;
    return next();
  }

  // If the cookie is missing, redirect to login
  if (
    !authResult.authenticated &&
    authResult.reason === "no_session_cookie_provided"
  ) {
    return res.redirect("http://localhost:3000/");
  }

  // If the session is invalid, attempt to refresh
  try {
    const refreshResult = await session.refresh();

    if (!refreshResult.authenticated) {
      return res.redirect("http://localhost:3000/");
    }

    // update the cookie
    res.cookie("wos-session", refreshResult.sealedSession, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    const userId = refreshResult.user.id;
    req.userId = userId;
    return next();
  } catch (e) {
    // Failed to refresh access token, redirect user to login page
    // after deleting the cookie
    res.clearCookie("wos-session");
    res.redirect("http://localhost:3000/");
  }
}
