import { DataTypes } from "sequelize";
import { initDB } from "../db/config";

const sequelize = initDB();

// Define a model
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    defaultValue:false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  googleId:{
    type:DataTypes.STRING,
    defaultValue:false
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  version: {
    type: DataTypes.BIGINT,
    defaultValue: 1,
  }
});


// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log("User table created successfully.");
  })
  .catch((error) => {
    console.error("Error creating User table:", error);
  });
export default User;