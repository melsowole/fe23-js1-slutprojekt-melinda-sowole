const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = `&api_key=7f1175b36bcc5bf2000e124d101b28e2`;

export let genres = [];

async function setGenres() {
	const tvGenres = `https://api.themoviedb.org/3/genre/tv/list?language=en`;
	const movieGenres = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
	const responseAll = await promiseAll(fetch(tvGenres), fetch(movieGenres));
	const allData = await promiseAll(
		responseAll.map((response) => response.json())
	);

	console.log(allData);
}

export function topMovies(type) {
	if (genres == []) {
		setGenres();
	}
	//type == popular or top_rated
	const ENDPOINT = `/movie/${type}?language=en-US&limit=10`;

	return BASE_URL + ENDPOINT + API_KEY;
}

export function searchAPI({ type, query }) {
	if (genres == []) {
		setGenres();
	}

	const ENDPOINT = `/search/${type}`; // movie || person || TV || keyword

	const QUERY = `?query=${query}`;

	const FILTERS =
		type == "keyword" ? "" : "&include_adult=false&language=en-US";

	return BASE_URL + ENDPOINT + QUERY + FILTERS + API_KEY;
}
