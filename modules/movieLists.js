import { api } from "./api.js";
import { display } from "./domBuilder.js";

export function displayPopularMovies() {
	api.fetchPopularMovies().then((shows) => {
		display.topTenList("#popular", "Most Popular Movies", shows);
	});
}

export function displayTopRatedMovies() {
	api.fetchTopRatedMovies().then((movies) => {
		display.topTenList("#top-rated", "Top Rated Movies", movies);
	});
}
