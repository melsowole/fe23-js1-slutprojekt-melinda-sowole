import { display } from "./domBuilder.js";

export function handleError(errorCode) {
	let errorType = "Server Issue";
	let errorMessage =
		"Uh-oh! We're experiencing some technical difficulties. Please try again later.";

	if (errorCode == 404) {
		errorType = "No Results Found";
		errorMessage =
			"Sorry, but your search didn't yield any results. Try refining your search terms and try again.";
	}

	display.errorMessage(errorType, errorMessage);
}
