import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('404 | Imagespot');
  }

  async getHTML() {
    return `
        <section class="section not-found" aria-labelledby="not found">
          <div class="not-found-container">
            <img src="./static/images/404.png" alt="" />
            <p>The page you're looking for does not exist</p>
            <a href="/" class="btn btn-primary" data-link
              >Go back to home page</a
            >
          </div>
        </section>
    `;
  }
}
