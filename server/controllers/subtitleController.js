import fs from "fs";

const getSubtitles = async (req, res) => {
  const { imdb_code, lang } = req.params;
	//console.log('Get sub triggered: ', imdb_code, lang);

  const filename = `./subtitles/${imdb_code}/${lang}/subtitle.vtt`;//server/subtitles/tt0111161/en/subtitle.vtt
	//console.log('String: ', filename);
  const readStream = fs.createReadStream(filename);
	//console.log('ReadStream', readStream);

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
