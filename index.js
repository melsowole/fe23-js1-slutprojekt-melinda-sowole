// import { topMovies } from "./modules/old/fetchMovies.js";
// import { handleSubmit } from "./modules/form.js";
import { api } from "./modules/api.js";
import { display } from "./modules/domCardBuilder.js";
import { handleSubmit } from "./modules/formHandler.js";
import {
	displayPopularMovies,
	displayTopRatedMovies,
} from "./modules/movieLists.js";

displayPopularMovies();

displayTopRatedMovies();

document.querySelector("form").addEventListener("submit", handleSubmit);
