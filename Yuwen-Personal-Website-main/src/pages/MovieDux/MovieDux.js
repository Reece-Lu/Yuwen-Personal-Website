import React from "react";
import MoviesGrid from "./MoviesGrid";

function MovieDux() {
  return (
    <div className="moviedux-page">
      <h1>MovieDux</h1>
      <p>MovieDux is a movie recommendation system that uses Redux for state management.</p>
      <p>It allows users to search for movies, view details, and add them to their watchlist.</p>
        <MoviesGrid/>
    </div>
  );
}
export default MovieDux;
