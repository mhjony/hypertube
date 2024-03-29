import express from "express";
import cors from "cors";
import chalk from "chalk";

// Import the routes
import authRoutes from "./routes/auth.js";
import forgotPasswordRoute from "./routes/forgotPassword.js";
import movieRoutes from "./routes/movie.js";
import profileRoute from "./routes/profile.js";
import job from "./utils/cron.js";

const port = process.env.APP_BACKEND_PORT || 8000;

// Create Express server
const app = express();

// to solve the issue to render data from one port to another
app.use(cors());

// parse application/x-www-form-urlencoded: Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use imported routes
app.use("/auth", authRoutes);
app.use("/auth", forgotPasswordRoute);
app.use("/movie", movieRoutes);
app.use("/profile", profileRoute);
app.use('/uploads', express.static('public/uploads'))
job.start();

app.listen(port, () => {
  console.info(
    `${`${chalk.yellow(`CORS-enabled web Server started on port: ${port}`)}`}`
  );
});

