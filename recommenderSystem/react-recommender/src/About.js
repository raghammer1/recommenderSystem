import React, { useState, useEffect } from 'react';

function AboutPage() {
  const [movies, setMovies] = useState([]); // Initialize movies as an array
  const [recommendation, setRecommendation] = useState([]); // Initialize movies as an array
  const [title, setTitle] = useState(''); // Initialize movies as an array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/movies`);
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const title = "Pirates of the Caribbean: At World's End";
        const response = await fetch(
          `http://localhost:3001/recommender?title=${title}`
        );
        const data = await response.json();
        console.log(JSON.parse(data.data));
        setRecommendation(JSON.parse(data.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [title]);

  const handleMovieClick = (movie) => {
    setTitle(movie.title);
  };

  return (
    <div>
      <h1>Movies</h1>
      <div>
        <h2>Recommendations</h2>
        <ul>
          {Object.entries(recommendation).map(([id, title]) => (
            <li key={id}>{title}</li>
          ))}
        </ul>
      </div>
      <div>
        {movies.map((movie, index) => (
          <div key={index}>
            <button
              onClick={() => handleMovieClick(movie)}
              style={{ all: 'unset', cursor: 'pointer' }}
            >
              <h2>{movie.title}</h2>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutPage;
