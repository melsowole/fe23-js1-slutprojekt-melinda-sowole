// import { topMovies } from "./modules/old/fetchMovies.js";
// import { handleSubmit } from "./modules/form.js";
import { api } from "./modules/api.js";
import { display } from "./modules/domBuilder.js";

// api.fetchSearch({ type: "movie", query: "batman" }).then((results) => {
// 	console.log(results);
// 	display.listSection("#results", "results", results, "results");
// });

api.fetchSearch({ type: "person", query: "christian bale" }).then((data) => {
	display.listSection(
		"#results",
		`${data.results.length} Result${data.results.length == 1 ? "" : "s"}`,
		data
	);
});

// api.fetchSearch({ type: "tv", query: "game of thrones" }).then((data) => {
// 	display.listSection(
// 		"#results",
// 		`${data.results.length} Result${data.results.length == 1 ? "" : "s"}`,
// 		data
// 	);
// });

// document.querySelector("form").addEventListener("submit", handleSubmit);
