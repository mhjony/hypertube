import fs from "fs";
import axios from "axios";
import OpenSubtitlesApi from "opensubtitles-api";

const OPENSUBTITLES_MY_USER_AGENT = "tasmia";
const OPENSUBTITLES_USERNAME = "hypertube";
const OPENSUBTITLES_PASSWORD = "hypertube";

const OpenSubtitles = new OpenSubtitlesApi({
  useragent: OPENSUBTITLES_MY_USER_AGENT,
  username: OPENSUBTITLES_USERNAME,
  password: OPENSUBTITLES_PASSWORD,
  ssl: true,
});

const downloadSubtitles = (subtitlesUrl, option) =>
  new Promise((resolve) => {
    axios
      .get(subtitlesUrl, { responseType: "stream" })
      .then((response) => {
        fs.mkdirSync(option.dir, { recursive: true });
        const file = fs.createWriteStream(`${option.dir}/subtitle.vtt`);
        response.data.pipe(file);
        file.on("finish", () => {
          resolve(option.lang);
        });
      })
      .catch(() => {
        resolve();
      });
  });

const getSubtitles = async (imdb_code) => {
  try {
    const parentDir = `./subtitles/${imdb_code}`;

    const options = [
      {
        lang: "en",
        dir: `${parentDir}/en`,
      },
      {
        lang: "de",
        dir: `${parentDir}/de`,
      },
      {
        lang: "fi",
        dir: `${parentDir}/fi`,
      },
      {
        lang: "ru",
        dir: `${parentDir}/ru`,
      },
    ];

    let subtitles = [];

    if (fs.existsSync(parentDir)) {
      subtitles = options.reduce((accum, option) => {
        if (fs.existsSync(option.dir)) {
          accum.push(option.lang);
        }
        return accum;
      }, []);
    } else {
      const searchResult = await OpenSubtitles.search({
        sublanguageid: "eng, fin, ger, rus",
        extensions: ["srt", "vtt"],
        imdb_code: imdb_code,
        limit: 1,
      });
      const promises = [];
      options.forEach((option) => {
        if (
          searchResult[option.lang] &&
          searchResult[option.lang][0] &&
          searchResult[option.lang][0].vtt
        ) {
          const subtitlesUrl = searchResult[option.lang][0].vtt;
          promises.push(downloadSubtitles(subtitlesUrl, option));
        }
      });
      const result = await Promise.all(promises);
      subtitles = result.filter((r) => !!r);
    }
    return subtitles;
  } catch (err) {
    return [];
  }
};

export default { getSubtitles };
