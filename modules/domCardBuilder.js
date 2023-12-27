// functions that display information
// * "film" is used for both movies and tv
import { dom } from "./domUtils.js";
import { api } from "./api.js";
import anime from "../lib/anime.es.js";

export const display = { resultList, topTenList, errorMessage };

// DISPLAY FUNCTIONS
function resultList(parentID, results) {
	const parent = clearAndSetParent(parentID);

	const listName = `${results.length} Result${results.length == 1 ? "" : "s"}`;

	const { listSection, list } = createListSection(listName);
	parent.append(listSection);

	let cardType = createFilmCardExtendedInfo;
	if (getFetchType(results) == "person") {
		cardType = createPersonCard;
	}

	fillList(list, results, cardType);

	//sets columns
	list.classList.add("row-cols-1");
	const cards = listSection.querySelectorAll(".card");
	// cards.forEach((card) => {
	// 	card.classList.add("flex-row");
	// });
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
async function fillList(list, items, cardType) {
	const itemsType = getFetchType(items);

	for (let item of items) {
		const itemIsFilm = itemsType !== "person";

		if (itemIsFilm) {
			item = await api.fetchDetails({ type: itemsType, id: item.id });
		}
		item = unifyData(item, itemsType);
		// keys (film): name, release, cover, description
		// keys person: name, role, img, known_for

		const listItem = dom.createAndAppend(list, "li", "col");

		const card = cardType(item);

		listItem.append(card);
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
	let card = dom.create("article", ["row", "card", "h-100", "flex-row"]);

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

	// animation on hover of clickables
	let wrapper;
	if (film.homepage) {
		wrapper = dom.create("a", ["redirect"]);
		wrapper.href = film.homepage;
		wrapper.target = "_blank";

		// .closest() is parent
		if (card.closest(".modal-content") !== null) {
			card.addEventListener("mouseover", () => {
				anime({
					targets: card,
					scale: 1.03,
				});

				anime({
					targets: card.querySelector(".watch-film"),
					backgroundColor: "#fff",
				});
			});

			card.addEventListener("mouseout", () => {
				anime({
					targets: card,
					scale: 1,
				});

				anime({
					targets: card.querySelector(".watch-film"),
					backgroundColor: "#ffc107", // bootstrap bg-warning
				});
			});
		}

		wrapper.append(card);
	}

	return {
		card,
		wrapper,
		cardImg,
		cardBody,
		cardTitle,
		cardSubtitle,
	};
}

function createFilmCard(film, extend) {
	const { wrapper, card, cardImg, cardTitle, cardBody, cardSubtitle } =
		createCard(film);

	setCardImg(cardImg, film.cover);

	cardImg.classList.add(
		"d-flex",
		"flex-column-reverse",
		"justify-content-between",
		"p-3"
	);

	const genres = dom.createAndAppend(cardImg, "div", [
		"d-flex",
		"justify-self-end",
		"flex-wrap-reverse",
		"align-items-start",
		"MY-align-content-start",
		"justify-content-end",
		"gap-2",
	]);

	for (const genre of film.genres) {
		dom.createAndAppend(genres, "span", ["badge", "bg-secondary"], genre);
	}

	if (film.homepage) {
		dom.createAndAppend(
			cardImg,
			"span",
			["watch-film", "bg-warning", "badge", "align-self-end", "fs-6"],
			"Watch Film"
		);
	}

	setCardTitle(cardTitle, film.name);
	setCardSubtitle(cardSubtitle, "(" + film.release + ")");

	if (extend) {
		flexCardOnWideScreen(cardImg, cardBody);

		const overview = dom.create("p", "overview", film.description);
		addToCardBody(cardBody, overview);
	}

	return !extend
		? wrapper
			? wrapper
			: card
		: { wrapper, card, cardImg, cardBody };
}

function createFilmCardExtendedInfo(film) {
	const { wrapper, card } = createFilmCard(film, "extend");

	return wrapper ? wrapper : card;
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
			createFilmModal({ id: work.id, type: work.type });
		});
	}

	return card;
}

async function createFilmModal({ id, type }) {
	let filmInfo = await api.fetchDetails({ id, type });
	filmInfo = unifyData(filmInfo, type);

	const modal = dom.create("div", "modal");
	modal.addEventListener("click", removeModal);
	modal.setAttribute("tabindex", "-1");
	modal.setAttribute("role", "dialog");
	document.body.prepend(modal);

	const dialog = dom.createAndAppend(modal, "div", "modal-dialog");
	dialog.setAttribute("role", "document");

	const content = dom.createAndAppend(dialog, "div", "modal-content");

	const modalHeader = dom.createAndAppend(content, "header", [
		"modal-header",
		"py-0",
	]);

	const title = dom.createAndAppend(
		modalHeader,
		"h3",
		"modal-title",
		filmInfo.name + "(" + filmInfo.release + ")"
	);

	const btnClose = dom.createAndAppend(modalHeader, "button", [
		"btn-close",
		"me-0",
	]);

	btnClose.setAttribute("aria-label", "Close");
	btnClose.setAttribute("data-dismiss", "modal");
	btnClose.addEventListener("click", removeModal);

	let card = createFilmCardExtendedInfo(filmInfo);

	content.append(card);

	card = card.tagName == "A" ? card.querySelector("article") : card;

	// remove list specific styling
	card.classList.remove("row", "flex-row");
	const cardImg = card.querySelector(".cover");
	const cardBody = card.querySelector(".card-body");
	unflexCardOnWideScreen(cardImg, cardBody);

	if (filmInfo.tagline) {
		const cardTitle = card.querySelector(".card-title");
		cardTitle.remove();
		const cardSubtitle = card.querySelector(".card-subtitle");
		cardSubtitle.classList = "card-subtitle"; // removes previous card styling
		setCardSubtitle(cardSubtitle, filmInfo.tagline);
	} else {
		const cardHeader = card.querySelector("header");
		cardHeader.remove();
	}

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
function unifyData(data, itemsType) {
	console.log(data);

	let unifiedData = {
		type: itemsType,
		id: data.id,
		name: data.title,
		release: data.release_date,
		cover: data.poster_path || data.backdrop_path,
		description: data.overview,
		tagline: data.tagline,
		homepage: data.homepage,
	};

	if (itemsType !== "person") {
		unifiedData.genres = data.genres.map((genre) => genre.name);
	}

	if (itemsType == "tv") {
		unifiedData.name = data.name;
		unifiedData.release = data.first_air_date;
	}

	unifiedData.release = unifiedData.release
		? getReleaseYear(unifiedData.release)
		: "";

	// if no release
	unifiedData.release = unifiedData.release == "" ? "—" : unifiedData.release;

	if (itemsType == "person") {
		unifiedData = {
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

function getFetchType(results) {
	if ("title" in results[0]) {
		return "movie";
	} else if ("first_air_date" in results[0]) {
		return "tv";
	} else {
		return "person";
	}
}

function setText(container, text) {
	container.textContent = text;
}
