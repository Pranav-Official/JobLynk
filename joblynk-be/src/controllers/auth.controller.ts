import type { Request, Response } from "express";
import { WorkOS } from "@workos-inc/node";

class AuthController {
  private workos: WorkOS;

  constructor() {
    this.workos = new WorkOS(process.env.WORKOS_API_KEY, {
      clientId: process.env.WORKOS_CLIENT_ID,
    });
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    console.log("Auth test");
    const authorizationUrl = this.workos.userManagement.getAuthorizationUrl({
      provider: "authkit",
      redirectUri: "http://localhost:8080/api/auth/callback",
      clientId: process.env.WORKOS_CLIENT_ID || "",
    });

    res.redirect(authorizationUrl);
  };

  public callback = async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code;

    if (!code) {
      res.status(400).send("No code provided");
      return;
    }

    try {
      const authenticateResponse =
        await this.workos.userManagement.authenticateWithCode({
          clientId: process.env.WORKOS_CLIENT_ID || "",
          code: code as string,
          session: {
            sealSession: true,
            cookiePassword: process.env.WORKOS_COOKIE_PASSWORD,
          },
        });

      const { user, sealedSession } = authenticateResponse;

      res.cookie("wos-session", sealedSession, {
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });

      console.log(user);
      res.redirect((process.env.FE_HOST || '') + '/redirect');
    } catch (error) {
      res.redirect(process.env.FE_HOST || '');
    }
  };

  public isLoggedIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = this.workos.userManagement.loadSealedSession({
        sessionData: req.cookies["wos-session"],
        cookiePassword: process.env.WORKOS_COOKIE_PASSWORD || "",
      });
      const result = await session.authenticate();

      if (result.authenticated) {
        res.json({
          isLoggedIn: true,
          data: {
            userDetails: result.user,
          },
        });
        return;
      }

      if ("reason" in result) {
        console.log(result.reason);
        res.json({ isLoggedIn: false });
        return;
      }
    } catch (error) {
      console.error("Error authenticating session:", error);
      res.json({ isLoggedIn: false });
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const session = this.workos.userManagement.loadSealedSession({
        sessionData: req.cookies["wos-session"],
        cookiePassword: process.env.WORKOS_COOKIE_PASSWORD || "",
      });

      const url = await session.getLogoutUrl();

      res.clearCookie("wos-session");
      res.redirect(url);
    } catch (error: any) {
      res.redirect(process.env.FE_HOST || '');
    }
  };
}

export default new AuthController();
