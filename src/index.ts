// config environment variable
import dotenv from "dotenv";
dotenv.config();

// import packages for express
import express, { Request, Response } from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from 'cookie-parser';
// import ngrok from '@ngrok/ngrok'

// import main routes

import mainRoute  from './routes/main.route'

// setup packages

const app = express();
const port = process.env.PORT;

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

// apis routes
app.use("/", mainRoute);

// throw 404 if URL not found
app.all("*", function (req: Request, res: Response) {
  return res.send, "Page not found";
});
app.listen(port, () => {
  console.log(`[server]: ⚡️ Server is running at http://localhost:${port}`);

  console.log("Press CTRL + C to stop the process. \n");

  // (async function() {
  //   // Establish connectivity
  //   const listener = await ngrok.forward({ addr: 8080, authtoken_from_env: true });
  
  //   // Output ngrok url to console
  //   console.log(`Ingress established at: ${listener.url()}`);
  // })();
  
  // process.stdin.resume();
});
