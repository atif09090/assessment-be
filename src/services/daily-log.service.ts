
import { initDB } from "../db/config";
import DailyLog from "../models/daily-log.model";
import { IDailyLog } from "../utils/IDailyLog";

const sequelize = initDB(); // Initialize the database instance
export default sequelize;   // Export the instance
export class DailyLogService {
  // Create a new daily log entry
  static async create(createDto: any): Promise<any> {
    const dailyLog = await DailyLog.create(createDto);
    return dailyLog.save();
  }

  // Get a single daily log entry by a specific condition
  static async getSingle(findDto: any): Promise<IDailyLog | null> {
    const log = await DailyLog.findOne({ where: findDto });
    return log ? log.toJSON() as IDailyLog : null;
  }

  // Get multiple daily log entries
  static async getMany(filter: any): Promise<IDailyLog[]> {
    const logs = await DailyLog.findAll(filter);
    return logs.map((log) => log.toJSON() as IDailyLog);
  }

}
