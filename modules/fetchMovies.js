const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = `&api_key=7f1175b36bcc5bf2000e124d101b28e2`;

export function topMovies(type) {
	//type == popular or top_rated
	const ENDPOINT = `/movie/${type}?language=en-US&limit=10`;

	return BASE_URL + ENDPOINT + API_KEY;
}

export function search({ type, query }) {
	const ENDPOINT = `/search/${type}`; // movie || person || TV || keyword

	const QUERY = `?query=${query}`;

	const FILTERS =
		SEARCH_TYPE == "keyword" ? "" : "&include_adult=false&language=en-US";

	return BASE_URL + ENDPOINT + QUERY + FILTERS + API_KEY;
}
