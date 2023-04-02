import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Imagespot - Discover and Share Beautiful Images');
  }

  async getHTML() {
    return `
        <section class="section hero" aria-label="home">
          <div class="container">
            <div class="hero-content">
              <!-- <p class="hero-subtitle">Introducing an image sharing platform</p> -->

              <h1 class="headline-lg">Imagespot</h1>

              <p class="hero-text body-md">
                Image sharing, upload, viewing and download has never been so
                easy
              </p>

              <a href="/login" class="btn btn-primary" data-link>Get Started</a>
            </div>

            <figure class="hero-banner">
              <img
                src="./static/images/hero-img.svg"
                width="680"
                height="645"
                class="w-100"
              />
            </figure>
          </div>
        </section>

        <!--
        - #CLIENT
      -->

        <section class="client" aria-label="Sample images">
          <div class="container">
            <ul class="slider">
              <li class="slider-item">
                <img
                  src="./static/images/image-1.svg"
                  width="130"
                  height="40"
                  alt="shared image"
                  class="w-100"
                />
              </li>

              <li class="slider-item">
                <img
                  src="./static/images/image-2.svg"
                  width="130"
                  height="40"
                  alt="shared image"
                  class="w-100"
                />
              </li>

              <li class="slider-item">
                <img
                  src="./static/images/image-1.svg"
                  width="130"
                  height="40"
                  alt="shared image"
                  class="w-100"
                />
              </li>

              <li class="slider-item">
                <img
                  src="./static/images/image-2.svg"
                  width="130"
                  height="40"
                  alt="shared image"
                  class="w-100"
                />
              </li>

              <li class="slider-item">
                <img
                  src="./static/images/image-1.svg"
                  width="130"
                  height="40"
                  alt="shared image"
                  class="w-100"
                />
              </li>
            </ul>
          </div>
        </section>

        <!--
        - #ABOUT
      -->

        <section class="section about" aria-label="about image spot">
          <div class="container">
            <figure class="about-banner">
              <img
                src="./static/images/logo.svg"
                width="580"
                height="554"
                loading="lazy"
                alt="Imagespot logo"
                class="w-100"
              />
            </figure>

            <div class="about-content">
              <h2 class="title-lg">
                Imagespot is an image sharing web app that allows you to upload,
                view, and share images with others.
              </h2>

              <p class="body-md section-text">
                We aim to provide a platform for people to share and discover
                beautiful, interesting, and meaningful images
              </p>

              <div class="wrapper">
                <a href="/images" class="btn btn-primary" data-link>View Images</a>

                <a href="/upload" class="btn btn-secondary"
                  data-link>Upload Image</a
                >
              </div>
            </div>
          </div>
        </section>
    `;
  }
}
