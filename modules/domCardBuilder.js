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

	fillList(list, results, true);

	//sets columns
	list.classList.add("row-cols-1");
	const cards = listSection.querySelectorAll(".card");
}

function topTenList(parentID, listName, results) {
	const parent = clearAndSetParent(parentID);

	const { listSection, list } = createListSection(listName);
	parent.append(listSection);

	listSection.classList.add("top-list");

	const topTen = results.slice(0, 10);

	fillList(list, topTen, false);

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

// INITIALIZATION
async function fillList(list, items, extend) {
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

		const card = createACard(item, extend);

		listItem.append(card);
		list.append(listItem);
	}
}

// COMPONENTS
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

function createACard(item, extend) {
	//item == film or person object

	const cardWrapper = createCardWrapper(item);

	const { card, cardImg, cardBody } = createCard(item, extend);
	cardWrapper.append(card);

	return cardWrapper;
}

async function createFilmModal({ id, type }) {
	let film = await api.fetchDetails({ id, type });
	film = unifyData(film, type);

	const { modalWrapper, modalContent } = createModal(film);
	document.body.prepend(modalWrapper);

	let card = createACard(film, true);
	modalContent.append(card);

	// select card within wrapper
	card = card.querySelector(".card");

	setModalCardStyling(card);

	if (film.info.tagline) {
		setModalTagline(film, card);
	} else {
		const cardHeader = card.querySelector("header");
		cardHeader.remove();
	}
}

// -- modal components and functions
function createModal(film) {
	const modalWrapper = dom.create("div", "modal");
	modalWrapper.addEventListener("click", removeModal);
	modalWrapper.setAttribute("tabindex", "-1");
	modalWrapper.setAttribute("role", "dialog");

	const modalDialog = dom.createAndAppend(modalWrapper, "div", "modal-dialog");
	modalDialog.setAttribute("role", "document");

	const modalContent = dom.createAndAppend(modalDialog, "div", "modal-content");

	const modalHeader = createModalHeader(modalContent);

	setModalTitle(modalHeader, film.info.name, film.info.release);

	return { modalWrapper, modalHeader, modalContent };
}

function createModalHeader(modalContent) {
	const modalHeader = dom.createAndAppend(modalContent, "header", [
		"modal-header",
		"py-0",
	]);

	const title = dom.createAndAppend(modalHeader, "h3", "modal-title");

	createCloseModalButton(modalHeader);

	return modalHeader;
}

function createCloseModalButton(modalHeader) {
	const btnClose = dom.createAndAppend(modalHeader, "button", [
		"btn-close",
		"me-0",
	]);

	btnClose.setAttribute("aria-label", "Close");
	btnClose.setAttribute("data-dismiss", "modal");
	btnClose.addEventListener("click", removeModal);
}

function setModalTitle(modalHeader, title, subtitle) {
	modalHeader.querySelector("*").textContent = `${title} (${subtitle})`;
}

function setModalTagline(film, card) {
	const cardTitle = card.querySelector(".card-title");
	cardTitle.remove();
	const cardSubtitle = card.querySelector(".card-subtitle");
	cardSubtitle.classList = "card-subtitle fst-italic"; // overrides previous styling
	setCardSubtitle(cardSubtitle, film.info.tagline);
}

function setModalCardStyling(card) {
	card.classList.remove("row", "flex-row");
	card.classList.add("rounded-0");

	const cardImg = card.querySelector(".cover");
	cardImg.classList.remove("rounded-top");
	const cardBody = card.querySelector(".card-body");
	unflexCardOnWideScreen(cardImg, cardBody);
}

function removeModal(e) {
	const modal = document.querySelector(".modal");
	e.stopPropagation();
	modal.remove();
}

// -- card components and functions
function createCardWrapper(item) {
	let wrapperType = item.info.homepage ? "a" : "div";

	let cardWrapper = dom.create(wrapperType, ["card-wrapper"]);

	if (item.info.homepage) {
		cardWrapper.classList.add("redirect");
		cardWrapper.href = item.info.homepage;
		cardWrapper.target = "_blank";
	}

	return cardWrapper;
}

function createCard(item, extend) {
	//h-100 makes all card equal height
	let card = dom.create("article", ["row", "card", "h-100", "flex-row"]);

	const cardImg = createCardImg(item, card);

	const cardBody = createCardBody(item, extend);

	if (extend) {
		flexCardOnWideScreen(cardImg, cardBody);
	}

	card.append(cardImg, cardBody);

	return { card, cardImg, cardBody };
}

