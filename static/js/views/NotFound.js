import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('404 | Imagespot');
  }

  async getHTML() {
    return `
      <section id="not-found">
        <h2>Not Found</h2>
        <p>
         The page you're looking for does not exist
        </p>
        </br>
        <p><a href="/">Go back to home page</a>
      </section>
    `;
  }
}
