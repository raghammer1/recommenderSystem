import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';

const Container = styled('div')({
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
});

const MovieList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

const MovieItem = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  maxWidth: '600px',
  backgroundColor: '#f5f5f5',
  padding: '10px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const Recommendations = styled('div')({
  margin: '20px 0',
  padding: '10px',
  backgroundColor: '#f0f0f0',
  borderRadius: '8px',
  maxWidth: '600px',
});

const Title = styled('h2')({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: 0,
});

const RecommendationsTitle = styled('h2')({
  fontSize: '1.25rem',
  marginBottom: '10px',
});

function AboutPage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [recommendation, setRecommendation] = useState([]);
  const [title, setTitle] = useState('');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const moviesPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/movies`);
        const data = await response.json();
        setMovies(data);
        setFilteredMovies(data); // Initially, filteredMovies should contain all movies
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (title) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/recommender?title=${encodeURIComponent(
              title
            )}`
          );
          const data = await response.json();
          console.log(JSON.parse(data.data));
          setRecommendation(JSON.parse(data.data));
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [title]);

  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(filtered);
    setPage(1); // Reset to the first page after filtering
  }, [searchQuery, movies]);

  const handleMovieClick = (movie) => {
    setTitle(movie.title);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Pagination logic
  const startIndex = (page - 1) * moviesPerPage;
  const currentMovies = filteredMovies.slice(
    startIndex,
    startIndex + moviesPerPage
  );

  return (
    <Container>
      <h1>Movies</h1>
      <TextField
        label="Search Movies"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />
      <Recommendations>
        <RecommendationsTitle>Recommendations</RecommendationsTitle>
        <ul>
          {Object.entries(recommendation).map(([id, title]) => (
            <li key={id}>{title}</li>
          ))}
        </ul>
      </Recommendations>
      <MovieList>
        {currentMovies.map((movie, index) => (
          <MovieItem key={index} onClick={() => handleMovieClick(movie)}>
            <Title>{movie.title}</Title>
          </MovieItem>
        ))}
      </MovieList>
      <Pagination
        count={Math.ceil(filteredMovies.length / moviesPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ marginTop: '20px' }}
      />
    </Container>
  );
}

export default AboutPage;
