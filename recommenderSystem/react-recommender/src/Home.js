import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <>
      <div>Welcome to the Home Page!</div>
      <div>
        To <Link to="/about">About</Link>!
      </div>
    </>
  );
}

export default HomePage;
