import { Request, Response } from "express";
import { DailyLogService } from "../services/daily-log.service";
import DailyLog from "../models/daily-log.model";
import Sequelize, { DataTypes } from "sequelize";
import { UserRequest } from "../types/custome-type";



export class DailyLogController {
  static getLogs = async (req: UserRequest, res: Response) => {
    const userId = Number(req.user?.id); // Extract the user ID from JWT

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    console.log(userId)
    const { filter } = req.query;

    let dateCondition: { date?: { [key: symbol]: any } } = {};
    if (filter === "7days") {
      // Adjust SQLite date subtraction syntax
      dateCondition.date = { [Sequelize.Op.gte]: Sequelize.literal("date('now', '-7 days')") };
    } else if (filter === "30days") {
      dateCondition.date = { [Sequelize.Op.gte]: Sequelize.literal("date('now', '-30 days')") };
    } else if (filter === "3months") {
      dateCondition.date = { [Sequelize.Op.gte]: Sequelize.literal("date('now', '-3 months')") };
    }

    try {
      // console.log({
      //   userId,
      //   ...dateCondition,  // Log the full filter object
      // });
      const logs = await DailyLogService.getMany({
        where: {
          userId: userId,
          ...dateCondition
        }
      });


      // Calculate averages
      const averages = logs.reduce((acc, log) => {
        // Cast the log to DailyLog to access the typed properties
        acc.mood += log.mood;
        acc.anxiety += log.anxiety;
        acc.sleepHours += log.sleepHours;
        acc.stressLevel += log.stressLevel;
        return acc;
      }, { mood: 0, anxiety: 0, sleepHours: 0, stressLevel: 0 });

      if (logs.length > 0) {
        averages.mood = Number((averages.mood / logs.length).toFixed(1));
        averages.anxiety = Number((averages.anxiety / logs.length).toFixed(1));
        averages.sleepHours = Number((averages.sleepHours / logs.length).toFixed(1));
        averages.stressLevel = Number((averages.stressLevel / logs.length).toFixed(1));
      }

      res.status(200).json({
        message: "Logs",
        data: logs,
        averages
      });

    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      } else {
        return res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  };

  static postLog = async (req: UserRequest, res: Response) => {
    try {
      const userId = req.user?.id; // Extract the user ID from JWT

      if (!userId) {
        return res.status(400).json({ message: "User ID not found in token" });
      }

      const log = await DailyLogService.create({ ...req.body, userId });
      res.status(201).json({ message: "save", data: log });
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
}
