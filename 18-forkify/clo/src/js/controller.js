import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import resultsView from './views/resultsView.js';

// if (module.hot) module.hot.accept();

const controlRecipes = async (id) => {
  try {
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

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

    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);
    // console.log(model.state.search.results);

    // Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);

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

const controlPagination = (gotoPage) => {
  console.log(`controlPagination(${gotoPage})`);

  // Render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = (newServings) => {
  // Update recipe servings
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = () => {
  recipeView.addHandlerRender(onShowRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerQuery(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();

