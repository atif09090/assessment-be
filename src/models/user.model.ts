import { DataTypes } from "sequelize";
import { initDB } from "../db/config";

const sequelize = initDB();

// Define a model
const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
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
  isDeleted:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  version:{
    type : DataTypes.BIGINT,
    defaultValue:1,
  }
});

sequelize.sync();
export default User;