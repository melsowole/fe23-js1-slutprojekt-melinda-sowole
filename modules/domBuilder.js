// function that display information
// * "movie" is used for both movies and tv
import { dom } from "./domUtils.js";
import { api } from "./api.js";

export const display = { resultList, topTenList, errorMessage };

// DISPLAY FUNCTIONS
function resultList(parentID, results) {
	const parent = clearAndSetParent(parentID);

	// create list
	const listName = `${results.length} Result${results.length == 1 ? "" : "s"}`;

	const { listSection, list } = createListSection(listName);
	parent.append(listSection);

	let cardType = createFilmCardExtendedInfo;
	if (resultsArePeople(results)) {
		cardType = createPersonCard;
	}

	fillList(list, results, cardType);

	const cards = listSection.querySelectorAll(".card");

	//sets columns
	list.classList.add("row-cols-1");

	cards.forEach((card) => {
		card.classList.add("flex-row");
	});
}

function topTenList(parentID, listName, results) {
	const parent = clearAndSetParent(parentID);

	const { listSection, list } = createListSection(listName);
	parent.append(listSection);

	listSection.classList.add("top-list");

	const topTen = results.slice(0, 10);

	fillList(list, topTen, createFilmCard);

	// sets columns
	list.classList.add(
		"row-cols-1",
		"row-cols-md-2",
		"row-cols-lg-3",
		"row-cols-xxl-4"
	);
}

function errorMessage(errorType, errorMessage) {
	const parent = clearAndSetParent("#results");

	const errorContainer = dom.createAndAppend(parent, "section", "error");

	dom.createAndAppend(errorContainer, "h2", "error-type", errorType);
	dom.createAndAppend(errorContainer, "p", "error-heading", errorMessage);
}

// COMPONENTS

function fillList(list, items, cardType) {
	for (let item of items) {
		item = unifyData(item);
		// keys (film): name, release, cover, description
		// keys person: name, role, img, known_for

		const listItem = dom.createAndAppend(list, "li", "col");

		listItem.append(cardType(item));
		list.append(listItem);
	}
}

function createListSection(listName) {
	const listSection = dom.create("section", "container");

	const listHeading = createListHeading();
	listHeading.textContent = listName;

	const list = createList();

	listSection.append(listHeading, list);

	return { listSection, list };
}

function createListHeading() {
	return dom.create("h2", "list-heading");
}

function createList() {
	return dom.create("ol", ["list", "row", "g-5", "row-cols"]);
}

function createCard() {
	//h-100 makes all card equal heihght
	const card = dom.create("article", ["row", "card", "h-100"]);

	//img, title (year), genre
	const cardImg = dom.createAndAppend(card, "div", [
		"cover",
		"card-img-start",
		"col-fluid",
	]);

	const cardBody = dom.createAndAppend(card, "div", [
		"card-body",
		"list-group",
		"list-group-flush",
		"col-auto",
	]);

	const cardTitleWrapper = dom.createAndAppend(cardBody, "header", [
		"card-title-wrapper",
		"list-group-item",
	]);

	const cardTitle = dom.createAndAppend(cardTitleWrapper, "h3", [
		"card-title",
		"fs-5",
		"d-inline",
	]);

	const cardSubtitle = dom.createAndAppend(cardTitleWrapper, "span", [
		"card-subtitle",
		"ms-2",
	]);

	return { card, cardImg, cardBody, cardTitle, cardSubtitle };
}

function createFilmCard(film, extend) {
	const { card, cardImg, cardTitle, cardBody, cardSubtitle } = createCard();

	setCardImg(cardImg, film.cover);

	setCardTitle(cardTitle, film.name);
	setCardSubtitle(cardSubtitle, "(" + getReleaseYear() + ")");

	if (extend) {
		flexCardOnWideScreen(cardImg, cardBody);

		addToCardBody(cardBody, film.description);
	}

	return !extend ? card : { card, cardImg, cardBody };

	function getReleaseYear() {
		return film.release.split("-")[0];
	}
}

function createFilmCardExtendedInfo(film) {
	const { card, cardImg, cardBody } = createFilmCard(film, "extend");

	return card;
}

function createPersonCard(person) {
	const { card, cardImg, cardTitle, cardBody, cardSubtitle } = createCard();

	setCardImg(cardImg, person.img, "original");

	setCardTitle(cardTitle, person.name);
	setCardSubtitle(cardSubtitle, "(" + person.role + ")");

	flexCardOnWideScreen(cardImg, cardBody);

	let knownFor = [];
	for (const work of person.known_for) {
		knownFor.push(`(${work.type}) ${work.title}`);
	}

	addToCardBody(cardBody, knownFor);

	return card;
}

// HELPER FUNCTIONS
function clearAndSetParent(parentID) {
	const parent = document.querySelector(parentID);
	clearContainer(parent);

	return parent;
}

function clearContainer(container) {
	container.innerHTML = "";
}

// returns object with more streamlined keys
// across actor, movie and tv results
function unifyData(resultObj) {
	let unifiedObj = {
		name: resultObj.title,
		release: resultObj.release_date,
		cover: resultObj.poster_path || resultObj.backdrop_path,
		description: resultObj.overview,
	};

	// if show
	if ("first_air_date" in resultObj) {
		unifiedObj.name = resultObj.name;
		unifiedObj.release = resultObj.first_air_date;
	}

	// if no release
	unifiedObj.release = unifiedObj.release == "" ? "—" : unifiedObj.release;

	//if person
	if (resultObj.known_for) {
		unifiedObj = {
			name: resultObj.name,
			role: resultObj.known_for_department,
			known_for: resultObj.known_for.map((work) => {
				return { type: work.media_type, title: work.title };
			}),
			img: resultObj.profile_path,
		};
	}

	return unifiedObj;
}

function resultsArePeople(results) {
	return "gender" in results[0];
}

function setText(container, text) {
	container.textContent = text;
}

// CUSTOMIZE CARD
function setCardTitle(cardTitle, titleText) {
	setText(cardTitle, titleText);
}

function setCardSubtitle(cardSubtitle, subtitleText) {
	setText(cardSubtitle, subtitleText);
}

function setCardImg(cardImg, path, size) {
	let baseURL = `https://image.tmdb.org/t/p`;
	size = size == "original" ? "/original" : "/w780";

	let url = baseURL + size + path;

	if (!path) {
		url =
			"https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.coalitionrc.com%2Fwp-content%2Fuploads%2F2017%2F01%2Fplaceholder.jpg&f=1&nofb=1&ipt=93da5d83fd7c91d546941082e263776f49b0549c076c30e24b8af3d0de6dc7f3&ipo=images";
	}

	cardImg.style.backgroundImage = `url(${url})`;
}

function addToCardBody(cardBody, info) {
	const addition = dom.createAndAppend(
		cardBody,
		"p",
		["description", "list-group-item"],
		info
	);
}

function flexCardOnWideScreen(cardImg, cardBody) {
	cardImg.classList.add("col-md-5", "col-lg-3", "rounded-start");
	cardBody.classList.add("col-md-7");
}
