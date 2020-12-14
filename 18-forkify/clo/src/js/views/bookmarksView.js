import View from './View';
import previewView from './previewView';

class BookmarksView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.bookmarks__list');
    this._errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
    this._message = '';
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
  }
}

export default new BookmarksView();
