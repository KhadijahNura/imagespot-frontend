import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Images | Imagespot');
  }

  async getHTML() {
    return `
        <link rel="stylesheet" href="./static/css/pages/images.css" />

        <section
          class="section images-section has-bg-image"
          aria-labelledby="uploaded images"
          style="background-image: url('./static/images/image-bg.png')"
        >
          <div class="container">
            <h2 class="sr-only">Images</h2>
            <div class="search-form-container">
              <form class="search-form" onsubmit="event.preventDefault(); searchImages();">
                <input type="text" id="search" oninput="searchImages();" class="search-input" placeholder="Search for image" />
                <button type="submit" class="search-btn">Search</button>
              </form>
            </div>
            <div class="cards image-cards-container">
            </div>
          </div>
        </section>
    `;
  }
}
