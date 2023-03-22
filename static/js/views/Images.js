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
          style="background-image: url('../images/image-bg.png')"
        >
          <div class="container">
            <h2 class="sr-only">Images</h2>
            <div class="cards">

              <div class="card">
                <img
                  class="card__image"
                  src="https://fakeimg.pl/400x300/009578/fff/"
                  alt="shared image"
                />
                <div class="card__content" aria-label="Image description">
                  <p>
                    <span class="card__content-title">Description:</span> Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
                    ducimus id ab tenetur delectus reiciendis fugit autem qui
                    at.
                  </p>
                  <p>
                    <span class="card__content-title">Author:</span>
                    Leeyah
                  </p>
                </div>
                <div class="card__info">
                  <a href="/images" class="card__link" data-link>View</a>
                </div>
              </div>

            </div>
          </div>
        </section>

        <script src="static/js/scripts/images.js"></script>
    `;
  }
}
