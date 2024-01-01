/*
 * Author: Melinda Sowole
 * Date: 05/01/2024
 * Description:
 * 		Final project created as part of the
 * 		Javascript 1 course at Grit Academy Fall23.
 *
 * 		Application uses The Movie Database API to let users search
 * 		for movies, shows and persons, and displays the current
 * 		top 10 rated and popular movies.
 *
 * 		More information about the project requirement can be found
 * 		in plan.txt
 *
 */

import { handleSubmit } from "./modules/formHandler.js";
import {
	displayPopularMovies,
	displayTopRatedMovies,
} from "./modules/movieLists.js";

displayPopularMovies();

displayTopRatedMovies();

document.querySelector("form").addEventListener("submit", handleSubmit);
