const searchInput = document.getElementById('search-input');
const suggestionsContainer = document.getElementById('suggestions-container');
const resultsContainer = document.getElementById('results-container');
const favouritesList = document.getElementById('favourites-list');

// Event listener for search input
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') {
    suggestionsContainer.innerHTML = '';
    resultsContainer.innerHTML = '';
    return;
  }

  // Fetch meal suggestions from API
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      suggestionsContainer.innerHTML = '';
      if (data.meals) {
        data.meals.forEach(meal => {
          const suggestion = document.createElement('div');
          suggestion.classList.add('suggestion');
          suggestion.textContent = meal.strMeal;

          // Create an image element
          const mealImage = document.createElement('img');
          mealImage.src = meal.strMealThumb;
          mealImage.alt = meal.strMeal;
          mealImage.classList.add('meal-image');

          suggestion.appendChild(mealImage);
          suggestionsContainer.appendChild(suggestion);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching meal suggestions:', error);
    });
});

// Event delegation for suggestion click events
suggestionsContainer.addEventListener('click', event => {
  const clickedSuggestion = event.target.closest('.suggestion');
  if (clickedSuggestion) {
    const clickedMealName = clickedSuggestion.textContent;
    getMealDetails(clickedMealName);
  }
});


// Fetch meal details from API and display on meal page
function getMealDetails(mealName) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        const meal = data.meals[0];
        // Display meal details on a new page or modal
        showMealDetails(meal);
      }
    })
    .catch(error => {
      console.error('Error fetching meal details:', error);
    });
}

// Function to display meal details
function showMealDetails(meal) {
  // Clear the results container
  resultsContainer.innerHTML = '';

  // Create elements to display the meal details
  const mealName = document.createElement('h2');
  mealName.textContent = meal.strMeal;

  const mealImage = document.createElement('img');
  mealImage.src = meal.strMealThumb;
  mealImage.alt = meal.strMeal;
  mealImage.classList.add('meal-image');

  const instructions = document.createElement('p');
  instructions.textContent = meal.strInstructions;

  // Append elements to the results container
  resultsContainer.appendChild(mealName);
  resultsContainer.appendChild(mealImage);
  resultsContainer.appendChild(instructions);
}
