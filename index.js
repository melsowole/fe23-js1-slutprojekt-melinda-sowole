import { search, topMovies } from "./modules/fetchMovies.js";
import { createMovieListSection } from "./modules/displayMovies.js";
import { getFirstTenItems } from "./modules/helperFunctions.js";

console.log(topMovies("popular"));
fetch(topMovies("popular"))
	.then((response) => response.json())
	.then((data) => {
		const movies = getFirstTenItems(data.results);
		document
			.querySelector("main")
			.append(createMovieListSection("Most Popular Movies", movies));
	});

fetch(topMovies("top_rated"))
	.then((response) => response.json())
	.then((data) => {
		const movies = getFirstTenItems(data.results);

		document
			.querySelector("main")
			.append(createMovieListSection("Top Rated Movies", movies));
	});
