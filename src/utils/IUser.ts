export interface IUser {
  email: string;
  password: string;
  id: string;
  username: string;
  isDeleted: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
