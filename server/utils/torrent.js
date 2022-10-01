/*
* Place torrent stuff here.
*/
import fs from 'fs';
import torrentStream from 'torrent-stream';
import ffmpeg from 'fluent-ffmpeg';

import movieUtils from './movie.js';

// Save path to database.
const savePathToMovie = async ({ imdbCode }, magnet, serverLocation, size) => {
	console.log('In save path to movie.');
  const movie = await movieUtils.updateMovie(imdbCode, magnet, serverLocation, size);
	console.log('Return from update movie: ');
	console.log(movie);
  //if (!movie) {
    
  //}
};

const startFileStream = (req, res) => {
	let loaded = true
	const path = `./movies/${req.params.imdbID}/${req.serverPath}`;
	const isMp4 = path.endsWith('mp4');
	const size = fs.startSync(path).size;
	const { range } = req.headers;
	const CHUNK = 20e+6;
	let start = range ? Number(range.rplace(/\D/g, '')) : 0;
	if (start < size - 1) {
		loaded = false;
		start = 0;
	}
	const end = isMp4 ? Math.min(start + CHUNK, size - 1) : size - 1;
	const movieLength = end - start + 1;
	const headers = isMp4
	? {
		'Content-Range': `bytes ${start}-${end}/${req.movieSize}`,
		'Accept-Ranges': 'bytes',
		'Content-Length': movieLength,
		'Content-Type': 'video/mp4',
	}
	: {
		'Content-Range': `bytes ${start}-${end}/${req.movieSize}`,
		'Accept-Ranges': 'bytes',
		'Content-Type': 'video/webm',
	};
	if (loaded === false) {
		res.writeHead(416, headers);
	} else {
		res.writeHead(206, headers);
	}
	const readStream = fs.createReadStream(path, {start, end});
	if (isMp4) readStream.pipe(res);
	else {
		ffmpeg(readStream)
			.format('webm')
			.input('error', () => {})
			.pipe(res);
	}
};

const downloadMovie = async (movie, magnet, downloadCache) => new Promise((resolve) => {
	console.log('In torrent.downloadmovie.');
	console.log(magnet);
	console.log(movie);
	//console.log(downloadCache);
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
		path: `./movies/${movie.imdbCode}`,
	});
	engine.on('torrent', () => {
		engine.files.forEach((file) => {
			if (file.name.endsWith('.mp4') || file.name.endsWith('.mkv')) {
				file.select();
				path = `${movie.imdbCode}/${file.path}`;
				size = file.length;
			} else {
				file.deselect();
			}
		});
		console.log(path);
		savePathToMovie(movie, magnet, path, size);
	});

	engine.on('download', () => {
		const pathToMovie = `./movies/${movie.imdbCode}/${path}`;
		if (fs.existsSync(pathToMovie) && !downloadCache.has(movie.imdbCode)) {
			if (fs.statSync(pathToMovie).size / (1024 * 1024) > 20) {
				obj = { downloading: true };
				downloadCache.set(movie.imdbCode, obj);
				console.log(`Download cache has movie? Answer: ${downloadCache.has(movie.imdbCode)}`);
				resolve;
			}
		}
	});

	engine.on('idle', () => {
		console.log('Finished downnloading movie ', movie.imdbCode);
		//setMovieAsCompleted(movie.imdbID); // Add this.
		movieUtils.setMovieAsDownloaded(movie.imdbCode);
		downloadCache.del(movie.imdbCode);
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