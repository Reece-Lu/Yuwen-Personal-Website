import React, {useState, useEffect} from 'react';
import '../MovieDux/MovieDux.styles.css';

export default function MoviesGrid() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("movies.json").then((res) => res.json()).then((data) => setMovies(data));
  }, []);

  return (
    <div className='movies-grid'>
      {
        movies.map(movie=>(
            <div key={movie.id} className='movies-card'>
              <img src={`images/movieduxImages/${movie.image}`} alt={movie.title} className='movie-image' />
              <div className='movies-card-info'>
                <h3 className='movie-card-title'>{movie.title}</h3>
                <p className='movie-card-genre'>{movie.genre}</p>
                <p className='movie-card-rating'>{movie.rating}</p>
              </div>
            </div>
        ))
      }
    </div>

  );
}



