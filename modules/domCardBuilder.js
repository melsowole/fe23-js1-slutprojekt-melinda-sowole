// functions that display information
// * "film" is used for both movies and tv
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

function createCard(film) {
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
	const { card, cardImg, cardTitle, cardBody, cardSubtitle } = createCard(film);

	setCardImg(cardImg, film.cover);

	setCardTitle(cardTitle, film.name);
	setCardSubtitle(cardSubtitle, "(" + film.release + ")");

	if (extend) {
		flexCardOnWideScreen(cardImg, cardBody);

		const overview = dom.create("p", "overview", film.description);
		addToCardBody(cardBody, overview);
	}

	return !extend ? card : { card, cardImg, cardBody };
}

function createFilmCardExtendedInfo(film) {
	const { card, cardImg, cardBody } = createFilmCard(film, "extend");

	card.querySelectorAll("p");

	return card;
}

function createPersonCard(person) {
	const { card, cardImg, cardTitle, cardBody, cardSubtitle } =
		createCard(person);

	setCardImg(cardImg, person.img, "original");

	setCardTitle(cardTitle, person.name);
	setCardSubtitle(cardSubtitle, "(" + person.role + ")");

	flexCardOnWideScreen(cardImg, cardBody);

	const knownWorks = dom.create("div", "works");
	addToCardBody(cardBody, knownWorks);

	for (const work of person.known_for) {
		const text = `(${work.type}) ${work.title}`;
		const p = dom.createAndAppend(knownWorks, "p", "work", text);

		p.addEventListener("click", () => {
			createModal(work);
		});
	}

	return card;
}

async function createModal(filmShortInfo) {
	const data = await api.fetchDetails({
		type: filmShortInfo.type,
		id: filmShortInfo.id,
	});

	const filmDetails = unifyData(data);

	const modal = dom.create("div", "modal");
	modal.addEventListener("click", removeModal);
	modal.setAttribute("tabindex", "-1");
	modal.setAttribute("role", "dialog");
	document.body.prepend(modal);

	const dialog = dom.createAndAppend(modal, "div", "modal-dialog");
	dialog.setAttribute("role", "document");

	const content = dom.createAndAppend(dialog, "div", "modal-content");

	const modalHeader = dom.createAndAppend(content, "header", "modal-header");
	const title = dom.createAndAppend(modalHeader, "h3", "modal-title");
	const btnClose = dom.createAndAppend(modalHeader, "button", [
		"btn-close",
		"me-0",
	]);

	btnClose.setAttribute("aria-label", "Close");
	btnClose.setAttribute("data-dismiss", "modal");
	btnClose.addEventListener("click", removeModal);

	const card = createFilmCardExtendedInfo(filmDetails);
	const cardImg = card.querySelector(".cover");
	const cardBody = card.querySelector(".card-body");
	unflexCardOnWideScreen(cardImg, cardBody);

	card.classList.remove("row");

	content.append(card);

	function removeModal(e) {
		e.stopPropagation();
		modal.remove();
	}
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

function addToCardBody(cardBody, element) {
	cardBody.append(element);
	element.classList.add("list-group-item");
}

function flexCardOnWideScreen(cardImg, cardBody) {
	cardImg.classList.add("col-md-5", "col-lg-3", "rounded-start");
	cardBody.classList.add("col-md-7");
}

function unflexCardOnWideScreen(cardImg, cardBody) {
	cardImg.classList.remove("col-md-5", "col-lg-3", "rounded-start");
	cardBody.classList.remove("col-md-7");
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

function getReleaseYear(year) {
	return year.split("-")[0];
}

// returns object with more streamlined keys
// across actor, movie and tv results
function unifyData(data) {
	let unifiedData = {
		type: "movie",
		id: data.id,
		name: data.title,
		release: data.release_date,
		cover: data.poster_path || data.backdrop_path,
		description: data.overview,
	};

	if ("first_air_date" in data) {
		unifiedData.type = "tv";
		unifiedData.name = data.name;
		unifiedData.release = data.first_air_date;
	}

	unifiedData.release = unifiedData.release
		? getReleaseYear(unifiedData.release)
		: "";

	// if no release
	unifiedData.release = unifiedData.release == "" ? "—" : unifiedData.release;

	if (data.known_for) {
		unifiedData = {
			type: "person",
			name: data.name,
			role: data.known_for_department,
			known_for: data.known_for.map((work) => {
				return {
					type: work.media_type,
					title: work.title || work.name,
					id: work.id,
				};
			}),
			img: data.profile_path,
		};
	}

	return unifiedData;
}

function resultsArePeople(results) {
	return "gender" in results[0];
}

function setText(container, text) {
	container.textContent = text;
}
