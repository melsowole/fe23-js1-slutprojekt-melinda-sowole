import { handleError } from "./errorHandler.js";

//Handles communication with The Movies DataBase API
const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = `&api_key=7f1175b36bcc5bf2000e124d101b28e2`;

export const api = {
	fetchSearch,
	fetchTopMovies,
	fetchPopularMovies,
	getRequestType,
};

function fetchSearch({ type, query }) {
	const ENDPOINT = `/search/${type}`; // movie || person || tv
	const QUERY = `?query=${formatQueryString(query)}`;
	const FILTERS = "&include_adult=false&language=en-US";

	const url = BASE_URL + ENDPOINT + QUERY + FILTERS + API_KEY;

	return fetchAPI(url);
}

function fetchTopMovies() {
	const url = getMovieList("top_rated");

	return fetchAPI(url);
}

function fetchPopularMovies() {
	const url = getMovieList("popular");

	return fetchAPI(url);
}

function getMovieList(type) {
	const ENDPOINT = `/movie/${type}?language=en-US&limit=10`;
	return BASE_URL + ENDPOINT + API_KEY;
}

async function fetchAPI(url) {
	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.results && data.results.length) {
			return { results: data.results, url };
		} else {
			throw 404;
		}
	} catch (error) {
		handleError(error);
	}
}

function formatQueryString(string) {
	return string.replaceAll(" ", "%20");
}

function getRequestType(url) {
	const requestType = url.split("/").pop().split("?")[0];

	return requestType ? requestType : false;
}
