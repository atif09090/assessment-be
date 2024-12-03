// config environment variable
import dotenv from "dotenv";
dotenv.config();

// import packages for express
import express, { Request, Response } from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { createServer } from "http";
import { Server } from "socket.io";
// import ngrok from '@ngrok/ngrok'

// import main routes

import mainRoute from './routes/main.route'
import { JwtMiddleWare } from "./middleware/jwt.middleware";

// setup packages

const app = express();
const port = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Replace with your Next.js frontend URL
    credentials: true, // Allow cookies to be sent
  },
});

// ------- initialize our instances --------

app.use(logger("dev"));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Your FRONTEND app origin
  credentials: true // Allow credentials (cookies) to be sent
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


io.on("connection", async (socket) => {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) {
    return new Error("Authentication error")
  }
  
  const cookies = cookieParser.JSONCookies(
    Object.fromEntries(
      cookieHeader?.split("; ").map((c) => c.split("="))
    )
  );
  
  const token = cookies?.accessToken;
  
  let userId = ''

  if(typeof token === 'string') {
    const decoded = await JwtMiddleWare.verifyToken(token)
    socket.join(decoded.id) 
    userId = decoded?.id
  }


  socket.on("dailylog-update", (data) => {

   io.emit('dailylog-updated', data)
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// apis routes
app.use("/api", mainRoute);

// throw 404 if URL not found
app.all("*", function (req: Request, res: Response) {
  return res.send, "Page not found";
});
httpServer.listen(port, () => {
  console.log(`[server]: ⚡️ Server is running at http://localhost:${port}`);

  console.log("Press CTRL + C to stop the process. \n");
});

