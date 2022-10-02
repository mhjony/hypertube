import fs from "fs";

const getSubtitles = async (req, res) => {
  const { imdb_code, lang } = req.params;

  const filename = `./subtitles/${imdb_code}/${lang}/subtitle.vtt`;

  const readStream = fs.createReadStream(filename);

  readStream.on("open", () => {
    const head = {
      "Content-Type": "text/vtt",
    };
    res.writeHead(200, head);
    readStream.pipe(res);
  });
  readStream.on("error", (err) => {
    res.end(err);
  });
};

export default {
  getSubtitles,
};
