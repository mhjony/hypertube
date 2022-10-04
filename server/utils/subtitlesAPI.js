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




/* axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
}); */


const downloadSubtitles = (/* subtitlesUrl, options */) => {

	var options = {
		method: 'GET',
		url: 'https://api.opensubtitles.com/api/v1/subtitles',
		headers: {'Content-Type': 'application/json', 'Api-Key': 'p8v7XyDIIBm6M8jJnR6nHuu2U7d3G6H2'}
	};
	
	/* axios.request(options).then(function (response) {
		console.log(response);
	}).catch(function (error) {
		console.error(error);
	}); */

  new Promise((resolve) => {
		console.log('In promise.');
    axios.request(options)
      .then((response) => {
				console.log(response);
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

}

const searchSubtitles = async (imdbCode) => {

	var options = {
		method: 'GET',
		url: `https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdbCode}`,
		headers: {'Content-Type': 'application/json', 'Api-Key': 'p8v7XyDIIBm6M8jJnR6nHuu2U7d3G6H2'}
	};

	axios.request(options).then(function (response) {
		console.log('Logging data:');
		console.log(response.data);
		console.log(response.data.data.length);
		let results = [];
		response.data.data.forEach((sub) => {
			//console.log(sub.attributes.language);
			//console.log(sub.attributes.release);
			if (sub.attributes.language === 'en') {
				results.push(sub);
			}
		})
		console.log(results.length);
		return(response.data);
	}).catch(function (error) {
		console.error(error);
	});
}

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
		console.log('Subtitles:');
		console.log(subtitles);
    /* if (fs.existsSync(parentDir)) {
			console.log(`parentDir: ${parentDir}`);
      subtitles = options.reduce((accum, option) => {
				console.log(option);
        if (fs.existsSync(option.dir)) {
					
          accum.push(option.lang);
        }
				console.log(`accum = ${accum}`);
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
    }*/
		const searchResult = await searchSubtitles(imdb_code);
		console.log('Logging results:');
		searchResult.foreach((result) => {
			console.log('Another subtitle:');
			console.log(result);
		})
		
		/* ({
			sublanguageid: "eng, fin, ger, rus",
			extensions: ["srt", "vtt"],
			imdb_code: imdb_code,
			limit: 1,
		});  */
		const promises = [];
		options.forEach((option) => {
			console.log('This crap works until here.');
			if (
				searchResult[option.lang] &&
				searchResult[option.lang][0] &&
				searchResult[option.lang][0].vtt
			) {
				console.log('And until here.');
				const subtitlesUrl = searchResult[option.lang][0].vtt;
				promises.push(downloadSubtitles(subtitlesUrl, option));
			}
		});
		const result = await Promise.all(promises);
		console.log('This crap works until here.');
		subtitles = result.filter((r) => !!r);
		console.log(subtitles);
    return subtitles;
  } catch (err) {
    return [];
  }
};

export default { getSubtitles };
