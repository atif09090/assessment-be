import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  static getAll = async (req: Request, res: Response) => {
    try {
        const {id,email} = (req as any).user;;
        const users = await UserService.getMany();

        res.status(200).json({message:"users list !",data:{users,id,email}})

    } catch (error) {
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
