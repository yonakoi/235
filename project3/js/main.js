// main.js
class Drink {
    constructor(name, ingredients) {
      this.name = name;
      this.ingredients = ingredients;
    }
  }
  
  // Define recipes
  const recipes = [
    {
      name: "Cosmopolitan",
      ingredients: {
        vodka: 1,
        "simple-syrup": 4,
        "cranberry-juice": 1,
        lime: 1,
      },
    },
    {
      name: "Old Fashioned",
      ingredients: {
        whiskey: 3,
        "maple-syrup": 2,
        cherry: 1,
        orange: 1,
      },
    },
    {
        name: "Berry Gin Tonic",
        ingredients: {
          gin: 2,
          "strawberry-syrup": 3,
          "tonic-water": 1,
          lime: 1,
          strawberry: 1,
        },
      },
  ];
  
  //track the ingredients selected
  const selectedIngredients = [];
  
  
  // DOM Elements
  const ingredientButtons = document.querySelectorAll('[data-ingredient]');
  const selectedArea = document.getElementById('selected-ingredients');
  const mixButton = document.getElementById('mix-button');
  const resetButton = document.getElementById('reset-button');
  const serveButton = document.getElementById('serve-button');

  
  // Event Listeners
  ingredientButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const ingredientName = button.getAttribute('data-ingredient');
      const existing = selectedIngredients.find((ing) => ing.name === ingredientName);
  
      if (existing) {
        existing.quantity++;
      } else {
        selectedIngredients.push({ name: ingredientName, quantity: 1 });
      }
  
      updateSelectedIngredients();
    });
  });
  
  
  document.querySelector("#mix-button").addEventListener("click", () => {
    console.log("Mix button clicked!");
    const mixingArea = document.getElementById("mixing-area");
    mixingArea.classList.add("mixing");
  
    setTimeout(() => {
      if (mixingArea.classList.contains("mixing")) {
        mixingArea.classList.remove("mixing");
      }
    }, 500);
  
    const result = checkMix();
    if (result) {
      alert(`Success! You made a ${result}.`);
      selectedIngredients.length = 0; // Clear the mixing area
      updateSelectedIngredients(); // Update the UI
    } else {
      alert("Wrong mix! Try again.");
    }
  });
  
  
  document.querySelector("#reset-button").addEventListener("click", () => {
    console.log("Reset button clicked!");
    selectedIngredients.length = 0; // Clear ingredients
    updateSelectedIngredients();
  });
  
  document.querySelector("#serve-button").addEventListener("click", () => {
    console.log("Serve button clicked!");
    checkDrink();
  });
  
  // Helper Functions
  function updateSelectedIngredients() {
    selectedArea.innerHTML = selectedIngredients
      .map(({ name, quantity }) => `<p>${name}: ${quantity}</p>`)
      .join('');
  }
  
    function aggregateIngredients(ingredients) {
    return ingredients.reduce((result, { name, quantity }) => {
      if (!name || !quantity) return result; // Skip invalid entries
      if (!result[name]) result[name] = 0;
      result[name] += quantity;
      return result;
    }, {});
  }
  

  function checkMix() {
    const aggregated = aggregateIngredients(selectedIngredients);
  
    for (const recipe of recipes) {
      const isMatch = Object.entries(recipe.ingredients).every(
        ([name, quantity]) => aggregated[name] === quantity
      );
  
      if (isMatch) {
        return recipe.name; // Successfully mixed drink
      }
    }
  
    return null; // No match found
  }
  
  function checkDrink() {
    const aggregated = aggregateIngredients(selectedIngredients);
  
    const matchedRecipe = recipes.find((recipe) =>
      Object.entries(recipe.ingredients).every(
        ([name, quantity]) => aggregated[name] === quantity
      )
    );
  
    if (matchedRecipe) {
      alert(`Correct! You served a ${matchedRecipe.name}.`);
    } else {
      alert('Wrong drink! Try again.');
    }
  }
  
  