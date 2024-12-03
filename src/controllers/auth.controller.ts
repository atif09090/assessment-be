import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { hashPassword, verifyPassword } from "../utils/password-util";
import { JwtMiddleWare } from "../middleware/jwt.middleware";
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);



export class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const { password, ...rest } = req.body;
      const encryptPassword = await hashPassword(password);
      const createUser = await UserService.create({
        ...rest,
        password: encryptPassword,
      });
      return res.status(201).json({ message: "register !", data: createUser });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        return res
          .status(500)
          .json({ message: "An unexpected error occurred" });
      }
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      // console.log("cookies", req.cookies)
      const { email } = req.body;
      const user = await UserService.getSingle({ where: { email } });
      console.log("user", user)
      if (user) {
        const { password, ...rest } = user;

        const isPasswordMatch = await verifyPassword(
          req.body.password,
          password
        );
        if (isPasswordMatch) {
          const accessToken = await JwtMiddleWare.generateToken(
            user.id,
            user.email
          );
          const refreshToken = await JwtMiddleWare.generateRefreshToken(
            user.id,
            user.email,
            user.version
          );
          res.cookie('accessToken', accessToken, { httpOnly: true });
          res.cookie('refreshToken', refreshToken, { httpOnly: true })
          res.cookie('userInfo',{
            userId: user.id
          }, {httpOnly: true})
          return res.status(200).json({ message: "login !" });
        }

        return res.status(401).json({ message: "invalid credentials" });
      } else {
        return res.status(401).json({ message: "invalid credentials" });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        return res
          .status(500)
          .json({ message: "An unexpected error occurred" });
      }
    }
  };


  static async refreshToken(req: Request, res: Response) {
    try {
      const ref_token = req.cookies?.refreshToken || req.cookies?.['refresh_token'];
      const isValidToken = await JwtMiddleWare.verifyRefreshToken(ref_token);
      const accessToken = await JwtMiddleWare.generateToken(
        isValidToken.id,
        isValidToken.email
      );
      const refreshToken = await JwtMiddleWare.generateRefreshToken(
        isValidToken.id,
        isValidToken.email,
        isValidToken.version
      );
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true })
      return res.status(200).json({ message: "token refresh  !" });


    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        return res
          .status(500)
          .json({ message: "An unexpected error occurred" });
      }
    }
  }

  static async logout(req: Request, res: Response) {
    try {

      res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
      res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });
      res.status(200).json({ message: 'Logged out successfully' });

    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        return res
          .status(500)
          .json({ message: "An unexpected error occurred" });
      }
    }
  }
  static async googleLogin(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      console.log("id Token", idToken)
      if (!idToken) {
        return res.status(400).json({ message: "ID token is required." });
      }

      // Verify the ID token with Google
      const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID,
      });

      const payload = ticket.getPayload();

      // console.log("payload ",payload)
      if (!payload) {
        return res.status(401).json({ message: "Invalid Google ID token." });
      }

      const { email, name, sub } = payload;

      console.log(email, name, sub)
      if (!email || !name || !sub) {
        return res.status(400).json({ message: "Incomplete user data from Google." });
      }

      // Check if user already exists
      let user = await UserService.getSingle({ where: { email } });

      console.log("user", user)
      if (!user) {
        // Create a new user  
        user = await UserService.create({
          username: name,
          email,
          password: sub,
          googleId: sub,
        });
      }


      // Generate JWT Tokens
      const accessToken = JwtMiddleWare.generateToken(String(user?.id), String(user?.email));
      const refreshToken = JwtMiddleWare.generateRefreshToken(String(user?.id), String(user?.email), Number(user?.version));

      return res.status(200).json({ message: "Login successful!", accessToken, refreshToken });
    } catch (error: unknown) {
      console.log("error", error)
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        return res
          .status(500)
          .json({ message: "An unexpected error occurred" });
      }
    }
  }
}
