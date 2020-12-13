import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './views/resultsView.js';

const controlRecipes = async (id) => {
  try {
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    console.log(model.state.search.results);
    resultsView.render(model.state.search.results);
  } catch (err) {
    console.error(err);
  }
};
// controlSearchResults();

// controlRecipes('5ed6604591c37cdc054bc8fd');
// controlRecipes('5ed6604591c37cdc054bc886');

const onShowRecipe = () => {
  const id = window.location.hash;
  console.log(`onShowRecipe(${id})`);
  id && controlRecipes(id.slice(1));
};

const init = () => {
  recipeView.addHandlerRender(onShowRecipe);
  searchView.addHandlerQuery(controlSearchResults);
};
init();

