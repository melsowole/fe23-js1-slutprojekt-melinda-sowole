//Handles communication with The Movies DataBase API
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = `&api_key=7f1175b36bcc5bf2000e124d101b28e2`;

export const api = {
	fetchSearch,
	fetchTopRatedMovies,
	fetchPopularMovies,
};

// EXPORTED FUNCTIONS
async function fetchSearch({ type, query }) {
	const ENDPOINT = `/search/${type}`; // movie || person || tv
	const QUERY = `?query=${formatQueryString(query)}`;
	const FILTERS = "&include_adult=false&language=en-US";

	const url = BASE_URL + ENDPOINT + QUERY + FILTERS + API_KEY;

	return fetchData(url);
}

async function fetchTopRatedMovies() {
	const url = getMovieListURL("top_rated");

	return fetchData(url);
}

async function fetchPopularMovies() {
	const url = getMovieListURL("popular");
	return fetchData(url);
}

// API

async function fetchData(url) {
	const response = await fetch(url);

	if (response.ok) {
		const data = await response.json();

		if (data.results && data.results.length) {
			return data.results;
		} else {
			throw 404;
		}
	} else {
		throw response.status;
	}
}

function getMovieListURL(type) {
	const ENDPOINT = `/movie/${type}?language=en-US&limit=10`;
	return BASE_URL + ENDPOINT + API_KEY;
}

function formatQueryString(string) {
	return string.replaceAll(" ", "%20");
}
