//Handles communication with The Movies DataBase API
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = `&api_key=7f1175b36bcc5bf2000e124d101b28e2`;

export const api = {
	fetchSearch,
	fetchTopRatedMovies,
	fetchPopularMovies,
};

async function fetchSearch({ type, query }) {
	const ENDPOINT = `/search/${type}`; // movie || person || tv
	const QUERY = `?query=${formatQueryString(query)}`;
	const FILTERS = "&include_adult=false&language=en-US";

	const url = BASE_URL + ENDPOINT + QUERY + FILTERS + API_KEY;

	console.log(url);

	try {
		const data = await fetchAPI(url);
		return data.results;
	} catch (error) {
		throw error;
	}
}

async function fetchTopRatedMovies() {
	const url = getMovieListURL("top_rated");

	try {
		const data = await fetchAPI(url);
		return data.results;
	} catch (error) {
		throw error;
	}
}

async function fetchPopularMovies() {
	const url = getMovieListURL("popular");

	try {
		const data = await fetchAPI(url);
		return data.results;
	} catch (error) {
		throw error;
	}
}

function getMovieListURL(type) {
	const ENDPOINT = `/movie/${type}?language=en-US&limit=10`;
	return BASE_URL + ENDPOINT + API_KEY;
}

async function fetchAPI(url) {
	const response = await fetch(url);

	if (response.ok) {
		const data = await response.json();

		if (data.results && data.results.length) {
			return data;
		} else {
			throw 404;
		}
	} else {
		throw response.status;
	}
}

function formatQueryString(string) {
	return string.replaceAll(" ", "%20");
}
