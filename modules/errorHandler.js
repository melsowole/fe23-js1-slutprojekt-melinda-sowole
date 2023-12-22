import { display } from "./domCardBuilder.js";

export function handleError(errorCode) {
	let errorType = "Server Issue";
	let errorMessage =
		"Uh-oh! We're experiencing some technical difficulties. Please try again later.";

	if (errorCode == 404) {
		errorType = "No Results Found";
		errorMessage = [
			"Sorry, but your search didn't yield any results.",
			"Confirm your category and check for any typos in your search term, then try again.",
		];
	} else if (errorCode == 400) {
		errorType = "Bad Request";
		errorMessage =
			"Whoops! Looks like you forgot to enter a search query. Please type something and try again.";
	}

	display.errorMessage(errorType, errorMessage);
	console.log(errorCode);
}
