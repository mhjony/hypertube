  /*
  Fields for movie DB:
  imbd rating: float
  year: int
  genre: string
  description: string
  director: string
  cast: actor array (IDs to other table?)
  comments: comment table IDs
  subtitles: langcodes?

  Comments table:
  comment_body: string
  user: user id?
  */

import axios from "axios";


// @route   GET /movie-search
// @desc    return movie search results
// @access  Public
const movieSearch = async (req, res) => {
  console.log("movie-search end-point Hit");
  const { string } = req.query;

  const ret = await axios.get(`http://www.omdbapi.com/?t=${string}&apikey=${process.env.OMDB_KEY}`);
  console.log('Ret:');
  console.log(ret);
  return res
        .send(ret.data);
};

export default {
  movieSearch,
};
