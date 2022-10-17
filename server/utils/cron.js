import fs from "fs";
import { CronJob } from "cron";

import pool from "../config/database.js";

const removeOldMovies = async (movie) => {
  const subtitlesPath = `./subtitles/${movie.imdb_code}`;
  const moviePath = `./movies/${movie.imdb_code}`;

  if (fs.existsSync(moviePath)) {
    fs.rmdirSync(moviePath, { recursive: true });
  }

  if (fs.existsSync(subtitlesPath)) {
    fs.rmdirSync(subtitlesPath, { recursive: true });
  }

  await pool.query(
    `UPDATE movies SET downloaded = 0, last_watched = null WHERE imdb_code = $1`,
    [movie.imdb_code]
  );
};

const getDateMonthAgo = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date;
};

const job = new CronJob("0 1 * * *", async () => {
  const dateMonthAgo = getDateMonthAgo();

  const movies = await pool.query(
    `SELECT * FROM movies WHERE last_watched < $1`,
    [dateMonthAgo]
  );

  if (movies.rows.length > 0) {
    await Promise.all(movies.rows.map((movie) => removeOldMovies(movie)));
  }
});

export default job;
