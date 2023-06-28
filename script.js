const searchInput = document.getElementById('search-input');
const suggestionsContainer = document.getElementById('suggestions-container');
const resultsContainer = document.getElementById('results-container');
const favContainer = document.getElementById('fav-container');

let favourites = [];

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

          //create fav button
          const favButton = document.createElement('button');
          favButton.textContent = 'Add to Fav';
          favButton.classList.add('Add-to-fav');
          suggestionsContainer.appendChild(favButton);

          suggestion.appendChild(mealImage);
          suggestionsContainer.appendChild(suggestion);

          // Event delegation for suggestion click events
          favButton.addEventListener('click', event => {
            favourites.push(meal.strMeal);
            console.log(meal.strMeal);
          });
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

function showMealDetails(meal) {
  // Clear the results container
  resultsContainer.innerHTML = '';

  // Create a close button
  const closeButton = document.createElement('span');
  closeButton.classList.add('modal-close');
  closeButton.textContent = 'X';
  closeButton.addEventListener('click', () => {
    resultsContainer.classList.remove('modal-open');
  });

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
  resultsContainer.appendChild(closeButton);
  resultsContainer.appendChild(mealName);
  resultsContainer.appendChild(mealImage);
  resultsContainer.appendChild(instructions);

  // Show the modal
  resultsContainer.classList.add('modal-open');
}



// Event delegation for Favourites click events
favContainer.addEventListener('click', event => {
  showFav();
});


//To Display all the Favourites
async function showFav() {
  let meals = [];
  for (let i = 0; i < favourites.length; i++) {
      try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${favourites[i]}`);
          const data = await response.json();
          if (data.meals) {
              meals.push(data.meals[0]);
          }
      } catch (error) {
          console.error('Error fetching meal details:', error);
      }
  }
  showFavDetails(meals);
}

function showFavDetails(meals) {
  // First, clear all previous modals
  const existingModals = document.querySelectorAll('.modal');
  existingModals.forEach(modal => modal.remove());

  // Then, create a new modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'block';

  const content = document.createElement('div');
  content.className = 'modal-content';

  meals.forEach((meal, index) => {
      const mealName = document.createElement('h2');
      mealName.textContent = meal.strMeal;

      const mealImage = document.createElement('img');
      mealImage.src = meal.strMealThumb;
      mealImage.alt = meal.strMeal;

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Delete';
      removeButton.classList.add('delete-button');
      removeButton.onclick = function() {
          // remove the meal from favourites
          const removedFavourite = favourites.splice(index, 1);
          console.log(`Removed ${removedFavourite} from favourites.`);
          
          // then remove it from the modal
          mealName.remove();
          mealImage.remove();
          removeButton.remove();
      }
      
      content.appendChild(mealName);
      content.appendChild(mealImage);
      content.appendChild(removeButton);
  });

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('modal-close');
  modal.appendChild(closeButton);
  closeButton.onclick = function () {
      modal.style.display = 'none';
  }

  modal.appendChild(content);
  document.body.appendChild(modal);
}
