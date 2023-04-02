import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Profile | Imagespot');
  }

  async getHTML() {
    return `
        <section
          class="section profile-section has-bg-image"
          aria-labelledby="uploaded images"
          style="background-image: url('./static/images/image-bg.png')"
        >
          <div class="container">
            <div class="profile-text">
              <h2>Personal Details</h2>
              <div class="details-container">
                <p>First Name: <span class="detail" id="first_name"></span></p>
                <p>Last Name: <span class="detail" id="last_name"></span></p>
                <p>Username: <span class="detail" id="username"></span></p>
                <p>Email: <span class="detail" id="email"></span></p>
              </div>
            </div>

            <div class="user-uploads">

              <div class="search-form-container">
                <form class="search-form" onsubmit="event.preventDefault(); searchUploads();">
                  <input type="text" id="search" oninput="searchUploads();" class="search-input" placeholder="Search for image" />
                  <button type="submit" class="search-btn">Search</button>
                </form>
              </div>

              <h3>Your Uploads</h3>
              <div class="cards image-cards-container"></div>
            </div>
          </div>
        </section>
    `;
  }
}
