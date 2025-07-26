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
): Promise<any> {
  console.log("Entering withAuth middleware");

  const session = workos.userManagement.loadSealedSession({
    sessionData: req.cookies["wos-session"],
    cookiePassword: process.env.WORKOS_COOKIE_PASSWORD || "",
  });
  console.log("Sealed session loaded.");

  const authResult = await session.authenticate();
  console.log("Authentication attempt result:", authResult);

  if (authResult.authenticated) {
    const userId = authResult.user.id;
    req.userId = userId;
    console.log("User authenticated. User ID:", userId);
    return next();
  }

  if (
    !authResult.authenticated &&
    authResult.reason === "no_session_cookie_provided"
  ) {
    console.log("No session cookie provided. Clearing cookie and sending 401.");
    res.clearCookie("wos-session");
    return res.status(401).json({
      message: "Unauthorized",
      redirectTo: process.env.FE_HOST || '',
    });
  }

  try {
    console.log("Session invalid, attempting to refresh.");
    const refreshResult = await session.refresh();
    console.log("Refresh attempt result:", refreshResult);

    if (!refreshResult.authenticated) {
      console.log("Refresh failed. Clearing cookie and sending 401.");
      res.clearCookie("wos-session");
      return res.status(401).json({
        message: "Unauthorized",
        redirectTo: process.env.FE_HOST || '',
      });
    }

    res.cookie("wos-session", refreshResult.sealedSession, {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    const userId = refreshResult.user.id;
    req.userId = userId;
    console.log("Cookie updated and user ID set:", userId);
    return next();
  } catch (e) {
    console.error("Failed to refresh access token. Error:", e);
    res.clearCookie("wos-session");
    return res.status(401).json({
      message: "Unauthorized",
      redirectTo: process.env.FE_HOST || '',
    });
  }
}