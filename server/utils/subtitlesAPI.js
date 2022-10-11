import fs from "fs";
import axios from "axios";
import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util'
import fetch from 'node-fetch';

const downloadSubtitles = async ({language, file_id}, imb_code ) => {
	let subtitles_results = [];
	let downloadLink;
	let url = 'https://api.opensubtitles.com/api/v1/download';
	let options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Api-Key': process.env.SUBTITLES_API_KEY
		},
		body: `{
			"file_id":${file_id},
		"sub_format": "webvtt"
	}`//4499311
	};

	
	const streamPipeline = promisify(pipeline);

	const link = await fetch(url, options)
			.then(res => res.json())
			.then(json => {
				
				downloadLink = json.link;
				console.log('Link:', downloadLink);
				return json.link;
			}) 
	.catch(err => console.error('error:' + err));
	const response = await fetch(link);
	fs.mkdirSync(`./subtitles/${imb_code}/${language}/`, { recursive: true });
	await streamPipeline(response.body, createWriteStream(`./subtitles/${imb_code}/${language}/subtitle.vtt`))
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
        lang: "sv",
        dir: `${parentDir}/sv`,
      },
      {
        lang: "fi",
        dir: `${parentDir}/fi`,
      },
			{
        lang: "bn",
        dir: `${parentDir}/bn`,
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
			let search_result = [];
      var options_req = {
				method: 'GET',
				url: `https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdb_code}&languages=en,fi,sv,bn`,
				headers: {'Content-Type': 'application/json', 'Api-Key': 'p8v7XyDIIBm6M8jJnR6nHuu2U7d3G6H2'}
			};
			await axios.request(options_req).then(function (response) {
				search_result = response.data.data;
			})

			let filtered = search_result.filter(function(result) {
				if (!this[result.attributes.language]) {
					this[result.attributes.language] = true;
					return true;
				}
				return false;
			}, Object.create(null));
			let subs_to_download = [];
			filtered.forEach((sub) => {
				let subObj = {};
				subObj.language = sub.attributes.language;
				subObj.file_id = sub.attributes.files[0].file_id;
				subs_to_download.push(subObj);
			})
			
      const promises = [];
      subs_to_download.forEach((sub) => {
          promises.push(downloadSubtitles(sub, imdb_code));
        });
				subs_to_download.forEach((sub) => {
          subtitles.push(sub.language);
        });
				console.log(subtitles);
    }
		
    return subtitles; 
  } catch (err) {
    return [];
  }
};

export default { getSubtitles };
