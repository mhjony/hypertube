import express from "express";
import cors from "cors";
import chalk from "chalk";

// import authRoutes from "./routes/auth";

const port = process.env.PORT || 8000;

// Create Express server
const app = express();

// to solve the issue to render data from one port to another
app.use(cors());

// parse application/x-www-form-urlencoded: Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

// Use imported routes
// app.use("/auth", authRoutes);

app.listen(port, () => {
  console.info(
    `${`${chalk.green(`CORS-enabled web Server started on port: ${port}`)}`}`
  );
});
