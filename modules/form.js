import { searchAPI } from "./old/fetchMovies.js";

export async function handleSubmit(e) {
	e.preventDefault();

	const search = {
		type: getSelectedType(),
		query: getQueryString(),
	};

	console.log(search);
	console.log(searchAPI(search));

	const response = await fetch(searchAPI(search));

	console.log(response);

	if (response.ok) {
		const movies = await response.json();
		//display movies
		return movies.results;
	} else {
		throw "ERROR";
	}
}

function getQueryString() {
	const queryString = document.querySelector("input[type=text]").value;
	return queryString.replaceAll(" ", "%20");
}

function getSelectedType() {
	const select = document.querySelector("select");
	return select.options[select.selectedIndex].value;
}
