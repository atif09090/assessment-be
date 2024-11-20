import { DataTypes } from "sequelize";
import { initDB } from "../db/config";
import User from "./user.model";

const sequelize = initDB();


const DailyLog = sequelize.define("DailyLog", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  mood: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  anxiety: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sleepHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sleepQuality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  physicalActivity: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  activityDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  socialInteractions: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  stressLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  symptoms: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});


// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log("DailyLog table created successfully.");
  })
  .catch((error) => {
    console.error("Error creating DailyLog table:", error);
  });

export default DailyLog;
