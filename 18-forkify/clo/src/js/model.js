import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE
  },
  bookmarks: []
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
    state.recipe.bookmarked = (state.bookmarks.some(bookmark => bookmark.id === id));
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

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = recipe => {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = id => {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  console.log(index);
  if (index < 0) return;
  state.bookmarks.splice(index, 1);

  // Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = () => {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();