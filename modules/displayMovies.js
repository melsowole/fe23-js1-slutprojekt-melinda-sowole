import { createAndAppend, create } from "./helperFunctions.js";

export function createMovieListSection(listHeading, moviesArray) {
	const movieListSection = create("section");

	createAndAppend(movieListSection, "h2", "list-heading", listHeading);

	const list = createAndAppend(movieListSection, "ol", ["movie-list", "row"]);

	for (const movie of moviesArray) {
		list.append(createMovieListItem(movie));
	}

	return movieListSection;
}

function createMovieListItem(movieInfo) {
	const listItem = create("li", ["list-item", "col"]);
	console.log(movieInfo);

	listItem.append(movieCard(movieInfo));

	return listItem;
}

function movieCard(movie) {
	const card = create("article", ["movie-card", "card"]);

	//img, title (year), genre
	const img = createAndAppend(card, "div", ["cover", "card-img-top"]);
	img.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
	// img.width = 100;

	const cardBody = createAndAppend(card, "div", "card-body");

	createAndAppend(cardBody, "h3", ["card-title", "fs-5"], movie.title);

	createAndAppend(
		cardBody,
		"span",
		["release", "card-subtitle"],
		getReleaseYear()
	);

	return card;

	function getReleaseYear() {
		return movie.release_date.split("-")[0];
	}
}
