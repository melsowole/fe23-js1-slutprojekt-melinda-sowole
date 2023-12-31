import { api } from "./api.js";
import { display } from "./domCardBuilder.js";

export function displayPopularMovies() {
	api.fetchPopularMovies().then((shows) => {
		display.topTenList("#popular", "Current Popular Movies", shows);
	});
}

export function displayTopRatedMovies() {
	api.fetchTopRatedMovies().then((movies) => {
		display.topTenList("#top-rated", "Top Rated Movies", movies);
	});
}
