document.addEventListener('DOMContentLoaded', () => {
    const movieForm = document.getElementById('movieForm');
    const movieInput = document.getElementById('movieInput');
    const movieResults = document.getElementById('movieResults');
    const ratingsList = document.getElementById('ratingsList');

    const apiKey = '47d49e76'; // Replace with your OMDB API key
    const apiUrl = 'https://www.omdbapi.com/';
    let ratings = JSON.parse(localStorage.getItem('movieRatings')) || [];

    movieForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const movieTitle = movieInput.value;
        searchMovies(movieTitle);
    });

    async function searchMovies(title) {
        try {
            const response = await fetch(`${apiUrl}?s=${title}&apikey=${apiKey}`);
            const data = await response.json();
            displayMovies(data.Search);
        } catch (error) {
            console.error('Error fetching movie data:', error);
            movieResults.innerHTML = `<p>Failed to retrieve movie data. Please try again.</p>`;
        }
    }

    function displayMovies(movies) {
        if (!movies) {
            movieResults.innerHTML = `<p>No movies found. Please try a different search.</p>`;
            return;
        }

        movieResults.innerHTML = movies.map(movie => `
            <div class="movie">
                <img src="${movie.Poster}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                <input type="number" min="1" max="5" placeholder="Rate 1-5" class="ratingInput">
                <button onclick="rateMovie('${movie.imdbID}', '${movie.Title}')">Rate</button>
            </div>
        `).join('');
    }

    window.rateMovie = (id, title) => {
        const ratingInput = document.querySelector(`input.ratingInput`);
        const ratingValue = ratingInput.value;
        if (ratingValue < 1 || ratingValue > 5) {
            alert("Please enter a rating between 1 and 5.");
            return;
        }
        const rating = {
            id,
            title,
            rating: ratingValue
        };
        ratings.push(rating);
        localStorage.setItem('movieRatings', JSON.stringify(ratings));
        displayRatings();
    }

    function displayRatings() {
        ratingsList.innerHTML = ratings.map(rating => `
            <li>
                <p>${rating.title}</p>
                <p>Rating: ${rating.rating}</p>
            </li>
        `).join('');
    }

    
    displayRatings();
});
