// function that display information
// * "movie" is used for both movies and tv
import { DOM } from "./domUtils.js";
import { api } from "./api.js";

export const display = { listSection, errorMessage };

export function listSection(parentID, listHeading, apiResponse) {
	const parent = document.querySelector(parentID);
	console.log(parent);

	clearResults(parent);

	const results = apiResponse.results;
	const requestType = api.getRequestType(apiResponse.url);

	const listContainer = DOM.createAndAppend(parent, "section");

	DOM.createAndAppend(listContainer, "h2", "list-heading", listHeading);

	const list = DOM.createAndAppend(listContainer, "ol", [
		"list",
		"row",
		"g-4",
		"card-deck",
	]);

	for (let result of results) {
		const listItem = DOM.createAndAppend(list, "li", ["col-auto"]);

		result = unifyData(result, requestType);

		listItem.append(filmCard(result, requestType));
	}
}

function filmCard({ title, release, cover, description }, requestType) {
	const card = DOM.create("article", [
		"movie-card",
		"card",
		"row",
		"flex-md-row",
	]);

	//img, title (year), genre
	const img = DOM.createAndAppend(card, "div", [
		"cover",
		"card-img-start",
		`col-${requestType ? "md-4" : "auto"}`,
	]);

	img.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${cover})`;
	// img.width = 100;

	const cardBody = DOM.createAndAppend(card, "div", [
		"card-body",
		`col-${requestType ? "md-4" : "auto"}`,
	]);

	DOM.createAndAppend(cardBody, "h3", ["card-title", "fs-5"], title);

	DOM.createAndAppend(
		cardBody,
		"span",
		["release", "card-subtitle"],
		getReleaseYear()
	);

	if (requestType) {
		DOM.createAndAppend(cardBody, "p", "description", description);
	}

	return card;

	function getReleaseYear() {
		return release.split("-")[0];
	}
}

function personCard() {}

function errorMessage(errorType, errorMessage) {
	clearResults();

	const errorContainer = DOM.createAndAppend(
		resultsContainer,
		"section",
		"error"
	);

	DOM.createAndAppend(errorContainer, "h2", "error-type", errorType);
	DOM.createAndAppend(errorContainer, "p", "error-heading", errorMessage);
}

function clearResults(container) {
	container.innerHTML = "";
}

// returns object with more streamlined keys
// across actor, movie and tv results
function unifyData(arrayObj, apiSearchType) {
	let unifiedObj = {
		name: arrayObj.title,
		release: arrayObj.release_date,
		cover: arrayObj.poster_path,
		description: arrayObj.overview,
	};

	if (apiSearchType == "tv") {
		unifiedObj.name = arrayObj.name;
		unifiedObj.release = arrayObj.first_air_date;
	}

	if (apiSearchType == "person") {
		unifiedObj = {
			name: arrayObj.name,
			role: arrayObj.known_for_department,
			known_for: arrayObj.known_for.map((work) => {
				return { type: work.media_type, title: work.title };
			}),
			img: arrayObj.profile_path,
		};
	}

	return unifiedObj;
}
