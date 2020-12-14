import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE
  }
};

export const loadRecipe = async (id) => {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    const renameField = (obj, dst, src) => { obj[dst] = obj[src]; delete obj[src]; }
    let { recipe } = data.data;

    renameField(recipe, 'sourceUrl', 'source_url');
    renameField(recipe, 'image', 'image_url');
    renameField(recipe, 'cookingTime', 'cooking_time');
    Object.assign(state.recipe, recipe);
    console.log(state.recipe);
  } catch (err) {
    console.error(`💥 ${err} 💥`);
    throw err;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    state.search.page = 1;

    const data = await getJSON(`${API_URL}?search=${query}`);
    let { recipes } = data.data;
    state.search.results = recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url
      };
    });
    console.log(state.search.results);
  } catch (err) {
    console.error(`💥 ${err} 💥`);
    throw err;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = (servings) => {
  state.recipe.ingredients.forEach(ing => {
    // newQty = oldQty * newServings / oldServings
    ing.quantity = ing.quantity * servings / state.recipe.servings;
  });
  state.recipe.servings = servings;
};