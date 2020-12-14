import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.results');
    this._errorMessage = 'No recipes found for your query! Please try again ;)';
    this._message = '';
  }

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
