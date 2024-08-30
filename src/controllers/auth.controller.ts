import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { hashPassword, verifyPassword } from "../utils/password-util";
import { IUser } from "../utils/IUser";
import { JwtMiddleWare } from "../middleware/jwt.middleware";

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
      const { email } = req.body;
      const user = await UserService.getMany({ where: { email } });
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
            user.version
          );
          return res.status(200).json({ message: "login !", accessToken,refreshToken });
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
}
