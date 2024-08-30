import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const createUser = await UserService.create(req.body);
      res.status(201).json({ message: "register !", data: createUser });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await UserService.getMany({ where: { email } });
      res.status(200).json({ message: "login !", data: user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  };
}
