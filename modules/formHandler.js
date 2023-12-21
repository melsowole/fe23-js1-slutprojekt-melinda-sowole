import { api } from "./api.js";
import { display } from "./domBuilder.js";
import { handleError } from "./errorHandler.js";

export function handleSubmit(e) {
	// trigger appropriate search
	// if form not filled

	e.preventDefault();

	const type = document.querySelector("select").value;
	const query = document.querySelector("input[type=text]").value;

	if (query.length) {
		api
			.fetchSearch({ type, query })
			.then((data) => {
				display.resultList("#results", data);
			})
			.catch(handleError);
	} else {
		handleError(400);
	}
}
