import { createAndAppend, create } from "./helperFunctions.js";

function createListSection(heading, array, type) {
	const listSection = create("section");

	createAndAppend(movieCardSection, "h2", "list-heading", heading);

	const list = createAndAppend(listSection, type, ["list", "row"]);

	for (const item of array) {
		if (type == "top") list.append(createMovieCardItem(movie));
	}
}

function createMovieCard(movie) {
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

function createMovieResultCard(movie) {}

function createPersonResultCard(person) {}
