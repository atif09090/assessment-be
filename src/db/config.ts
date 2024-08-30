import { Sequelize } from "sequelize";

// Initialize the Sequelize database

export const initDB =  () => {
  return  new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
  });
};
