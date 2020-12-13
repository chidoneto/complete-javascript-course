class searchView {
  constructor() {
    this._parentElement = document.querySelector('.search');
  }

  getQuery() {
    const res = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return res;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerQuery(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();