function createCardImg(item, card) {
	const cardImg = dom.create("div", [
		"cover",
		"card-img-start",
		"col-fluid",
		"rounded-top",
	]);

	setCardImg(cardImg, item.info.img);

	if (item.info.genres) {
		createGenres(cardImg, item.info.genres);
	}

	if (item.info.homepage) {
		addWatchFilmFunctionality(cardImg, card, item.info.homepage);
	}

	return cardImg;
}

function createGenres(parent, genres) {
	parent.classList.add(
		"d-flex",
		"flex-column-reverse",
		"justify-content-between",
		"p-3"
	);

	const genresContainer = dom.createAndAppend(parent, "div", [
		"d-flex",
		"justify-self-end",
		"flex-wrap-reverse",
		"align-items-start",
		"align-content-start_",
		"justify-content-end",
		"gap-2",
	]);

	for (const genre of genres) {
		dom.createAndAppend(
			genresContainer,
			"span",
			["badge", "bg-secondary"],
			genre
		);
	}
}

function createCardBody(item, extend) {
	const cardBody = dom.create("div", [
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
	setCardTitle(cardTitle, item.info.name);

	const cardSubtitle = dom.createAndAppend(cardTitleWrapper, "span", [
		"card-subtitle",
		"ms-2",
	]);
	setCardSubtitle(
		cardSubtitle,
		item.type == "person" ? item.info.role : item.info.release
	);

	if (extend) {
		createExtendedCardInfo(cardBody, item);
	}

	return cardBody;
}

function createExtendedCardInfo(cardBody, item) {
	if (item.info.description) {
		const infoBlock = dom.create(
			"p",
			"extended-info-block",
			item.info.description
		);
		addToCardBody(cardBody, infoBlock);
	}

	if (item.info.known_for) {
		const knownWorks = dom.create("div", "works");
		addToCardBody(cardBody, knownWorks);

		for (const work of item.info.known_for) {
			// console.log(work);
			const text = `(${work.type}) ${work.title}`;
			const p = dom.createAndAppend(knownWorks, "p", "work", text);

			p.addEventListener("click", () => {
				createFilmModal({ id: work.id, type: work.type });
			});
		}
	}
}

// --- card customization
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
	cardImg.classList.add("col-md-5", "col-lg-3", "rounded-start-md_");
	cardBody.classList.add("col-md-7");
}

function unflexCardOnWideScreen(cardImg, cardBody) {
	cardImg.classList.remove("col-md-5", "col-lg-3", "rounded-start-md_");
	cardBody.classList.remove("col-md-7");
}

function addWatchFilmFunctionality(imageWrapper, card, link) {
	const watchButton = dom.createAndAppend(
		imageWrapper,
		"span",
		["watch-film", "badge", "align-self-end", "fs-6"],
		"Watch Film"
	);

	card.addEventListener("mouseover", handleCardMouseOver);
	card.addEventListener("mouseout", handleCardMouseOut);

	// MOUSE HANDLER FUNCTIONS
	function handleCardMouseOver() {
		anime({
			targets: card.querySelector(".watch-film"),
			easing: "linear",
			duration: 100,
			backgroundColor: "#f8f9fa",
			color: "#111",
		});

		if (cardIsNotInModal()) {
			anime({
				targets: card,
				scale: 1.03,
			});
		}
	}

	function handleCardMouseOut() {
		anime({
			targets: card.querySelector(".watch-film"),
			duration: 100,
			easing: "linear",
			backgroundColor: "#343a40",
			color: "#f8f9fa",
		});

		if (cardIsNotInModal()) {
			anime({
				targets: card,
				scale: 1,
			});
		}
	}

	function cardIsNotInModal() {
		return card.closest(".modal-content") == null;
	}
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
	let unifiedData = {
		type: itemsType,
		id: data.id,
		info: {
			name: data.title || data.name,
			release: data.release_date || data.first_air_date,
			img: data.poster_path || data.backdrop_path,
			description: data.overview,
			tagline: data.tagline,
			homepage: data.homepage,
			genres:
				itemsType !== "person"
					? data.genres.map((genre) => genre.name)
					: undefined,
		},
	};

	unifiedData.info.release = unifiedData.info.release
		? getReleaseYear(unifiedData.info.release)
		: "—";

	if (itemsType == "person") {
		unifiedData.info = {
			name: data.name,
			role: data.known_for_department,
			known_for: data.known_for.map((work) => ({
				type: work.media_type,
				title: work.title || work.name,
				id: work.id,
			})),
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
