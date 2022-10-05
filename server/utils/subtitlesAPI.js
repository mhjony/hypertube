import fs from "fs";
import axios from "axios";
import pool from "../config/database.js";



/* axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
}); */


const downloadSubtitles = (/* subtitlesUrl, options */) => {

	var options = {
		method: 'POST',
		url: 'https://api.opensubtitles.com/api/v1/download',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmMzJPZEVUMTNQeHpZRlZMcWNNb0xKVzQ1WVhSZ2xSRCIsImV4cCI6MTY2NTA3NjEyN30.ZgOJOmt6eJJvH2oiNh6BV7uQEXSjVfa1AHMyI_X3xtE'
		},
		data: {file_id: 4499311}
	};
	
	axios.request(options).then(function (response) {
		console.log(response.data);
	}).catch(function (error) {
		console.error(error);
	});

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

const parseSubtitleInfo = async (subs, imdb_code) => {
	//2. check if movie exists in the db.
	const movie = await pool.query("SELECT * FROM movies WHERE imdb_code = $1", [
		imdb_code
	]);

	// if movie does not exist, then throw error
	if (movie.rows.length === 0) {
		console.error('No such movie.');
	}
	console.log(movie.rows[0]);
	let filename = movie.rows[0].server_location.replace(/^.*[\\\/]/, '').slice(0, -4);
	console.log(`Filename: ${filename}`);
	let results = [];
	subs.forEach((sub) => {
		//console.log(sub.attributes.language);
		//console.log(sub.attributes.release);
		if (sub.attributes.release === filename) {
			console.log(sub.attributes.files);
			results.push(sub);
		}
	})
	console.log('Results:');
	console.log(results);

	// Subtitles download only works with fetch?
	let url = 'https://api.opensubtitles.com/api/v1/download';
	let options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Api-Key': 'p8v7XyDIIBm6M8jJnR6nHuu2U7d3G6H2'
		},
		body: '{"file_id":4499311}'
	};
	
	fetch(url, options)
		.then(res => res.json())
		.then(json => console.log(json))
		.catch(err => console.error('error:' + err));
  /* if (
    res &&
    res.data &&
    res.data.data &&
    res.data.data.movies &&
    res.data.data.movies[0]
  ) {
    return {
      Title: res.data.data.movies[0].title || "",
      imdbRating: res.data.data.movies[0].rating || "",
      Year: res.data.data.movies[0].year || "",
      Genre:
        (res.data.data.movies[0].genres &&
          res.data.data.movies[0].genres.join(", ")) ||
        "",
      Plot: res.data.data.movies[0].description_full || "",
      Runtime: "",
      Director: "",
      Actors: "",
    };
  }
  console.log("Error!"); */
};

/* const searchSubtitles = async (imdbCode) => {

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
} */

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
		console.log('This crap works until here.');

		var options_req = {
			method: 'GET',
			url: `https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdb_code}?languages=en,fr,sq`,
			headers: {'Content-Type': 'application/json', 'Api-Key': 'p8v7XyDIIBm6M8jJnR6nHuu2U7d3G6H2'}
		};
		console.log(options_req);

	
		await axios.request(options_req).then(function (response) {
			console.log('Logging data:');
			console.log(response.data);
			console.log(response.data.data.length);
			/*let results = [];
			 response.data.data.forEach((sub) => {
				//console.log(sub.attributes.language);
				//console.log(sub.attributes.release);
				if (sub.attributes.language === 'en') {
					results.push(sub);
				}
			} )*/
		
			//console.log(`Results after filtering: ${results.length}`);
			const data = parseSubtitleInfo(response.data.data, imdb_code);
		//const searchResult = await searchSubtitles(imdb_code);
		
		//console.log('Logging results:');
		
		/* results.foreach((result) => {
			console.log('Another subtitle:');
			console.log(result);
		}) */
		})
		/* ({
			sublanguageid: "eng, fin, ger, rus",
			extensions: ["srt", "vtt"],
			imdb_code: imdb_code,
			limit: 1,
		});  */
		/* const promises = [];
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
		subtitles = result.filter((r) => !!r);
		console.log(subtitles);
    return subtitles; */
  } catch (err) {
    return [];
  }
};

export default { getSubtitles };
