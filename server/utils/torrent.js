/*
* Place torrent stuff here.
*/
import fs from 'fs';
import torrentStream from 'torrent-stream';
import ffmpeg from 'fluent-ffmpeg';

import movieUtils from './movie.js';

// Save path to database.
const savePathToMovie = async ( movie , magnet, serverLocation, size) => {
	//console.log('In save path to movie.');
	//console.log('imdb_code.');
	//console.log(movie.imdb_code);
	//console.log('magnet.');
	//console.log(magnet);
	//console.log('serverLocation.');
	//console.log(serverLocation);
	//console.log('size.');
	//console.log(size);

  const updatedMovie = await movieUtils.updateMovie(movie.imdb_code, magnet, serverLocation, size);
	console.log('Return from update movie: ');
	console.log(updatedMovie);
  //if (!movie) {
    
  //}
};

const startFileStream = (req, res) => {
	let loaded = true;
	const {imdb_code, serverLocation, movieSize} = req;
	const path = `./movies/${serverLocation}`;
	const isMp4 = path.endsWith('mp4');
	const size = fs.statSync(path).movieSize;
	const { range } = req.headers;
	console.log(range);
	const CHUNK = 20e+6;
	let start = range ? Number(range.replace(/\D/g, '')) : 0;
	if (start < size - 1) {
		loaded = false;
		start = 0;
	}
	console.log('start');
	console.log(start);
	const end = isMp4 ? Math.min(start + CHUNK, movieSize - 1) : movieSize - 1;
	console.log('end = ');
	console.log(end);
	const movieLength = end - start + 1;
	const headers = isMp4
	? {
		'Content-Range': `bytes ${start}-${end}/${movieSize}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': movieLength,
		'Content-Type': 'video/mp4',
	}
	: {
		'Content-Range': `bytes ${start}-${end}/${movieSize}`,
		'Accept-Ranges': 'bytes',
		'Content-Type': 'video/webm',
	};
	console.log(headers);
	console.log(`loaded: ${loaded}`);
	const readStream = fs.createReadStream(path, {start, end});
	//console.log('Readstream: ');
	//console.log(readStream);
	if (loaded === false) {
		res.writeHead(416, headers);
	} else {
		res.writeHead(206, headers);
		//console.log('Headers:');
		//console.log()
	}
	if (isMp4) readStream.pipe(res);
	else {
		ffmpeg(readStream)
			.format('webm')
			.input('error', () => {})
			.pipe(res);
	}
};

const downloadMovie = async (movie, magnet, downloadCache) => new Promise((resolve) => {
	console.log('Movie in downloadMovie');
	console.log(movie);
	let path;
	let size = 0;
	const engine = torrentStream(magnet, {
		trackers: [
			'udp://oipen.demonii.com:1337/announce',
			'udp://tracker.openbittorrent.com:80',
			'udp://tracker.coppersurfer.tk:6969',
			'udp://tracker.opentrackr.org:1337/announce',
			'udp://torrent.gresille.org:80/announce',
			'udp://p4p.arenabg.com:1337',
			'udp://tracker.leechers-paradise.org:6969',
		],
		path: `./movies/${movie.imdb_code}`,
	});
	engine.on('torrent', () => {
		engine.files.forEach((file) => {
			if (file.name.endsWith('.mp4') || file.name.endsWith('.mkv')) {
				file.select();
				path = `${movie.imdb_code}/${file.path}`;
				size = file.length;
			} else {
				file.deselect();
			}
		});
		console.log('Path in download:');
		console.log(path);
		console.log(magnet);
		console.log(size);
		savePathToMovie(movie, magnet, path, size);
	});

	engine.on('download', () => {
		const pathToMovie = `./movies/${movie.imdb_code}/${path}`;
		if (fs.existsSync(pathToMovie) && !downloadCache.has(movie.imdb_code)) {
			if (fs.statSync(pathToMovie).size / (1024 * 1024) > 20) {
				obj = { downloading: true };
				downloadCache.set(movie.imdb_code, obj);
				console.log(`Download cache has movie? Answer: ${downloadCache.has(movie.imdb_code)}`);
				resolve;
			}
		}
	});

	engine.on('idle', () => {
		console.log('Finished downloading movie ', movie.imdb_code);
		//setMovieAsCompleted(movie.imdbID); // Add this.
		movieUtils.setMovieAsDownloaded(movie.imdb_code);
		downloadCache.del(movie.imdb_code);
		//console.log(downloadCache);
		engine.destroy();
	});
});

const getMagnetLink = async (imdbID) => {
	console.log('In get magnet link.');
	console.log('ImbdID: ');
	console.log(imdbID);
	try {
		const torrentData = await movieUtils.getTorrentData(imdbID);
		return torrentData;
	} catch (e) {
		console.log('getMagnetLink Error!');
		console.log(e);
	}
}

export default {
	startFileStream,
	downloadMovie,
	getMagnetLink,
};